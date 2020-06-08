import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  ScopedVars,
  toDataFrame,
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

  private async timelionPost(data: any): Promise<BackendSrvResponse<TimelionQueryResponse>> {
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

  async query(options: DataQueryRequest<TimeLionQuery>): Promise<DataQueryResponse> {
    const frames = await Promise.all(
      options.targets
        .filter(tgt => tgt.queryText !== defaultQuery.queryText && !tgt.hide)
        .map(async t => {
          const interpolated = getTemplateSrv().replace(t.queryText, options.scopedVars, 'lucene');

          const tlQueries = this.divideTimeLionQueries(interpolated);

          const tlResponses = await Promise.all(
            tlQueries.map(q =>
              this.timelionPost({
                sheet: [q],
                time: {
                  timezone: options.range.from.format('ZZ'),
                  from: options.range.from.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                  interval: 'auto',
                  mode: 'absolute',
                  to: options.range.to.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                },
              })
            )
          );

          return tlResponses
            .map(rsp =>
              rsp.data.sheet
                .map(sheet => sheet.list)
                .reduce((acc, cur) => acc.concat(cur), [])
                .map(list =>
                  toDataFrame({
                    datapoints: list.data.map(d => [d[1], d[0]]),
                  })
                )
            )
            .reduce((acc, cur) => acc.concat(cur), []);
        })
    );

    return {
      data: frames.reduce((acc, cur) => acc.concat(cur), []),
    };
  }

  divideTimeLionQueries(str: string): string[] {
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
    return XRegExp.match(str, regex, 'all');
  }

  interpolateVariablesInQueries(queries: TimeLionQuery[], scopedVars: ScopedVars): TimeLionQuery[] {
    return queries.map(query => ({
      ...query,
      datasource: this.name,
      query: getTemplateSrv().replace(query.queryText, scopedVars, 'lucene'),
    }));
  }

  async testDatasource() {
    const rsp = await this.timelionPost({ time: { from: 'now-1s', to: 'now', interval: '1s' } });

    if (rsp.status === 200) {
      return { status: 'success', message: 'Data source is working', title: 'Success' };
    } else {
      return { status: 'error', message: 'Data source is not working', title: 'Error' };
    }
  }
}
