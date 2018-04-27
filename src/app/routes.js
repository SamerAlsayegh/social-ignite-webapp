define(['./SocialIgnite'], function (SocialIgnite) {
    'use strict';
    return SocialIgnite.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
        function ($locationProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

            $urlMatcherFactoryProvider.strictMode(false);
            $urlRouterProvider.otherwise(function ($injector, $location) {
                var state = $injector.get('$state');
                state.go("error.not_found", encodeURIComponent($location.path())); // here we get { query: ... }
                return $location.path();
            });

            $locationProvider.html5Mode(true);
            $stateProvider


                .state('public', {
                    templateUrl: '/pub/public/index.html',
                    controller: 'publicHomeController',
                    // resolve: {
                    //     sessionLoggedIn: ['Auth', '$state', function(Auth, $state){
                    //         Auth.sessionValidate(function(loggedIn){
                    //             if (loggedIn){
                    //                 console.log("Redirecting to portal");
                    //                 $state.go('portal.home', {}, {reload: 'portal.home'})//If the session is invalid, take to login page.
                    //             }
                    //         })
                    //     }]
                    // }
                })
                .state('public.home', {
                    url: "/",
                    templateUrl: '/pub/public/auth/register/register.html'
                })


                .state('public.email_verify', {
                    url: "/email_verify",
                    templateUrl: '/pub/public/auth/emailVerify/emailVerify.html'
                })
                .state('public.email_verify_fill_email', {
                    url: "/email_verify/{email}",
                    templateUrl: '/pub/public/auth/emailVerify/emailVerify.html'
                })
                .state('public.email_verify_fill_email_code', {
                    url: "/email_verify/{email}/{code}",
                    templateUrl: '/pub/public/auth/emailVerify/emailVerify.html'
                })

                .state('public.login', {
                    url: "/login",
                    templateUrl: '/pub/public/auth/login/login.html'
                })
                // .state('public.register', {
                //     url: "/register",
                //     templateUrl: '/pub/public/auth/register/register.html'
                // })



                /**
                 * Portal related routes
                 */


                .state('portal', {
                    templateUrl: '/pub/portal/index.html',
                    controller: 'portalHomeController',
                })
                .state('portal.home', {
                    url: "/portal",
                    templateUrl: '/pub/portal/dashboard/index.html'
                })



                .state('portal.profile', {
                    templateUrl: '/pub/portal/profile/index.html',
                    controller: 'portalProfileController',
                })
                .state('portal.profile.view', {
                    url: "/portal/profile",
                    templateUrl: '/pub/portal/profile/_view.html'
                })

                .state('portal.resources', {
                    templateUrl: '/pub/portal/resources/index.html',
                    controller: 'portalResourcesController',
                })
                .state('portal.resources.view', {
                    url: "/portal/resources",
                    templateUrl: '/pub/portal/resources/_view.html',
                    params: {
                        postId: {dynamic: true},
                        attachedImage: {dynamic: true},
                        postInformation: {dynamic: true},
                    }
                })
                .state('portal.resources.manage', {
                    url: "/portal/resources/manage",
                    templateUrl: '/pub/portal/resources/_manage.html'
                })


                .state('portal.profile.billing', {
                    controller: 'billingSubController',
                    templateUrl: '/pub/portal/billing/index.html'
                })

                .state('portal.profile.billing.home', {
                    url: "/portal/billing",
                    templateUrl: '/pub/portal/billing/_view.html'
                })


                .state('portal.accounts', {
                    templateUrl: '/pub/portal/accounts/index.html',
                    controller: 'portalAccountController'
                })
                .state('portal.accounts.home', {
                    url: "/portal/accounts",
                    templateUrl: '/pub/portal/accounts/_table.html'
                })
                .state('portal.accounts.continue', {
                    url: "/portal/accounts/continue/{cache_id}",
                    templateUrl: '/pub/portal/accounts/_continue.html'
                })
                .state('portal.accounts.home_fail', {
                    url: "/portal/accounts/fail/{error}",
                    templateUrl: '/pub/portal/accounts/_table.html'
                })



                .state('portal.schedule', {
                    templateUrl: '/pub/portal/schedule/index.html',
                    controller: 'portalScheduleController'
                })
                .state('portal.schedule.table', {
                    url: "/portal/schedule",
                    templateUrl: '/pub/portal/schedule/_table.html',
                    params: {
                        updateId: {dynamic: true},
                        updateContent: {dynamic: true},
                    }
                })
                .state('portal.schedule.edit', {
                    controller: 'editPostController',
                    url: "/portal/schedule/edit/:postId",
                    templateUrl: '/pub/portal/schedule/_schedule.html',
                    params: {
                        postId: null,
                        attachedImage: null,
                        postInformation: {dynamic: true},
                    }
                })
                .state('portal.schedule.statistics', {
                    controller: 'statisticsSubController',
                    url: "/portal/schedule/view/:postId",
                    templateUrl: '/pub/portal/schedule/_analytics.html',
                    params: {
                        postId: null
                    }
                })



                .state('portal.heatmap', {
                    templateUrl: '/pub/portal/heatmap/index.html',
                    controller: 'heatmapController',
                    url: "/portal/heatmap"
                })





                .state('error', {
                    templateUrl: '/pub/error/index.html',
                    controller: 'errorController'
                })
                .state('error.not_found', {
                    url: "*path",
                    templateUrl: '/pub/error/not_found.html'
                });
            // $urlRouterProvider.otherwise("/home");
            // $routeProvider
            //     .when('/', {
            //         templateUrl: '/pub/app/pub/public/index.html',
            //         controller: 'publicHomeController',
            //         controllerAs: 'vm'
            //     })
            //
            //     .when('/portal', {
            //         controller: 'clientHomeController',
            //         templateUrl: '/pub/app/pub/portal/index.html',
            //         controllerAs: 'vm'
            //     })
            //     .when('/portal/login', {
            //         controller: 'publicHomeController',
            //         templateUrl: '/pub/app/pub/public/loginFocus.html',
            //         controllerAs: 'vm'
            //     })
            //
            //     .otherwise({ redirectTo: '/portal/login' });
        }]);
});
