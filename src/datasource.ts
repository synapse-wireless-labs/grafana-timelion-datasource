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

  async query(options: DataQueryRequest<TimeLionQuery>): Promise<DataQueryResponse> {
    const filterdTargets = options.targets.filter(tgt => tgt.queryText !== defaultQuery.queryText && !tgt.hide);

    const targetResults = await Promise.all(
      this.interpolateVariablesInQueries(filterdTargets, options.scopedVars).map(tgt => this.runQuery(tgt, options))
    );

    return { data: targetResults };
  }

  async runQuery(query: TimeLionQuery, options: DataQueryRequest<TimeLionQuery>): Promise<DataFrame> {
    return this.post({
      sheet: [query.queryText],
      time: {
        timezone: options.range.from.format('ZZ'),
        from: options.range.from.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        interval: options.interval,
        mode: 'absolute',
        to: options.range.to.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      },
    }).then(rsp => this.toTimeLionDataFrame(query, rsp.data.sheet[0].list[0]));
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
          fields[0].values.add(cur[0]);
          fields[1].values.add(cur[1]);
          return fields;
        },
        [timeField, valueField]
      ),
      length: list.data.length,
    };
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
}
