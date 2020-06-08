import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  ScopedVars,
} from '@grafana/data';
import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { defaultQuery, TimeLionDataSourceOptions, TimeLionQuery } from './types';
import XRegExp from 'xregexp';

export class TimeLionDataSource extends DataSourceApi<TimeLionQuery, TimeLionDataSourceOptions> {
  basicAuth: string;
  withCredentials: boolean;
  url: string;

  constructor(instanceSettings: DataSourceInstanceSettings<TimeLionDataSourceOptions>) {
    super(instanceSettings);
    this.basicAuth = instanceSettings.basicAuth!;
    this.withCredentials = instanceSettings.withCredentials!;
    this.url = instanceSettings.url!;
  }

  private timelionPost(data: any) {
    const options: any = {
      url: this.url + '/run',
      method: 'POST',
      data: data,
    };

    if (this.basicAuth || this.withCredentials) {
      options.withCredentials = true;
    }
    if (this.basicAuth) {
      options.headers = {
        Authorization: this.basicAuth,
      };
    }

    return getBackendSrv().datasourceRequest(options);
  }

  async query(options: DataQueryRequest<TimeLionQuery>): Promise<DataQueryResponse> {
    const queries = options.targets
      .filter(tgt => tgt.queryText !== defaultQuery.queryText && !tgt.hide)
      .map(t => getTemplateSrv().replace(t.queryText, options.scopedVars, 'lucene'))
      .map(str => this.divideTimeLionQueries(str))
      .reduce((acc, cur) => acc.concat(cur), []);

    const responses = await Promise.all(
      queries.map(async q =>
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

    return {
      data: responses.map(rsp =>
        rsp.data.sheet
          .map((sheet: any) => sheet.list)
          .reduce((acc: any[], cur: any) => acc.concat(cur), [])
          .map((list: any) => ({
            target: list.label,
            datapoints: list.data.map((d: [any, any]) => [d[1], d[0]]),
          }))
      ),
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
