"use strict";

System.register(["lodash"], function (_export, _context) {
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

      _export("TimelionDatasource", TimelionDatasource = function () {
        function TimelionDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, TimelionDatasource);

          this.instanceSettings = instanceSettings;
          this.esVersion = this.instanceSettings.esVersion || "5.3.0";
          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
        }

        _createClass(TimelionDatasource, [{
          key: "request",
          value: function request(options) {
            options.headers = {
              "kbn-version": this.esVersion,
              "Content-Type": "application/json;charset=UTF-8"
            };
            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: "query",
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
                return TimelionDatasource.readTimlionSeries(response).map(function (list, ix) {
                  return {
                    "target": list.label,
                    "datapoints": _.map(list.data, function (d) {
                      return [d[1], d[0]];
                    })
                  };
                });
              });
            });
            return this.q.all(reqs).then(function (series) {
              return { "data": _.flatten(series) };
            });
          }
        }, {
          key: "readTimlionSeries",
          value: function readTimlionSeries(response) {
            return _.flatten(_.map(response.data.sheet, function (sheet) {
              return sheet.list;
            }));
          }
        }, {
          key: "testDatasource",
          value: function testDatasource() {
            return this.backendSrv.datasourceRequest({
              url: this.url + '/run',
              method: 'GET'
            }).then(function (response) {
              if (response.status === 400) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }, {
          key: "annotationQuery",
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
          key: "metricFindQuery",
          value: function metricFindQuery(query) {
            var interpolated = {
              target: this.templateSrv.replace(query, null, 'regex')
            };

            return this.backendSrv.datasourceRequest({
              url: "https://raw.githubusercontent.com/elastic/timelion/master/FUNCTIONS.md",
              method: 'GET'
            }).then(this.parseTimelionFunctions);
          }
        }, {
          key: "mapToTextValue",
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
          key: "buildQueryParameters",
          value: function buildQueryParameters(options) {
            var oThis = this;
            //remove placeholder targets
            options.targets = _.filter(options.targets, function (target) {
              return target.target !== 'select metric' && !target.hide;
            });

            var queryTpl = { "sheet": null,
              "time": {
                "from": options.range.from.format("YYYY-MM-DDTHH:mm:ss ZZ"),
                "interval": "auto",
                "mode": "absolute",
                "timezone": "GMT",
                "to": options.range.to.format("YYYY-MM-DDTHH:mm:ss ZZ")
              }
            };

            var targets = _.flatten(_.map(options.targets, function (target) {
              var target = oThis.templateSrv.replace(target.target).replace(/\r\n|\r|\n/mg, "");
              var targets = _.map(target.split(".es(").slice(1), function (part) {
                return ".es(" + part;
              });
              return _.map(targets, function (target) {
                var scale_interval = /.scale_interval\(([^\)]*)\)/.exec(target);
                var interval = target.interval || undefined;
                if (scale_interval) {
                  interval = scale_interval[1];
                  target = target.replace(scale_interval[0], "");
                }
                return { target: target, interval: interval };
              });
            }));
            var intervalGroups = _.groupBy(targets, function (t) {
              return t.interval;
            });
            var intervals = Object.keys(intervalGroups);
            var queries = _.map(intervals, function (key) {
              return {
                interval: key,
                sheet: _.map(intervalGroups[key], function (target) {
                  return target.target;
                })
              };
            });
            options.queries = _.map(queries, function (q) {
              queryTpl.sheet = q.sheet;
              queryTpl.time.interval = !q.interval || q.interval === 'undefined' ? 'auto' : q.interval;
              return _.cloneDeep(queryTpl);
            });
            return options;
          }
        }]);

        return TimelionDatasource;
      }());

      _export("TimelionDatasource", TimelionDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
