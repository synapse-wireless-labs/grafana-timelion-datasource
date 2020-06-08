import React, { useEffect } from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { TimeLionDataSourceOptions } from './types';

interface Props extends DataSourcePluginOptionsEditorProps<TimeLionDataSourceOptions> {}

export const ConfigEditor = (props: Props) => {
  const { options, onOptionsChange } = props;

  // Apply some defaults on initial render
  useEffect(() => {
    onOptionsChange(options);
  }, []);

  return (
    <DataSourceHttpSettings
      defaultUrl={'http://localhost:3100'}
      dataSourceConfig={options}
      showAccessOptions={true}
      onChange={onOptionsChange}
    />
  );
};
