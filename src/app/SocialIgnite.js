define([
    'angular',
    '@uirouter/angularjs/release/angular-ui-router.js',
    'angular-material-data-table',
    'angular-moment',
    'angular-animate',
    'angular-material',
    'angular-cookies',
    'angular-messages',
    'angular-moment-picker/dist/angular-moment-picker.js',
    'ng-file-upload',
    'chart.js',
    '../custom/angular-material-calendar',
    './directives/index',
    './controllers/index',
    './services/index',
    './filters/index',
], function (angular) {
    'use strict';

    return angular.module('SocialIgnite', [
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
        'ui.router',
        'angularMoment',
    ])
        .config(['$mdThemingProvider', '$httpProvider', '$mdGestureProvider', function ($mdThemingProvider, $httpProvider, $mdGestureProvider) {
            var lightBlueCustom = $mdThemingProvider.extendPalette('light-blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['50', '100',
                    '200', '300', '400', 'A100'],
                'contrastLightColors': undefined
            });
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
        }])
        .run(['$rootScope', '$transitions', '$state', '$templateCache', '$http', 'Auth', 'moment',
            function ($rootScope, $transitions, $state, $templateCache, $http, Auth, moment) {

                moment.locale('en', {
                    relativeTime : {
                        future: "in %s",
                        past:   "%s ago",
                        s:  "seconds",
                        m:  "1m",
                        mm: "%dm",
                        h:  "1h",
                        hh: "%dh",
                        d:  "1d",
                        dd: "%dd",
                        M:  "1m",
                        MM: "%dm",
                        y:  "1y",
                        yy: "%dy"
                    }
                });

                $transitions.onBefore({to: 'portal.**'}, function (transition) {
                    var Auth = transition.injector().get('Auth');
                    return Auth.sessionValidate(function (loggedIn) {
                        if (!loggedIn) {
                            console.log("Redirecting from portal to public");
                            setTimeout(function () {
                                transition.router.stateService.target('public.home')
                                $state.go('public.home')
                            }, 0);
                            return false;
                        } else return true;
                    })
                });

                $transitions.onBefore({to: 'public.**'}, function (transition) {
                    var Auth = transition.injector().get('Auth');
                    return Auth.sessionValidate(function (loggedIn) {
                        if (loggedIn && transition.to().name != "public.email_verify_fill_email_code") {
                            console.log("Redirecting from public to portal");
                            setTimeout(function () {
                                transition.router.stateService.target('portal.home');
                                $state.go('portal.home')
                            }, 0);
                            return false;
                        } else return true;
                    });
                });

                // Remove people not allowed to access frontend. This is simply a deterrent, they still wouldn't have access to backend.
                $transitions.onBefore({to: 'admin.**'}, function (transition) {
                    var Auth = transition.injector().get('Auth');
                    Auth.sessionValidate(function (loggedIn) {
                        if (!$rootScope.user || !($rootScope.user.scope == "admin" || $rootScope.user.scope == "support")) {
                            console.log("Redirecting from admin to portal");
                            setTimeout(function () {
                                transition.router.stateService.target('portal.home');
                                $state.go('portal.home')
                            }, 0);
                            return false;
                        } else return true;
                    });
                });

                // // TODO: Temporarily disabled until made more efficient?
                // angular.forEach($state.get(), function (state, key) {
                //     if (state.templateUrl !== undefined && state.preload !== false) {
                //         $http.get(state.templateUrl, {cache: $templateCache});
                //     }
                // });
            }
        ]);
});
