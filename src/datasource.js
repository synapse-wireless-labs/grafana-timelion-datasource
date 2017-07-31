import _ from "lodash";

export class TimelionDatasource {

    constructor(instanceSettings, $q, backendSrv, templateSrv) {
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
            'kbn-version': this.instanceSettings.esVersion || "5.3.2"
        };
        if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
        }
    }

    request(options) {
        options.withCredentials = this.withCredentials;
        options.headers = this.headers;
        return this.backendSrv.datasourceRequest(options);
    }

    query(options) {
        const query = this.buildQueryParameters(options);
        const oThis = this;
        if (query.targets.length <= 0) {
            return this.q.when({data: []});
        }
        const reqs = _.map(options.queries,
            query => oThis.request({
                url: this.url + '/run',
                data: query,
                method: 'POST'
            })
                .then(response => TimelionDatasource.readTimlionSeries(response)
                    .map((list, ix) => ({
                        "target": list.label,
                        "datapoints": _.map(list.data, d => [d[1], d[0]])
                    }))));
        return this.q.all(reqs).then(series => ({"data": _.flatten(series)}))
    }

    static readTimlionSeries(response) {
        return _.flatten(_.map(response.data.sheet, s => s.list));
    }

    testDatasource() {
        return this.request({
            url: this.url + '/run',
            data: {time: {from: "now-1s", to: "now", interval: "1s"}},
            method: 'POST'
        }).then(response => {
            if (response.status === 200) {
                return {status: "success", message: "Data source is working", title: "Success"};
            }
        })
    }

    annotationQuery(options) {
        const query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
        const annotationQuery = {
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
        }).then(result => {
            return result.data;
        });
    }

    metricFindQuery(query) {
        const interpolated = {
            target: this.templateSrv.replace(query, null, 'regex')
        };

        return this.backendSrv.datasourceRequest({
            url: "https://raw.githubusercontent.com/elastic/timelion/master/FUNCTIONS.md",
            method: 'GET'
        }).then(this.parseTimelionFunctions);
    }

    mapToTextValue(result) {
        return _.map(result.data, (d, i) => {
            if (d && d.text && d.value) {
                return {text: d.text, value: d.value};
            } else if (_.isObject(d)) {
                return {text: d, value: i};
            }
            return {text: d, value: d};
        });
    }

    buildQueryParameters(options) {
        //remove placeholder timelion_expressions
        options.targets = _.filter(options.targets, target => {
            return target.timelion_exp !== 'select metric' && !target.hide;
        });

        const queryTpl = {
            "sheet": null,
            "time": {
                "from": options.range.from.format("YYYY-MM-DDTHH:mm:ss ZZ"),
                "interval": "auto",
                "mode": "absolute",
                "to": options.range.to.format("YYYY-MM-DDTHH:mm:ss ZZ")
            }
        };

        const timelion_expressions = _.flatten(_.map(options.targets, t => {
            const regex = /(?:\.\w+\((?:\(.*?\)|\".*?\"|.*?)*?\))+/g;
            const exps = [];
            let m;

            const queryInterpolated = this.templateSrv.replace(t.timelion_exp).replace(/\r\n|\r|\n/mg, "");
            while ((m = regex.exec(queryInterpolated)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    exps.push(match);
                });
            }

            return _.map(exps, e => {
                return {sheet: e, interval: 'auto'};
            });
        }));

        options.queries = _.map(timelion_expressions, e => {
            queryTpl.sheet = [e.sheet];
            queryTpl.time.interval = e.interval;
            return _.cloneDeep(queryTpl);
        });

        return options;
    }
}
