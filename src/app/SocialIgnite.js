define([
    'angular',
    // 'moment',
    // 'angular-nvd3',
    '@uirouter/angularjs/release/angular-ui-router.js',
    'angular-material-data-table',
    'angular-moment',
    'angular-animate',
    'angular-material',
    'angular-cookies',
    'angular-sanitize',
    'angular-moment-picker/dist/angular-moment-picker.js',
    'ng-file-upload',
    'chart.js',
    'chartjs-plugin-annotation',
    // // 'angularPopover',
    '../custom/angular-material-calendar',
    './directives/index',
    './controllers/index',
    './services/index',
    // 'filters/index'
], function (angular) {
    'use strict';
    // console.log(nvd3);
    return angular.module('SocialIgnite', [
        'SocialIgnite.controllers',
        'SocialIgnite.services',
        'SocialIgnite.directives',
        'md.data.table',
        // 'ngPopover',
        // 'moment',
        'moment-picker',
        'ngSanitize',
        'ngAnimate',
        'ngMaterial',
        'ngFileUpload',
        // 'nvd3',
        'ngCookies',
        'materialCalendar',
        'ui.router',
        'angularMoment'
    ])
    // .constant('API', )
    // .constant('API', 'https://portal.socialignite.media:8000')
        .config(['$mdThemingProvider', '$httpProvider', function ($mdThemingProvider, $httpProvider) {
            // Use that theme for the primary intentions
            var lightBlueCustom = $mdThemingProvider.extendPalette('light-blue', {

                'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                    // on this palette should be dark or light

                'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                    '200', '300', '400', 'A100'],
                'contrastLightColors': undefined    // could also specify this if default was 'dark'
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

            $httpProvider.defaults.withCredentials = true;
        }])
        .run(['$transitions', '$state', '$templateCache', '$http', 'Auth',
            function ($transitions, $state, $templateCache, $http, Auth) {

                $transitions.onBefore({to: 'portal.**'}, function (transition) {
                    var Auth = transition.injector().get('Auth');
                    return Auth.sessionValidate(function (loggedIn) {
                        if (!loggedIn) {
                            console.log("Redirecting from portal to public");
                            return transition.router.stateService.go('public.home');
                        } else return true;
                    })
                });

                $transitions.onBefore({to: 'public.**'}, function (transition) {
                    var Auth = transition.injector().get('Auth');
                    return Auth.sessionValidate(function (loggedIn) {
                        if (loggedIn) {
                            console.log("Redirecting from public to portal");
                            return transition.router.stateService.go('portal.home');
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
