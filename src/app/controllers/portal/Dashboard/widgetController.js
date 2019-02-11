define(['../../module'], controllers => {
    return controllers.controller('widgetController',
        ['$rootScope', '$scope', '$mdBottomSheet',
            function (
                $rootScope,
                $scope,
                $mdBottomSheet
            ) {
                $scope.widgetsEditing = 1;
                $scope.widgetStage = (stage) => {
                    $scope.widgetsEditing = stage;
                };


                $scope.addWidget = (widget) => {
                    $mdBottomSheet.hide(widget);

                };


            }]);
});

