define(['./module'], function (directives) {
    'use strict';
    directives.directive("onScrollToBottom", ['$http', '$injector', '$state', function($http, $injector, $state) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];
                element.bind("scroll", function () {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attrs.onScrollToBottom);
                    }
                });
                setTimeout(function () {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                        scope.$apply(attrs.onScrollToBottom);
                    }
                }, 100);

            }
        };
    }]);
});