import React, { ChangeEvent, useEffect } from 'react';
import { DataSourceHttpSettings, LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps, DataSourceSettings } from '@grafana/data';
import { TimeLionDataSourceOptions } from './types';

const { FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<TimeLionDataSourceOptions> {}

export const ConfigEditor = (props: Props) => {
  const { options, onOptionsChange } = props;

  // Apply some defaults on initial render
  useEffect(() => {
    onOptionsChange(options);
  }, []);

  const onHttpSettingsChange = (config: DataSourceSettings) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        ...config.jsonData,
      },
    });
  };

  const onESVersionChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...options.jsonData,
        esVersion: event.target.value,
      },
    });
  };

  return (
    <>
      <DataSourceHttpSettings
        defaultUrl={'http://localhost:3100'}
        dataSourceConfig={options}
        showAccessOptions={true}
        onChange={onHttpSettingsChange}
      />

      <h3 className="page-heading">Other settings</h3>

      <div className="gf-form-group">
        <div className="gf-form-inline">
          <div className="gf-form max-width-25">
            <FormField
              labelWidth={10}
              inputWidth={15}
              label="Kibana Version"
              value={options.jsonData.esVersion || ''}
              onChange={onESVersionChange}
              placeholder={'7.0.0'}
              required
            />
          </div>
        </div>
      </div>
    </>
  );
};
