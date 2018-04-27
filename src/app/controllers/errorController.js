/**
 * Created by Samer on 2015-09-14.
 */
define(['./module'], function (controllers) {
    'use strict';
    return controllers.controller('errorController', ['$rootScope', '$scope', '$http', '$cookies', '$location', '$state','$stateParams', function ($rootScope, $scope, $http, $cookies, $location, $state, $stateParams) {
        /**
         * Any module declarations here
         */
        $scope.location = $location;


        /**
         * Here is the codes for jQuery - Must be avoided at all costs, as it won't work well with Angular
         */


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

