define(['./module'], directives => {
    directives.directive("delayedImage", [() => ({
        restrict: 'A',
        scope: {delayedImage: '@'},

        link(scope, element, attrs) {
            element.one('load', () => {
                element.attr('src', scope.delayedImage);
            });
        }
    })]);
});