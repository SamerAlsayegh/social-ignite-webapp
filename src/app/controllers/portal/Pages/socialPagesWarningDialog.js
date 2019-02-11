define(['../../module'], controllers => {
    return controllers.controller('socialPagesWarningDialog', [
        '$rootScope', '$scope', '$mdDialog', 'theme',
        function (
            $rootScope,
            $scope,
            $mdDialog,
            theme,
        ){
            $scope.cancel = () => {
                $mdDialog.cancel();
            };

            $scope.next = () => {
                $mdDialog.hide();
            }

        }]);
});

