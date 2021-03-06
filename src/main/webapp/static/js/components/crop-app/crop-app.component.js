(function () {
    "use strict";

    var module = angular.module("myApp");
    module.component("cropApp", {
        templateUrl: 'static/js/components/crop-app/crop-app.component.html',
        $routeConfig: [
            {path: "/myprofile", component: "myProfile", name: "Profile"},
            {path: "/userprofile", component: "userProfile", name: "UserProfile"},
            {path: "/observableProperty/:id/:description", component: "observableProperty", name: "ObservableProperty"},
            {path: "/wateringProperty", component: "wateringProperty", name: "WateringProperty"},
            {path: "/getweather", component: "weatherApi", name: "WeatherApi"},
            {path: "/controlpanel", component: "controlPanel", name: "ControlPanel"},
            {path: "/wateringprofile", component: "wateringProfile", name: "WateringProfile"},
            {path: "/**", component: "firstPage", name: "Firstpage"}

        ],
        controller: function () {
        }
    });
}());