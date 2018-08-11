import SocialIgnite from "./SocialIgnite";

SocialIgnite.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
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
                templateUrl: __ASSETS__ + '/_public/index.html',
                controller: 'publicHomeController',
            })
            .state('public.login', {
                url: "/login",
                templateUrl: __ASSETS__ + '/_public/auth/login/view.html'
            })
            .state('public.register', {
                url: "/register",
                templateUrl: __ASSETS__ + '/_public/auth/register/view.html'
            })
            .state('public.forgotten_password', {
                url: "/forgotten_password?secure",
                templateUrl: __ASSETS__ + '/_public/auth/forgotten_password/view.html'
            })


            .state('public.feedback', {
                templateUrl: __ASSETS__ + '/_public/feedback/index.html'
            })
            .state('public.feedback.view', {
                url: "/feedback",
                controller: 'feedbackController',
                templateUrl: __ASSETS__ + '/_public/feedback/_view.html'
            })

            .state('public.email_verify', {
                url: "/email_verify?email&code",
                templateUrl: __ASSETS__ + '/_public/auth/emailVerify/view.html',
            })





            /**
             * Portal related routes
             */


            .state('portal', {
                templateUrl: __ASSETS__ + '/_portal/index.html',
                controller: 'portalHomeController',
            })
            .state('portal.home', {
                url: "/",
                controller: 'dashboardController',
                templateUrl: __ASSETS__ + '/_portal/dashboard/index.html'
            })


            .state('portal.profile', {
                templateUrl: __ASSETS__ + '/_portal/profile/index.html',
            })
            .state('portal.profile.delete', {
                url: "/delete?code",
                controller: 'profileDeleteController',
                templateUrl: __ASSETS__ + '/_portal/profile/_delete.html'
            })
            .state('portal.profile.view', {
                url: "/profile?tab",
                controller: 'profileController',
                templateUrl: __ASSETS__ + '/_portal/profile/_view.html'
            })
            .state('portal.profile.view.advanced', {
                templateUrl: __ASSETS__ + '/_portal/profile/_advanced.html'
            })

            .state('portal.resources', {
                templateUrl: __ASSETS__ + '/_portal/resources/index.html',
                controller: 'resourcesController',
            })
            .state('portal.resources.view', {
                url: "/resources",
                templateUrl: __ASSETS__ + '/_portal/resources/_view.html',
                params: {
                    postId: {dynamic: true},
                    attachedImage: {dynamic: true},
                    postInformation: {dynamic: true},
                }
            })
            .state('portal.resources.manage', {
                url: "/resources/manage",
                templateUrl: __ASSETS__ + '/_portal/resources/_manage.html'
            })


            .state('portal.profile.billing', {
                controller: 'billingController',
                templateUrl: __ASSETS__ + '/_portal/billing/index.html'
            })

            .state('portal.profile.billing.home', {
                url: "/billing?package?tab",
                templateUrl: __ASSETS__ + '/_portal/billing/_view.html'
            })


            .state('portal.accounts', {
                templateUrl: __ASSETS__ + '/_portal/accounts/index.html',
                controller: 'accountController',
            })
            .state('portal.accounts.home', {
                url: "/accounts?fail",
                templateUrl: __ASSETS__ + '/_portal/accounts/_table.html',
            })
            .state('portal.accounts.continue', {
                url: "/accounts/continue/:cache_id",
                templateUrl: __ASSETS__ + '/_portal/accounts/_continue.html'
            })

            .state('portal.support', {
                controller: 'supportController',
                templateUrl: __ASSETS__ + '/_portal/support/index.html'
            })

            .state('portal.support.home', {
                url: "/support",
                templateUrl: __ASSETS__ + '/_portal/support/_view.html'
            })
            .state('portal.support.ticket', {})
            .state('portal.support.ticket.new', {
                url: "/support/new",
                controller: 'supportSubController',
                templateUrl: __ASSETS__ + '/_portal/support/_newTicket.html',
            })
            .state('portal.support.ticket.view', {
                controller: 'supportSubController',
                url: "/support/{ticketId}",
                templateUrl: __ASSETS__ + '/_portal/support/_ticket.html',
            })


            .state('portal.schedule', {
                templateUrl: __ASSETS__ + '/_portal/schedule/index.html',
                controller: 'scheduleController'
            })
            .state('portal.schedule.table', {
                url: "/schedule?tab",
                templateUrl: __ASSETS__ + '/_portal/schedule/_table.html',
                params: {
                    updateId: {dynamic: true},
                    updateState: {dynamic: true},
                    updateContent: {dynamic: true},
                }
            })

            // .state('portal.setup', {
            //     controller: 'setupController',
            //     templateUrl: __ASSETS__ + '/_portal/setup/index.html',
            // })
            // .state('portal.setup.intro', {
            //     url: "/setup/intro",
            //     templateUrl: __ASSETS__ + '/_portal/setup/_intro.html',
            // })
            // .state('portal.setup.add_page', {
            //     url: "/setup/add_page",
            //     templateUrl: __ASSETS__ + '/_portal/setup/_add_page.html',
            // })
            // .state('portal.setup.schedule_post', {
            //     url: "/setup/schedule_post",
            //     templateUrl: __ASSETS__ + '/_portal/setup/_schedule_post.html',
            // })
            // .state('portal.setup.finish', {
            //     url: "/setup/finish",
            //     templateUrl: __ASSETS__ + '/_portal/setup/_finish.html',
            // })
            // .state('portal.schedule.edit', {
            //     controller: 'editController',
            //     url: "/schedule/edit/:postId",
            //     templateUrl: __ASSETS__ + '/_portal/schedule/_schedule.html',
            //     params: {
            //         postId: null,
            //         attachedImage: null,
            //         postInformation: {dynamic: true},
            //     }
            // })



            .state('portal.statistics', {
                templateUrl: __ASSETS__ + '/_portal/statistics/index.html',
            })
            .state('portal.statistics.page_list', {
                templateUrl: __ASSETS__ + '/_portal/statistics/page/_view.html',
                controller: 'pageStatisticsController',
                url: "/statistics"
            })
            .state('portal.statistics.page_detail', {
                templateUrl: __ASSETS__ + '/_portal/statistics/page/_detail.html',
                controller: 'pageStatisticsDetailController',
                url: "/statistics/:pageId",
                params: {
                    pageId: null
                }
            })

            .state('portal.statistics.post_list', {
                controller: 'postStatisticsController',
                url: "/statistics/post/:postId",
                templateUrl: __ASSETS__ + '/_portal/statistics/post/_view.html',
                params: {
                    postId: null,
                    redirect: null
                }
            })
            .state('portal.statistics.post_detail', {
                controller: 'postStatisticsDetailController',
                url: "/statistics/post/:postId/:socialPostId",
                templateUrl: __ASSETS__ + '/_portal/statistics/post/_detail.html',
                params: {
                    postId: null,
                    socialPostId: null
                }
            })






            // Admin related routes
            .state('admin', {
                templateUrl: __ASSETS__ + '/_admin/index.html',
                controller: 'adminHomeController',
            })
            .state('admin.home', {
                url: "/admin",
                // controller: 'adminHomeController',
                templateUrl: __ASSETS__ + '/_admin/_view.html'
            })
            .state('admin.support', {
                controller: 'adminSupportController',
                templateUrl: __ASSETS__ + '/_admin/support/index.html'
            })
            .state('admin.support.home', {
                url: "/admin/support",
                templateUrl: __ASSETS__ + '/_admin/support/_view.html'
            })
            .state('admin.support.ticket', {
                templateUrl: __ASSETS__ + '/_admin/support/_ticket.html',
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
                templateUrl: __ASSETS__ + '/_admin/accounts/index.html'
            })

            .state('admin.user_management.home', {
                url: "/admin/accounts",
                templateUrl: __ASSETS__ + '/_admin/accounts/_view.html'
            })
            .state('admin.user_management.user', {
                controller: 'adminUsersSubController',
                url: "/admin/accounts/{accountId}",
                templateUrl: __ASSETS__ + '/_admin/accounts/_account.html',
            })


            .state('error', {
                templateUrl: __ASSETS__ + '/error/index.html',
                controller: 'errorController'
            })
            .state('error.not_found', {
                url: "*path",
                templateUrl: __ASSETS__ + '/error/not_found.html'
            });
    }]);
