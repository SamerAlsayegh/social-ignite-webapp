define(['./module'], controllers => {
    return controllers.controller('errorController', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
        $scope.goBack = () => {
            window.history.back();
        };
        $scope.location = $location;

        $scope.reportBroken = () => {
            alert("Feature not added yet.");
        };
        $scope.reportBroken = () => {
            alert("Feature not added yet.");
        };

    }]);
});

