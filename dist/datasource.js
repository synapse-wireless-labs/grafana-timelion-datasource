'use strict';

System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, TimelionDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('TimelionDatasource', TimelionDatasource = function () {
        function TimelionDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, TimelionDatasource);

          this.instanceSettings = instanceSettings;
          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;

          this.withCredentials = instanceSettings.withCredentials;
          this.headers = {
            'Content-Type': 'application/json',
            'kbn-version': this.instanceSettings.esVersion || '5.3.2'
          };
          if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
          }
        }

        _createClass(TimelionDatasource, [{
          key: 'request',
          value: function request(options) {
            options.withCredentials = this.withCredentials;
            options.headers = this.headers;
            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: 'query',
          value: function query(options) {
            var _this = this;

            var query = this.buildQueryParameters(options);
            var oThis = this;
            if (query.targets.length <= 0) {
              return this.q.when({ data: [] });
            }
            var reqs = _.map(options.queries, function (query) {
              return oThis.request({
                url: _this.url + '/run',
                data: query,
                method: 'POST'
              }).then(function (response) {
                return TimelionDatasource.readTimelionSeries(response).map(function (list, ix) {
                  return {
                    target: list.label,
                    datapoints: _.map(list.data, function (d) {
                      return [d[1], d[0]];
                    })
                  };
                });
              });
            });
            return this.q.all(reqs).then(function (series) {
              return { data: _.flatten(series) };
            });
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.request({
              url: this.url + '/run',
              data: { time: { from: 'now-1s', to: 'now', interval: '1s' } },
              method: 'POST'
            }).then(function (response) {
              if (response.status === 200) {
                return { status: 'success', message: 'Data source is working', title: 'Success' };
              }
            });
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
            var annotationQuery = {
              range: options.range,
              annotation: {
                name: options.annotation.name,
                datasource: options.annotation.datasource,
                enable: options.annotation.enable,
                iconColor: options.annotation.iconColor,
                query: query
              },
              rangeRaw: options.rangeRaw
            };

            return this.backendSrv.datasourceRequest({
              url: this.url + '/annotations',
              method: 'POST',
              data: annotationQuery
            }).then(function (result) {
              return result.data;
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {
            var interpolated = {
              target: this.templateSrv.replace(query, null, 'regex')
            };

            return this.backendSrv.datasourceRequest({
              url: 'https://raw.githubusercontent.com/elastic/timelion/master/FUNCTIONS.md',
              method: 'GET'
            }).then(this.parseTimelionFunctions);
          }
        }, {
          key: 'mapToTextValue',
          value: function mapToTextValue(result) {
            return _.map(result.data, function (d, i) {
              if (d && d.text && d.value) {
                return { text: d.text, value: d.value };
              } else if (_.isObject(d)) {
                return { text: d, value: i };
              }
              return { text: d, value: d };
            });
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            var _this2 = this;

            //remove placeholder timelion_expressions
            options.targets = _.filter(options.targets, function (target) {
              return target.timelion_exp !== 'select metric' && !target.hide;
            });

            var queryTpl = {
              sheet: null,
              time: {
                timezone: options.range.from.format('ZZ'),
                from: options.range.from.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                interval: null,
                mode: 'absolute',
                to: options.range.to.utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
              }
            };

            var timelion_expressions = _.flatten(_.map(options.targets, function (t) {
              var tl_regex = /(?:\.\w+\((?:\((?:\((?:\(.*?\)|".*?"|.*?)*?\)|".*?"|.*?)*?\)|".*?"|.*?)*?\))+/g;
              var query_list = [];
              var m = void 0;

              var queryInterpolated = _this2.templateSrv.replace(t.timelion_exp, options.scopedVars, 'lucene');
              while ((m = tl_regex.exec(queryInterpolated)) !== null) {
                if (m.index === tl_regex.lastIndex) {
                  tl_regex.lastIndex++;
                }

                m.forEach(function (match, groupIndex) {
                  var query = { match: match, interval: 'auto' };

                  var scale_interval = /(?:\.scale_interval\()([\w"]+)\)/.exec(match);
                  if (scale_interval) {
                    query.match = match.replace(scale_interval[0], '');
                    query.interval = scale_interval[1];
                  }
                  query_list.push(query);
                });
              }

              return query_list;
            }));

            options.queries = _.map(timelion_expressions, function (q) {
              queryTpl.sheet = [q.match];
              queryTpl.time.interval = q.interval;
              return _.cloneDeep(queryTpl);
            });

            return options;
          }
        }], [{
          key: 'readTimelionSeries',
          value: function readTimelionSeries(response) {
            return _.flatten(_.map(response.data.sheet, function (s) {
              return s.list;
            }));
          }
        }]);

        return TimelionDatasource;
      }());

      _export('TimelionDatasource', TimelionDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
