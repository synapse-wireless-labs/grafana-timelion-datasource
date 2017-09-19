'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!'], function (_export, _context) {
    "use strict";

    var QueryCtrl, TimelionDatasourceQueryCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_appPluginsSdk) {
            QueryCtrl = _appPluginsSdk.QueryCtrl;
        }, function (_cssQueryEditorCss) {}],
        execute: function () {
            _export('TimelionDatasourceQueryCtrl', TimelionDatasourceQueryCtrl = function (_QueryCtrl) {
                _inherits(TimelionDatasourceQueryCtrl, _QueryCtrl);

                function TimelionDatasourceQueryCtrl($scope, $injector, uiSegmentSrv) {
                    _classCallCheck(this, TimelionDatasourceQueryCtrl);

                    var _this = _possibleConstructorReturn(this, (TimelionDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(TimelionDatasourceQueryCtrl)).call(this, $scope, $injector));

                    _this.scope = $scope;
                    _this.uiSegmentSrv = uiSegmentSrv;
                    return _this;
                }

                return TimelionDatasourceQueryCtrl;
            }(QueryCtrl));

            _export('TimelionDatasourceQueryCtrl', TimelionDatasourceQueryCtrl);

            TimelionDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
        }
    };
});
//# sourceMappingURL=query_ctrl.js.map
