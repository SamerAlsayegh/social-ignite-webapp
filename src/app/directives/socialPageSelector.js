define(['./module'], directives => {
    directives.directive("socialPageSelector", ['Alert', (Alert) => ({
        restrict: 'E',
        replace: true,

        scope: {
            socialPages: "=",
            platforms: "=",
            selected: "=",
        },

        template: require("compile-ejs-loader!views/_portal/directives/_socialPageSelector.ejs")(),

        link($scope, element, attrs) {
            $scope.togglePage = socialPageId => {
                if ($scope.selected.indexOf(socialPageId) == -1)
                    $scope.selected.push(socialPageId);
                else
                    $scope.selected.splice($scope.selected.indexOf(socialPageId), 1);

                console.log($scope.selected)

            };



        }
    })]);
});