define(['./module'], directives => {
    directives.directive("onScrollToBottom", ['$http', '$injector', '$state', ($http, $injector, $state) => ({
        restrict: 'A',

        link(scope, element, attrs) {
            let raw = element[0];
            element.bind("scroll", () => {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attrs.onScrollToBottom);
                }
            });
            setTimeout(() => {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attrs.onScrollToBottom);
                }
            }, 100);

        }
    })]);
});