import angular from "angular";

import "@uirouter/angularjs/release/angular-ui-router"
import "angular-material-data-table";
import "angular-moment";
import "angular-animate";
import "angular-material";
import "angular-cookies";
import "angular-messages";
import "angular-google-analytics";
import "ng-file-upload";
import "chart.js";
import "chart.heatmap.js"
import "../custom/angular-material-calendar";
import "./directives/index";
import "./controllers/index";
import "./services/index";
import "./filters/index";

import moment from 'moment';
window['moment'] = moment;
require('chartjs-plugin-datalabels');

require('angular-moment-picker'); // Note: usage of  require because an `import` is forbidden after an instruction (`window['moment'] = moment`)
moment.locale('en');

export default angular.module('SocialIgnite', [
    'SocialIgnite.controllers',
    'SocialIgnite.services',
    'SocialIgnite.directives',
    'SocialIgnite.filters',
    'md.data.table',
    'moment-picker',
    'ngAnimate',
    'ngMessages',
    'ngMaterial',
    'ngFileUpload',
    'ngCookies',
    'materialCalendar',
    'angular-google-analytics',
    'ui.router',
    'angularMoment',
])
    .config(['$mdThemingProvider', '$httpProvider', '$mdGestureProvider', 'AnalyticsProvider', 'momentPickerProvider', '$sceDelegateProvider',
        function ($mdThemingProvider, $httpProvider, $mdGestureProvider, AnalyticsProvider, momentPickerProvider, $sceDelegateProvider) {
        var lightBlueCustom = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', '100',
                '200', '300', '400', 'A100'],
            'contrastLightColors': undefined
        });

        AnalyticsProvider.setAccount('UA-63794417-10');
        AnalyticsProvider.trackPrefix('p');

        momentPickerProvider.options({ hoursFormat: 'LT', minutesFormat: 'LT' });
        $mdThemingProvider.definePalette('lightBlueCustom', lightBlueCustom);
        $mdThemingProvider.theme('default')
            .primaryPalette('lightBlueCustom')
            .accentPalette('light-blue')
            .backgroundPalette('grey');
        $mdThemingProvider.theme('dark')
            .primaryPalette('lightBlueCustom')
            .accentPalette('light-blue')
            .backgroundPalette('grey').dark();
        $mdGestureProvider.disableAll();
        $httpProvider.defaults.withCredentials = true;
        $sceDelegateProvider.resourceUrlWhitelist(['https://assets.socialignite.media/**', 'self']);
    }])
    .run(['$rootScope', '$transitions', '$state', '$templateCache', '$http', 'Auth', 'moment', '$cookies', 'Analytics', '$location', '$window',
        function ($rootScope, $transitions, $state, $templateCache, $http, Auth,
                  moment,
                  $cookies, Analytics, $location, $window) {
            $transitions.onSuccess({}, function (transition) {
                Analytics.trackPage($location.path());
            });

            moment.locale('en_long', {
                relativeTime: {
                    future: "in %s",
                    past: "%s ago",
                    s: "seconds",
                    m: "1 minute",
                    mm: "%d minutes",
                    h: "1 hour",
                    hh: "%d hours",
                    d: "1 day",
                    dd: "%d days",
                    M: "1 month",
                    MM: "%d months",
                    y: "1 year",
                    yy: "%d years"
                }
            });

            $transitions.onBefore({to: 'portal.**'}, function (transition) {
                var Auth = transition.injector().get('Auth');
                return new Promise(function (resolve, reject) {
                    Auth.sessionValidate(function (loggedIn) {
                        if (!loggedIn) {
                            console.log("Redirecting from portal to public");
                            $cookies.put("redirect_on_login", transition.to().name);
                            $state.go('public.login');
                            reject();
                        } else
                            resolve();
                    })
                })
            });

            $transitions.onBefore({to: 'public.**'}, function (transition) {
                var Auth = transition.injector().get('Auth');
                return new Promise(function (resolve, reject) {
                    Auth.sessionValidate(function (loggedIn) {
                        if (loggedIn && transition.to().name != "public.email_verify") {
                            console.log("Redirecting from public to portal");
                            $state.go('portal.home');
                            reject();
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // Remove people not allowed to access frontend. This is simply a deterrent, they still wouldn't have access to backend.
            $transitions.onBefore({to: 'admin.**'}, function (transition) {
                var Auth = transition.injector().get('Auth');
                return new Promise(function (resolve, reject) {
                    Auth.sessionValidate(function (loggedIn) {
                        if (!$rootScope.user || !($rootScope.user.scope == "admin" || $rootScope.user.scope == "support")) {
                            console.log("Redirecting from admin to portal");
                            $state.go('portal.home');
                            reject();
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // // TODO: Temporarily disabled until made more efficient?
            // angular.forEach($state.get(), function (state, key) {
            //     if (state.templateUrl !== undefined && state.preload !== false) {
            //         $http.get(state.templateUrl, {cache: $templateCache});
            //     }
            // });

            $window.addEventListener('beforeinstallprompt', function(e) {
                e.prompt();
            })

            if ('serviceWorker' in navigator) {
                // Register a service worker hosted at the root of the
                // site using the default scope.
                navigator.serviceWorker.register('/serviceWorker.js').then(function(registration) {
                    console.log('Service worker registration succeeded');
                }).catch(function(error) {
                    console.log('Service worker registration failed:', error);
                });
            } else {
                console.log('Service workers are not supported.');
            }
        }
    ]);
// define([
//     'angular',
//     '@uirouter/angularjs/release/angular-ui-router.js',
//     'angular-material-data-table',
//     'angular-moment',
//     'angular-animate',
//     'angular-material',
//     'angular-cookies',
//     'angular-messages',
//     'angular-google-analytics',
//     'angular-moment-picker/dist/angular-moment-picker.js',
//     'ng-file-upload',
//     'chart.js',
//     '../custom/angular-material-calendar',
//     './directives/index',
//     './controllers/index',
//     './services/index',
//     './filters/index',
// ], function (angular) {
//     'use strict';
//
//
// });
