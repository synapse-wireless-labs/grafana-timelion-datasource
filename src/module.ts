import { DataSourcePlugin } from '@grafana/data';
import { TimeLionDataSource } from './datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { TimeLionQuery, TimeLionDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<TimeLionDataSource, TimeLionQuery, TimeLionDataSourceOptions>(
  TimeLionDataSource
)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
