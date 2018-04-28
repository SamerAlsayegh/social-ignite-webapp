define([
    'angular',
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
    '../custom/angular-material-calendar',
    './directives/index',
    './controllers/index',
    './services/index',
    // 'filters/index'
], function (angular) {
    'use strict';
    return angular.module('SocialIgnite', [
        'SocialIgnite.controllers',
        'SocialIgnite.services',
        'SocialIgnite.directives',
        'md.data.table',
        'moment-picker',
        'ngSanitize',
        'ngAnimate',
        'ngMaterial',
        'ngFileUpload',
        'ngCookies',
        'materialCalendar',
        'ui.router',
        'angularMoment'
    ])
        .config(['$mdThemingProvider', '$httpProvider', function ($mdThemingProvider, $httpProvider) {
            var lightBlueCustom = $mdThemingProvider.extendPalette('light-blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['50', '100',
                    '200', '300', '400', 'A100'],
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                // 'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                // 'hue-3': '00', // use shade A100 for the <code>md-hue-3</code> class
            });
            $mdThemingProvider.definePalette('lightBlueCustom', lightBlueCustom);



            $mdThemingProvider.theme('default')
                .primaryPalette('lightBlueCustom')
                .accentPalette('grey')
                .backgroundPalette('grey');
            $mdThemingProvider.theme('dark')
                .primaryPalette('lightBlueCustom')
                .accentPalette('grey')
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
