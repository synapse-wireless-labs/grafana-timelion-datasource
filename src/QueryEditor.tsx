import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { TimeLionDataSource } from './datasource';
import { defaultQuery, TimeLionDataSourceOptions, TimeLionQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<TimeLionDataSource, TimeLionQuery, TimeLionDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onTargetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, target: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { target } = query;

    return (
      <div className="gf-form">
        <FormField
          labelWidth={8}
          inputWidth={32}
          value={target || ''}
          onChange={this.onTargetChange}
          label="Expression"
          tooltip="Timelion expression"
        />
      </div>
    );
  }
}
