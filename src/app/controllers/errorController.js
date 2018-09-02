define(['./module'], function (controllers) {
    'use strict';
    return controllers.controller('errorController', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
        $scope.goBack = function(){
            window.history.back();
        };
        $scope.location = $location;

        $scope.reportBroken = function(){
            alert("Feature not added yet.");
        };
        $scope.reportBroken = function(){
            alert("Feature not added yet.");
        };

    }]);


});

