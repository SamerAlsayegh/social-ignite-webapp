define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('billingSubController', ['$scope', 'Alert', '$mdDialog',
        function ($scope, Alert, $mdDialog) {
            $scope.betaTesterProgram = function ($event) {
                $mdDialog.show({
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    templateUrl: '/pub/portal/billing/_testerProgram.html',
                    controller: function ($scope, $mdDialog) {
                        $scope.closeDialog = function () {
                            $mdDialog.hide();
                        }
                    }
                });
            }

        }]);
});

