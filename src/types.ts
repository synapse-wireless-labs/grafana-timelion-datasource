import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface TimeLionQuery extends DataQuery {
  interval?: string;
  target: string;
}

export const defaultQuery: Partial<TimeLionQuery> = {
  target: '.es()',
};

export interface TimeLionDataSourceOptions extends DataSourceJsonData {
  esVersion: string;
}
