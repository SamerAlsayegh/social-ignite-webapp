define(['./module'], function (directives) {
    'use strict';
    directives.directive("delayedImage", [function() {
        return {
            restrict: 'A',
            scope: { delayedImage: '@' },
            link: function(scope, element, attrs) {
                element.one('load', function() {
                    element.attr('src', scope.delayedImage);
                });
            }
        };
    }]);
});