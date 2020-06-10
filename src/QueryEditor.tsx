import React, { ChangeEvent, useEffect } from 'react';
import { QueryEditorProps } from '@grafana/data';
import { TimeLionDataSource } from './datasource';
import { defaultQuery, TimeLionDataSourceOptions, TimeLionQuery } from './types';

type Props = QueryEditorProps<TimeLionDataSource, TimeLionQuery, TimeLionDataSourceOptions>;

export const QueryEditor = (props: Props) => {
  const { query, onChange, onRunQuery } = props;

  // Apply some defaults on initial render
  useEffect(() => {
    onChange({ ...query, ...defaultQuery });
  }, []);

  const onTargetChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...query, target: event.target.value });
  };

  const onIntervalChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, interval: event.target.value });
  };

  return (
    <>
      <div className="gf-form-inline">
        <div className="gf-form gf-form--grow">
          <div className="gf-form gf-form--v-stretch">
            <label className="gf-form-label width-7">Expression</label>
          </div>
          <textarea
            className="gf-form-input gf-form-textarea"
            placeholder=".es()"
            value={query.target}
            onChange={onTargetChange}
            onBlur={onRunQuery}
          ></textarea>
        </div>
      </div>

      <div className="gf-form-inline">
        <div className="gf-form gf-form--grow">
          <label className="gf-form-label width-7">Interval</label>
          <input
            type="text"
            className="gf-form-input"
            placeholder="custom interval"
            value={query.interval}
            onChange={onIntervalChange}
            onBlur={onRunQuery}
          />
        </div>
      </div>
    </>
  );
};
