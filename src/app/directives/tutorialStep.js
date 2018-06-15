define(['./module'], function (directives) {
    'use strict';
    directives.directive("tutorialStep", ['$http', '$injector', '$state', function($http, $injector, $state) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                activeDiv: "=",
                activeDescription: "=",
            },
            templateUrl: '/_portal/directives/_tutorialStep.html',
            link: function($scope, element, attrs) {

                $scope.$watch('activeDiv', function (newVal, oldVal) {
                    console.log("Changed val?")
                        setTimeout(function () {
                            var space = 10;
                            var el = angular.element(document.getElementsByClassName($scope.activeDiv))[0].getBoundingClientRect();
                            var darken_right = angular.element(document.getElementsByClassName("darken_right"));
                            var darken_left = angular.element(document.getElementsByClassName("darken_left"));
                            var darken_top = angular.element(document.getElementsByClassName("darken_top"));
                            var darken_bottom = angular.element(document.getElementsByClassName("darken_bottom"));


                            var darken_text = angular.element(document.getElementsByClassName("darken_text"));


                            darken_text.css("left", (el.left + space) + "px");
                            darken_text.css("top", (el.top - space - 50) < 0 ? 0 : (el.top - space - 50) + "px");
                            // darken_text.css("width", (el.width) + "px");
                            // darken_text.css("height", (el.height - space) + "px");
                            darken_text.css("z-index", 1000);

                            darken_right.css("left", (el.left + space + el.width) + "px");
                            darken_left.css("width", (el.left - space) + "px");
                            darken_top.css("left", (el.left - space) + "px");
                            darken_top.css("height", (el.top - space) + "px");
                            darken_top.css("width", (el.width + 2 * space) + "px");
                            darken_bottom.css("left", (el.left - space) + "px");
                            darken_bottom.css("width", (el.width + 2 * space) + "px");
                            darken_bottom.css("top", (el.height + el.top + space) + "px");
                            angular.element(element)[0].scrollTop = 0;

                        }, 50);

                });
            }
        };
    }]);
});