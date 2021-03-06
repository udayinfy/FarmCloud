(function () {
    'use strict';
    var module = angular.module("myApp");

    module.component('controlPanel', {

        templateUrl: 'static/js/components/control-panel/control-panel.component.html',
        controllerAs: "model",
        controller: function ($uibModal, $document, ControlPanelService, $log, $q) {
            var model = this;
            model.devices = {enddevices: [{identifier: ""}]};
            model.myDevice = "";
            model.irrigationDtStart = null;
            model.irrigationDtEnd = null;
            model.irrigationCosnume = null;
            model.disableIrrigbtn = true;
            model.disableMeasurebtn = false;
            model.coordinator = null;

            model.$onInit = function () {
                var defer = $q.defer();

                ControlPanelService.getDevices().then(
                    function (devicesdata) {
                        console.log(devicesdata);

                        model.devices = devicesdata;
                        model.myDevice = model.devices.enddevices[0].identifier;

                        //Get Last measures by last date
                        ControlPanelService.getMeasuresByLastDate(devicesdata.enddevices[0].identifier).then(
                            function (lastDateMeasures) {
                                console.log(lastDateMeasures);

                                for (var i = 0; i < lastDateMeasures.length; i++) {
                                    lastDateMeasures[i].phenomenonTime = moment(parseInt(lastDateMeasures[i].phenomenonTime * 1000)).format("dddd, MMMM Do h:mma");
                                }

                                model.lastmeasuresData = lastDateMeasures;
                                model.lastDate = lastDateMeasures[0].phenomenonTime;

                            },
                            function (errResponse) {
                                console.error('Error while fetching devices for firstpage');
                            }
                        );

                        ControlPanelService.getCoordinatorData(devicesdata.enddevices[0].identifier).then(
                            function (coordData) {
                                console.log(coordData);
                                var datefrom = moment(coordData.autoIrrigFromTime);
                                var dateto = moment(coordData.autoIrrigUntilTime);

                                if (datefrom.isValid() && dateto.isValid()) {
                                    model.AutomaticTimeDiff = getTimeDiff(datefrom, dateto);
                                }

                                model.coordinator = new Object();
                                model.coordinator.autoIrrigFromTime = new Date(1970, 0, 1, datefrom.hours(), datefrom.minutes(), 0);//moment(coordData.autoIrrigFromTime).format("HH:mm:ss");
                                model.coordinator.autoIrrigUntilTime = new Date(1970, 0, 1, dateto.hours(), dateto.minutes(), 0);
                                model.coordinator.waterConsumption = coordData.waterConsumption;
                                model.coordinator.identifier = coordData.identifier;
                            },
                            function (errResponse) {
                                console.error('Error while fetching devices for firstpage');
                            }
                        );

                        ControlPanelService.getWateringMeasuresByLastDate(devicesdata.enddevices[0].identifier).then(
                            function (waterMeasureData) {
                                model.wateringIrrigationDateFrom = waterMeasureData.autoIrrigFromTime;
                                model.wateringIrrigationDateTo = waterMeasureData.autoIrrigUntilTime;
                                model.wateringConsumption = waterMeasureData.waterConsumption;
                            },
                            function (errResponse) {
                                console.error('Error while fetching devices for firstpage');
                            }
                        );


                    },
                    function (errResponse) {
                        console.error('Error while fetching devices for firstpage');
                    }
                );
                //ControlPanelService.getLastMeasureDate().then(
                //    function (lastdate) {
                //        model.lastDate = moment(parseInt(lastdate)).format("dddd, MMMM Do, YYYY h:mma");
                //        console.log(lastdate);
                //    },
                //    function (errResponse) {
                //        console.error('Error while fetching devices for firstpage');
                //    }
                //);
            }

            model.updateTotalAlgorithmTime = function () {
                var timefrom = moment(model.coordinator.autoIrrigFromTime);
                var timeto = moment(model.coordinator.autoIrrigUntilTime);

                if (timefrom.isValid() && timeto.isValid()) {
                    model.AutomaticTimeDiff = getTimeDiff(timefrom, timeto)
                }


            }

            model.updateMyDevice = function (myD) {
                console.log(myD);
                //var newValue = myD.enddev.currentValue;
                var newValue = myD;
                var defer = $q.defer();

                ControlPanelService.getMeasuresByLastDate(newValue).then(
                    function (lastDateMeasures) {
                        console.log(lastDateMeasures);
                        for (var i = 0; i < lastDateMeasures.length; i++) {
                            lastDateMeasures[i].phenomenonTime = moment(parseInt(lastDateMeasures[i].phenomenonTime * 1000)).format("dddd, MMMM Do h:mma");
                        }
                        model.lastmeasuresData = lastDateMeasures;
                    },
                    function (errResponse) {
                        console.error('Error while fetching devices for firstpage');
                    }
                );

                ControlPanelService.getWateringMeasuresByLastDate(myD).then(
                    function (waterMeasureData) {
                        console.log(waterMeasureData);
                        model.wateringIrrigationDateFrom = moment(waterMeasureData.autoIrrigFromTime).format('dddd, MMMM Do, YYYY h:mma');
                        model.wateringIrrigationDateTo = moment(waterMeasureData.autoIrrigUntilTime).format('dddd, MMMM Do, YYYY h:mma');
                        model.wateringConsumption = waterMeasureData.waterConsumption;
                    },
                    function (errResponse) {
                        console.error('Error while fetching devices for firstpage');
                    }
                );
            };

            model.showModal = function () {
                model.modalInstance = $uibModal.open({
                    animation: model.animationsEnabled,
                    template: '<irrigation-modal></irrigation-modal>',
                    appendTo: $document.find('control-panel')
                });
            };

            model.showModalMeasuring = function () {
                model.modalInstance = $uibModal.open({
                    animation: model.animationsEnabled,
                    template: '<measuring-modal></measuring-modal>',
                    appendTo: $document.find('control-panel')
                });

                model.modalInstance.result.then(function (selectedItem) {
                    console.log(selectedItem);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            model.showModalSaveCoordData = function () {
                model.modalInstance = $uibModal.open({
                    animation: model.animationsEnabled,
                    template: '<algorithm-modal></algorithm-modal>',
                    appendTo: $document.find('control-panel')
                });
            }

            model.toggleAnimation = function () {
                model.animationsEnabled = !model.animationsEnabled;
            };


        }
    });
}());

function getTimeDiff(timefrom, timeto) {
    //var hoursdiff = parseInt(timeto.hours() - timefrom.hours());
    //var minutesdiff = parseInt(timeto.minutes() - timefrom.hours());
    //
    //if(hoursdiff > 0){
    //
    //}else if(hoursdiff === 0){
    //
    //} else{
    //
    //}

    var totalHours = parseInt(timeto.diff(timefrom, 'hours'));
    var totalMinutes = parseInt(timeto.diff(timefrom, 'minutes')) % 60;

    if (totalHours === 0) {
        if (totalMinutes < 0) {
            totalHours = 23;
            totalMinutes = 60 + totalMinutes;
        }
    } else if (totalHours < 0) {
        if (totalMinutes < 0) {
            totalHours = 24 + totalHours - 1;
            totalMinutes = 60 + totalMinutes;
        } else if (totalMinutes == 0) {
            totalHours = 24 + totalHours;
        }
    }

    return (totalHours + " hours and " + totalMinutes + " minutes");
}
