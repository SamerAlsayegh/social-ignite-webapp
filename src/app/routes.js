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
                    templateUrl: '/_public/index.html',
                    controller: 'publicHomeController',
                })
                .state('public.home', {
                    url: "/",
                    templateUrl: '/_public/auth/register/register.html'
                })
                .state('public.feedback', {
                    templateUrl: '/_public/feedback/index.html'
                })
                .state('public.feedback.view', {
                    url: "/feedback",
                    controller: 'feedbackController',
                    templateUrl: '/_public/feedback/_view.html'
                })

                .state('public.email_verify', {
                    url: "/email_verify",
                    templateUrl: '/_public/auth/emailVerify/emailVerify.html'
                })
                .state('public.email_verify_fill_email', {
                    url: "/email_verify/{email}",
                    templateUrl: '/_public/auth/emailVerify/emailVerify.html'
                })
                .state('public.email_verify_fill_email_code', {
                    url: "/email_verify/{email}/{code}",
                    templateUrl: '/_public/auth/emailVerify/emailVerify.html'
                })

                .state('public.login', {
                    url: "/login",
                    templateUrl: '/_public/auth/login/login.html'
                })



                /**
                 * Portal related routes
                 */


                .state('portal', {
                    templateUrl: '/_portal/index.html',
                    controller: 'portalHomeController',
                })
                .state('portal.home', {
                    url: "/portal",
                    templateUrl: '/_portal/dashboard/index.html'
                })


                .state('portal.profile', {
                    templateUrl: '/_portal/profile/index.html',
                })
                .state('portal.profile.delete', {
                    url: "/portal/delete/{code}",
                    controller: 'profileDeleteController',
                    templateUrl: '/_portal/profile/_delete.html'
                })
                .state('portal.profile.view', {
                    url: "/portal/profile",
                    controller: 'profileController',
                    templateUrl: '/_portal/profile/_view.html'
                })
                .state('portal.profile.view.advanced', {
                    templateUrl: '/_portal/profile/_advanced.html'
                })

                .state('portal.resources', {
                    templateUrl: '/_portal/resources/index.html',
                    controller: 'resourcesController',
                })
                .state('portal.resources.view', {
                    url: "/portal/resources",
                    templateUrl: '/_portal/resources/_view.html',
                    params: {
                        postId: {dynamic: true},
                        attachedImage: {dynamic: true},
                        postInformation: {dynamic: true},
                    }
                })
                .state('portal.resources.manage', {
                    url: "/portal/resources/manage",
                    templateUrl: '/_portal/resources/_manage.html'
                })


                .state('portal.profile.billing', {
                    controller: 'billingController',
                    templateUrl: '/_portal/billing/index.html'
                })

                .state('portal.profile.billing.home', {
                    url: "/portal/billing",
                    templateUrl: '/_portal/billing/_view.html'
                })


                .state('portal.accounts', {
                    templateUrl: '/_portal/accounts/index.html',
                    controller: 'accountController'
                })
                .state('portal.accounts.home', {
                    url: "/portal/accounts",
                    templateUrl: '/_portal/accounts/_table.html'
                })
                .state('portal.accounts.continue', {
                    url: "/portal/accounts/continue/{cache_id}",
                    templateUrl: '/_portal/accounts/_continue.html'
                })
                .state('portal.accounts.home_fail', {
                    url: "/portal/accounts/fail/{error}",
                    templateUrl: '/_portal/accounts/_table.html'
                })

                .state('portal.support', {
                    controller: 'supportController',
                    templateUrl: '/_portal/support/index.html'
                })

                .state('portal.support.home', {
                    url: "/portal/support",
                    templateUrl: '/_portal/support/_view.html'
                })
                .state('portal.support.ticket', {

                })
                .state('portal.support.ticket.new', {
                    url: "/portal/support/new",
                    controller: 'supportSubController',
                    templateUrl: '/_portal/support/_newTicket.html',
                })
                .state('portal.support.ticket.view', {
                    controller: 'supportSubController',
                    url: "/portal/support/{ticketId}",
                    templateUrl: '/_portal/support/_ticket.html',
                })










                .state('portal.schedule', {
                    templateUrl: '/_portal/schedule/index.html',
                    controller: 'scheduleController'
                })
                .state('portal.schedule.table', {
                    url: "/portal/schedule",
                    templateUrl: '/_portal/schedule/_table.html',
                    params: {
                        updateId: {dynamic: true},
                        updateContent: {dynamic: true},
                    }
                })
                .state('portal.schedule.edit', {
                    controller: 'editController',
                    url: "/portal/schedule/edit/:postId",
                    templateUrl: '/_portal/schedule/_schedule.html',
                    params: {
                        postId: null,
                        attachedImage: null,
                        postInformation: {dynamic: true},
                    }
                })
                .state('portal.schedule.statistics', {
                    controller: 'statisticsController',
                    url: "/portal/schedule/view/:postId",
                    templateUrl: '/_portal/schedule/_analytics.html',
                    params: {
                        postId: null
                    }
                })



                .state('portal.heatmap', {
                    templateUrl: '/_portal/heatmap/index.html',
                })
                .state('portal.heatmap.view', {
                    templateUrl: '/_portal/heatmap/_view.html',
                    controller: 'heatmapController',
                    url: "/portal/heatmap"
                })





                // Admin related routes
                .state('admin', {
                    templateUrl: '/_admin/index.html',
                    controller: 'portalHomeController',
                })
                .state('admin.home', {
                    url: "/admin",
                    controller: 'adminHomeController',
                    templateUrl: '/_admin/_view.html'
                })
                .state('admin.support', {
                    controller: 'adminSupportController',
                    templateUrl: '/_admin/support/index.html'
                })
                .state('admin.support.home', {
                    url: "/admin/support",
                    templateUrl: '/_admin/support/_view.html'
                })
                .state('admin.support.ticket', {
                    templateUrl: '/_admin/support/_ticket.html',
                    url: "/admin/support/{ticketId}",
                    controller: 'adminSupportSubController',
                })
                // .state('admin.support.ticket.control', {
                //     // url: "/admin/support/{ticketId}",
                // })
                // .state('admin.support.ticket.control.view', {
                //
                // })




                .state('admin.user_management', {
                    controller: 'adminUsersController',
                    templateUrl: '/_admin/accounts/index.html'
                })

                .state('admin.user_management.home', {
                    url: "/admin/accounts",
                    templateUrl: '/_admin/accounts/_view.html'
                })
                .state('admin.user_management.user', {
                    controller: 'adminUsersSubController',
                    url: "/admin/accounts/{accountId}",
                    templateUrl: '/_admin/accounts/_account.html',
                })


                .state('error', {
                    templateUrl: '/error/index.html',
                    controller: 'errorController'
                })
                .state('error.not_found', {
                    url: "*path",
                    templateUrl: '/error/not_found.html'
                });
        }]);
});
