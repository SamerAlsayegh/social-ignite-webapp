define(['./module'], directives => {
    directives.directive("socialPageAvatar", ['$http', '$injector', 'Request', 'Alert', 'Image', '$state', '$mdDialog', '$rootScope', ($http, $injector, Request, Alert, Image, $state, $mdDialog, $rootScope) => ({
        restrict: 'E',
        replace: true,

        scope: {
            socialPage: "=",
            platforms: "="
        },

        template: require("compile-ejs-loader!views/_portal/directives/_socialPageAvatar.ejs")(),

        link($scope, element, attrs) {

        }
    })]);
});