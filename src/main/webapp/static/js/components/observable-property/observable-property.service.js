(function () {
    'use strict';
    var module = angular.module('myApp');

    //{params:{"param1": val1, "param2": val2}})

    module.factory('ObservablePropertyService', ['$http', '$q', '$log', function ($http, $q, $log) {
            return {
                getDevices: function () {
                    return $http.get('firstPDev', {headers: {'Cache-Control': 'no-cache'}}).then(
                        function (response) {
                            return response.data;
                        },
                        function (errResponse) {
                            console.error('Error while firstpageService devices');

                            return $q.reject(errResponse);
                        }
                    );
                }, getMeasuresTotalCount: function (id, mydevice, datefrom, dateto) {
                    return $http.get('totalMeasuresCounter?id=' + id + '&mydevice=' + mydevice + '&dtstart=' + datefrom + '&dtend=' + dateto, {headers: {'Cache-Control': 'no-cache'}}).then(
                        function (response) {
                            console.log('Total rows: ' + response);
                            return response.data;
                        },
                        function (errResponse) {
                            console.error('Error while fetchingService total number of measures!!!');
                            return $q.reject(errResponse);
                        }
                    );
                }, getMeasuresByProperty: function (id, mydevice, datefrom, dateto) {
                    return $http.get('getObspMeasures?id=' + id + '&mydevice=' + mydevice + '&dtstart=' + datefrom + '&dtend=' + dateto, {headers: {'Cache-Control': 'no-cache'}}).then(
                        //"/search?fname="+fname"+"&lname="+lname
                        function (response) {
                            return response.data;
                        },
                        function (errResponse) {
                            console.error('Error while fetchingService ObsProp Measures!!!');
                            return $q.reject(errResponse);
                        }
                    );
                }, getMeasuresPdf: function (id, mydevice, datefrom, dateto) {
                    $http({
                        //url: 'extract/pdf?id=' + id + '&mydevice=' + mydevice + '&dtstart=' + datefrom + '&dtend=' + dateto,
                        url: 'extract/pdf',
                        method: 'POST',
                        params: {'id': id, 'mydevice': mydevice, 'dtstart': datefrom, 'dtend': dateto},
                        //params: {},
                        headers: {
                            'Content-type': 'application/pdf',
                        },
                        responseType: 'arraybuffer'
                    }).success(function (data, status, headers, config) {
                        // TODO when WS success
                        var file = new Blob([data], {
                            type: 'application/pdf'
                        });
                        //trick to download store a file having its URL
                        var fileURL = URL.createObjectURL(file);
                        var a = document.createElement('a');
                        a.href = fileURL;
                        a.target = '_blank';
                        a.download = 'measures.pdf';
                        document.body.appendChild(a);
                        a.click();
                    }).error(function (data, status, headers, config) {
                        //TODO when WS error
                        log.error('Error: ' + data);
                    });
                }, getMeasuresCsv: function (id, mydevice, datefrom, dateto) {
                    $http({
                        url: 'extract/csv',
                        method: 'POST',
                        params: {'id': id, 'mydevice': mydevice, 'dtstart': datefrom, 'dtend': dateto},
                        headers: {
                            'Content-type': 'application/csv',
                        },
                        responseType: 'arraybuffer'
                    }).success(function (data, status, headers, config) {
                        // TODO when WS success
                        var file = new Blob([data], {
                            type: 'application/csv'
                        });
                        //trick to download store a file having its URL
                        var fileURL = URL.createObjectURL(file);
                        var a = document.createElement('a');
                        a.href = fileURL;
                        a.target = '_blank';
                        a.download = 'measures.csv';
                        document.body.appendChild(a);
                        a.click();
                    }).error(function (data, status, headers, config) {
                        //TODO when WS error
                        log.error('Error: ' + status);
                    });
                }, getMeasuresXls: function (id, mydevice, datefrom, dateto) {
                    $http({
                        url: 'extract/xls',
                        method: 'POST',
                        params: {'id': id, 'mydevice': mydevice, 'dtstart': datefrom, 'dtend': dateto},
                        headers: {
                            'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        },
                        responseType: 'arraybuffer'
                    }).success(function (data, status, headers, config) {
                        // TODO when WS success
                        var file = new Blob([data], {
                            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        });
                        //trick to download store a file having its URL
                        var fileURL = URL.createObjectURL(file);
                        var a = document.createElement('a');
                        a.href = fileURL;
                        a.target = '_blank';
                        a.download = 'measures.xls';
                        document.body.appendChild(a);
                        a.click();
                    }).error(function (data, status, headers, config) {
                        //TODO when WS error
                        log.error('Error: ' + status);
                    });
                }

            }
        }]
    );

}());