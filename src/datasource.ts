import {
  ArrayVector,
  DataFrame,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  Field,
  FieldType,
  ScopedVars,
  TimeSeriesValue,
} from '@grafana/data';
import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { defaultQuery, TimeLionDataSourceOptions, TimeLionQuery } from './types';
import XRegExp from 'xregexp';

interface BackendSrvResponse<T = any> {
  data: T;
  status: number;
}

interface TimelionQueryResponse {
  sheet: TimelionQuerySheet[];
  stats: {
    cacheCount: number;
    invokeTime: number;
    queryCount: number;
    queryTime: number;
    sheetTime: number;
  };
}

interface TimelionQuerySheet {
  list: TimelionQueryList[];
  type: string;
}

interface TimelionQueryList {
  data: Array<[number, number]>;
  fit: string;
  label: string;
  split: string;
  type: string;
}

export class TimeLionDataSource extends DataSourceApi<TimeLionQuery, TimeLionDataSourceOptions> {
  basicAuth: string;
  withCredentials: boolean;
  url: string;
  kibanaVersion: string;

  constructor(instanceSettings: DataSourceInstanceSettings<TimeLionDataSourceOptions>) {
    super(instanceSettings);
    this.basicAuth = instanceSettings.basicAuth!;
    this.withCredentials = instanceSettings.withCredentials!;
    this.url = instanceSettings.url!;
    this.kibanaVersion = instanceSettings.jsonData.kibanaVersion;
  }

  private async post(data: any): Promise<BackendSrvResponse<TimelionQueryResponse>> {
    const options: any = {
      url: this.url + '/run',
      method: 'POST',
      data: data,
    };

    options.headers = {
      'Content-Type': 'application/json',
      'kbn-version': this.kibanaVersion,
      ...(this.basicAuth
        ? {
            Authorization: this.basicAuth,
          }
        : {}),
    };

    if (this.basicAuth || this.withCredentials) {
      options.withCredentials = true;
    }

    return getBackendSrv().datasourceRequest(options);
  }

  toTimeLionDataFrame(query: TimeLionQuery, list: TimelionQueryList): DataFrame {
    const timeField: Field<number, ArrayVector> = {
      name: 'Time',
      type: FieldType.time,
      config: {},
      values: new ArrayVector<number>(),
    };
    const valueField: Field<TimeSeriesValue, ArrayVector> = {
      name: list.label || 'Value',
      type: FieldType.number,
      config: {},
      values: new ArrayVector<TimeSeriesValue>(),
    };

    return {
      refId: query.refId,
      name: list.label,
      fields: list.data.reduce(
        (fields, cur) => {
          fields[0].values.add(cur[1]);
          fields[1].values.add(cur[0]);
          return fields;
        },
        [timeField, valueField]
      ),
      length: list.data.length,
    };
  }

  async queryTarget(query: TimeLionQuery, options: DataQueryRequest<TimeLionQuery>): Promise<DataFrame[]> {
    return await Promise.all(
      this.divideTimeLionOperations(query).map(sheet =>
        this.post({
          sheet: [sheet],
          time: {
            timezone: options.range.from.format('ZZ'),
            from: options.range.from.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            interval: options.interval,
            mode: 'absolute',
            to: options.range.to.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          },
        }).then(rsp => rsp.data.sheet[0].list.map(list => this.toTimeLionDataFrame(query, list)))
      )
    ).then(frames => frames.reduce((acc, cur) => acc.concat(cur), []));
  }

  async query(options: DataQueryRequest<TimeLionQuery>): Promise<DataQueryResponse> {
    const filterdTargets = options.targets.filter(tgt => tgt.queryText !== defaultQuery.queryText && !tgt.hide);
    const interpolated = this.interpolateVariablesInQueries(filterdTargets, options.scopedVars);

    const data = await Promise.all(interpolated.map(tgt => this.queryTarget(tgt, options))).then(frames =>
      frames.reduce((acc, cur) => acc.concat(cur), [])
    );

    return { data };
  }

  divideTimeLionOperations(query: TimeLionQuery): string[] {
    // (?                # Timelion operation
    //   \.\w+             # Starts with .word
    //     \(                # Argument list
    //       (?:               # Possible operation contents
    //         \(                # 1. Argument list
    //           (?:                  # Possible operation contents
    //             \(                   # 1. Argument list
    //               (?:                     # Possible contents
    //                 \(                      # 1. Argument list
    //                   .*?                     Zero or more characters (lazy)
    //                 \) |                    # End of argument list - OR
    //                 ".*?"   |               # 2. Something in quotes (lazy) OR
    //                 .*?                     # 3. Zero or more characters (lazy)
    //               )*?                     # Zero or more (lazy)
    //             \)        |          # End of argument list - OR
    //             ".*?"     |          # 2. Something in quotes (lazy) OR
    //             .*?                  # 3. Zero or more characters (lazy)
    //           )*?                  # Zero or more (lazy)
    //         \)          |     # End of argument list - OR
    //         ".*?"       |     # 2. Something in quotes (lazy) OR
    //         .*?               # 3. Zero or more characters (lazy)
    //       )*?               # Zero or more (lazy)
    //     \)                # End of argument list
    // )+
    const regex = /(?:\.\w+\((?:\((?:\((?:\(.*?\)|".*?"|.*?)*?\)|".*?"|.*?)*?\)|".*?"|.*?)*?\))+/g;
    return XRegExp.match(query.queryText, regex, 'all');
  }

  interpolateVariablesInQueries(queries: TimeLionQuery[], scopedVars: ScopedVars): TimeLionQuery[] {
    return queries.map(query => ({
      ...query,
      datasource: this.name,
      queryText: getTemplateSrv().replace(query.queryText, scopedVars, 'lucene'),
    }));
  }

  async testDatasource() {
    const rsp = await this.post({ time: { from: 'now-1s', to: 'now', interval: '1s' } });

    if (rsp.status === 200) {
      return { status: 'success', message: 'Data source is working', title: 'Success' };
    } else {
      return { status: 'error', message: 'Data source is not working', title: 'Error' };
    }
  }
}
