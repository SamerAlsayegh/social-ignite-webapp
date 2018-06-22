/**
 * Created by Samer on 2015-09-14.
 */
define(['./module'], function (controllers) {
    'use strict';
    return controllers.controller('errorController', ['$rootScope', '$scope', function ($rootScope, $scope) {


        /**
         * Variable declarations
         */
        $scope.login = {};
        /**
         * Initialize code...
         */
        $scope.goBack = function(){
            window.history.back();
        };
        $scope.reportBroken = function(){
            alert("Feature not added yet.");
        };
        /**
         * Functions for use across all error pages...
         */

    }]);


});

