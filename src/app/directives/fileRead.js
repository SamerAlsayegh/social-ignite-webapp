define(['./module'], directives => {
    directives.directive("fileModel", () => ({
        restrict: 'EA',

        scope: {
            setFileData: "&"
        },

        link(scope, ele, attrs) {
            ele.on('change', () => {
                scope.$apply(() => {
                    let val = ele[0].files[0];
                    scope.setFileData({value: val});
                });
            });
        }
    }))
});