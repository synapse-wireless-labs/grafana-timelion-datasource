import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class TimelionDatasourceQueryCtrl extends QueryCtrl {

    constructor($scope, $injector, uiSegmentSrv) {
        super($scope, $injector);

        this.scope = $scope;
        this.uiSegmentSrv = uiSegmentSrv;
    }
}

TimelionDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';

