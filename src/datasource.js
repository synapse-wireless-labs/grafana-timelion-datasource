import _ from "lodash";

export class TimelionDatasource {

    constructor(instanceSettings, $q, backendSrv, templateSrv) {
        this.instanceSettings = instanceSettings;
        this.esVersion = this.instanceSettings.esVersion || "5.3.2";
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.q = $q;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;

        this.withCredentials = instanceSettings.withCredentials;
        this.headers = {
            'Content-Type': 'application/json',
            'kbn-version': this.esVersion
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
        return _.flatten(_.map(response.data.sheet, sheet => sheet.list));
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
        const oThis = this;
        //remove placeholder targets
        options.targets = _.filter(options.targets, target => {
            return target.target !== 'select metric' && !target.hide;
        });

        const queryTpl = {
            "sheet": null,
            "time": {
                "from": options.range.from.format("YYYY-MM-DDTHH:mm:ss ZZ"),
                "interval": "auto",
                "mode": "absolute",
                "timezone":"GMT",
                "to": options.range.to.format("YYYY-MM-DDTHH:mm:ss ZZ")
            }
        };

        const targets = _.flatten(_.map(options.targets, target => {
            const target = oThis.templateSrv
                .replace(target.target)
                .replace(/\r\n|\r|\n/mg, "");
            const es_targets = _.map(target.split(".es(").slice(1), part => ".es(" + part);
            return _.map(es_targets, es => {
                const scale_interval = /.scale_interval\(([^)]*)\)/.exec(es);
                let interval = es.interval || undefined;
                if (scale_interval) {
                    interval = scale_interval[1];
                    es = es.replace(scale_interval[0], "");
                }
                return {target: es, interval: interval};
            });
        }));
        const intervalGroups = _.groupBy(targets, t => t.interval);
        const intervals = Object.keys(intervalGroups);
        const queries = _.map(intervals, key => ({
            interval: key,
            sheet: _.map(intervalGroups[key], target => target.target)
        }));
        options.queries = _.map(queries, q => {
            queryTpl.sheet = q.sheet;
            queryTpl.time.interval = !q.interval || q.interval === 'undefined' ? 'auto' : q.interval;
            return _.cloneDeep(queryTpl);
        });
        return options;
    }
}
