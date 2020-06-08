import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface TimeLionQuery extends DataQuery {
  queryText: string;
}

export const defaultQuery: Partial<TimeLionQuery> = {
  queryText: '.es()',
};

export interface TimeLionDataSourceOptions extends DataSourceJsonData {}
