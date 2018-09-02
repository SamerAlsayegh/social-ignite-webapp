import SocialIgnite from "SocialIgnite";

SocialIgnite.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider',
    function ($locationProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

        var data = {
            "__ASSETS__": __ASSETS__
        };

        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise(function ($injector, $location) {
            var state = $injector.get('$state');
            state.go("error.not_found", encodeURIComponent($location.path())); // here we get { query: ... }
            return $location.path();
        });


        $locationProvider.html5Mode(true);
        $stateProvider
            .state('public', {
                template: require("ejs-compiled-loader!views/_public/index.ejs")(data),//PublicIndex(data) ,
                controller: 'publicHomeController',
            })
            .state('public.login', {
                url: "/login",
                template: require("ejs-compiled-loader!views/_public/auth/login/view.ejs")(data),//PublicIndex(data),
            })
            .state('public.register', {
                url: "/register",
                template: require("ejs-compiled-loader!views/_public/auth/register/view.ejs")(data)
            })
            .state('public.forgotten_password', {
                url: "/forgotten_password?secure",
                template: require("ejs-compiled-loader!views/_public/auth/forgotten_password/view.ejs")(data)
            })


            .state('public.feedback', {
                template: require("ejs-compiled-loader!views/_public/feedback/index.ejs")(data)
            })
            .state('public.feedback.view', {
                url: "/feedback",
                controller: 'feedbackController',
                template: require("ejs-compiled-loader!views/_public/feedback/_view.ejs")(data)
            })






            .state('public.email_verify', {
                url: "/email_verify?email&code",
                template: require("ejs-compiled-loader!views/_public/auth/emailVerify/view.ejs")(data),
            })

            .state('public.tools', {
                url: "/free_tools",
                controller: 'publicToolsController',
                template: require("ejs-compiled-loader!views/_public/tools/index.ejs")(data)
            })
            .state('public.tools.lookup', {
                url: "/free_tools/lookup",
                controller: 'publicStatisticsController',
                template: require("ejs-compiled-loader!views/_public/tools/_lookup.ejs")(data)
            })




            /**
             * Portal related routes
             */


            .state('portal', {
                template: require("ejs-compiled-loader!views/_portal/index.ejs")(data),
                controller: 'portalHomeController',
            })
            .state('portal.home', {
                preload: true,
                url: "/",
                controller: 'dashboardController',
                template: require("ejs-compiled-loader!views/_portal/dashboard/index.ejs")(data)
            })
            .state('portal.post_now', {
                url: "/post?id",
                controller: 'editController',
                template: require("ejs-compiled-loader!views/_portal/schedule/_schedule.ejs")(data)
            })

            .state('portal.profile', {
                preload: true,
                template: require("ejs-compiled-loader!views/_portal/profile/index.ejs")(data),
            })
            .state('portal.profile.delete', {
                url: "/delete?code",
                controller: 'profileDeleteController',
                template: require("ejs-compiled-loader!views/_portal/profile/_view.ejs")(data)
            })
            .state('portal.profile.view', {
                preload: true,
                url: "/profile?tab",
                controller: 'profileController',
                template: require("ejs-compiled-loader!views/_portal/profile/_view.ejs")(data)
            })
            .state('portal.profile.view.advanced', {
                template: require("ejs-compiled-loader!views/_portal/profile/_advanced.ejs")(data)
            })

            .state('portal.resources', {
                preload: true,
                template: require("ejs-compiled-loader!views/_portal/resources/index.ejs")(data),
                controller: 'resourcesController',
            })
            .state('portal.resources.view', {
                preload: true,
                url: "/resources",
                template: require("ejs-compiled-loader!views/_portal/resources/_view.ejs")(data),
                params: {
                    postId: {dynamic: true},
                    attachedImage: {dynamic: true},
                    postInformation: {dynamic: true},
                }
            })
            .state('portal.resources.manage', {
                preload: true,
                url: "/resources/manage",
                template: require("ejs-compiled-loader!views/_portal/resources/_manage.ejs")(data)
            })


            .state('portal.profile.billing', {
                preload: true,
                controller: 'billingController',
                template: require("ejs-compiled-loader!views/_portal/billing/index.ejs")(data)
            })

            .state('portal.profile.billing.home', {
                preload: true,
                url: "/billing?package?tab",
                template: require("ejs-compiled-loader!views/_portal/billing/_view.ejs")(data)
            })


            .state('portal.accounts', {
                preload: true,
                template: require("ejs-compiled-loader!views/_portal/accounts/index.ejs")(data),
                controller: 'accountController',
            })
            .state('portal.accounts.home', {
                preload: true,
                url: "/accounts?fail",
                template: require("ejs-compiled-loader!views/_portal/accounts/_table.ejs")(data),
            })
            .state('portal.accounts.continue', {
                url: "/accounts/continue/:cache_id",
                template: require("ejs-compiled-loader!views/_portal/accounts/_continue.ejs")(data)
            })
            .state('portal.tools', {
                url: "/tools",
                controller: 'portalToolsController',
                template: require("ejs-compiled-loader!views/_portal/tools/_view.ejs")(data)
            })
            .state('portal.tools.lookup', {
                url: "/tools/lookup",
                controller: 'portalStatisticsController',
                template: require("ejs-compiled-loader!views/_portal/tools/_lookup.ejs")(data)
            })

            // .state('portal.support', {
            //     controller: 'supportController',
            //     template: require("ejs-compiled-loader!views/_portal/support/index.ejs")(data)
            // })
            //
            // .state('portal.support.home', {
            //     url: "/support",
            //     template: require("ejs-compiled-loader!views/_portal/support/_view.ejs")(data)
            // })
            // .state('portal.support.ticket', {})
            // .state('portal.support.ticket.new', {
            //     url: "/support/new",
            //     controller: 'supportSubController',
            //     template: require("ejs-compiled-loader!views/_portal/support/_newTicket.ejs")(data),
            // })
            // .state('portal.support.ticket.view', {
            //     controller: 'supportSubController',
            //     url: "/support/{ticketId}",
            //     template: require("ejs-compiled-loader!views/_portal/support/_ticket.ejs")(data),
            // })


            .state('portal.schedule', {
                preload: true,
                template: require("ejs-compiled-loader!views/_portal/schedule/index.ejs")(data),
                controller: 'scheduleController'
            })
            .state('portal.schedule.table', {
                preload: true,
                url: "/schedule?tab",
                template: require("ejs-compiled-loader!views/_portal/schedule/_table.ejs")(data),
                params: {
                    updateId: {dynamic: true},
                    updateState: {dynamic: true},
                    updateContent: {dynamic: true},
                }
            })

            // .state('portal.setup', {
            //     controller: 'setupController',
            //     template: require("ejs-compiled-loader!views/_portal/setup/index.ejs")(data),
            // })
            // .state('portal.setup.intro', {
            //     url: "/setup/intro",
            //     template: require("ejs-compiled-loader!views/_portal/setup/_intro.ejs")(data),
            // })
            // .state('portal.setup.add_page', {
            //     url: "/setup/add_page",
            //     template: require("ejs-compiled-loader!views/_portal/setup/_add_page.ejs")(data),
            // })
            // .state('portal.setup.schedule_post', {
            //     url: "/setup/schedule_post",
            //     template: require("ejs-compiled-loader!views/_portal/setup/_schedule_post.ejs")(data),
            // })
            // .state('portal.setup.finish', {
            //     url: "/setup/finish",
            //     template: require("ejs-compiled-loader!views/_portal/setup/_finish.ejs")(data),
            // })
            // .state('portal.schedule.edit', {
            //     controller: 'editController',
            //     url: "/schedule/edit/:postId",
            //     template: require("ejs-compiled-loader!views/_portal/schedule/_schedule.ejs")(data),
            //     params: {
            //         postId: null,
            //         attachedImage: null,
            //         postInformation: {dynamic: true},
            //     }
            // })


            .state('portal.statistics', {
                preload: true,
                template: require("ejs-compiled-loader!views/_portal/statistics/index.ejs")(data),
            })
            .state('portal.statistics.page_list', {
                preload: true,
                template: require("ejs-compiled-loader!views/_portal/statistics/page/_view.ejs")(data),
                controller: 'pageStatisticsController',
                url: "/statistics"
            })
            .state('portal.statistics.page_detail', {
                preload: true,
                template: require("ejs-compiled-loader!views/_portal/statistics/page/_detail.ejs")(data),
                controller: 'pageStatisticsDetailController',
                url: "/statistics/:pageId",
                params: {
                    pageId: null
                }
            })

            .state('portal.statistics.post_list', {
                preload: true,
                controller: 'postStatisticsController',
                url: "/statistics/post/:postId",
                template: require("ejs-compiled-loader!views/_portal/statistics/post/_view.ejs")(data),
                params: {
                    postId: null,
                    redirect: null
                }
            })
            .state('portal.statistics.post_detail', {
                preload: true,
                controller: 'postStatisticsDetailController',
                url: "/statistics/post/:postId/:socialPostId",
                template: require("ejs-compiled-loader!views/_portal/statistics/post/_detail.ejs")(data),
                params: {
                    postId: null,
                    socialPostId: null
                }
            })






            // Admin related routes
            .state('admin', {
                template: require("ejs-compiled-loader!views/_admin/index.ejs")(data),
                controller: 'adminHomeController',
                preload: false
            })
            .state('admin.home', {
                url: "/admin",
                // controller: 'adminHomeController',
                template: require("ejs-compiled-loader!views/_admin/_view.ejs")(data),
                preload: false
            })
            // .state('admin.support', {
            //     controller: 'adminSupportController',
            //     template: require("ejs-compiled-loader!views/_admin/support/index.ejs")(data),
            //     preload: false
            // })
            // .state('admin.support.home', {
            //     url: "/admin/support",
            //     template: require("ejs-compiled-loader!views/_admin/support/_view.ejs")(data),
            //     preload: false
            // })
            // .state('admin.support.ticket', {
            //     template: require("ejs-compiled-loader!views/_admin/support/_ticket.ejs")(data),
            //     url: "/admin/support/{ticketId}",
            //     controller: 'adminSupportSubController',
            //     preload: false
            // })
            // .state('admin.support.ticket.control', {
            //     // url: "/admin/support/{ticketId}",
            // })
            // .state('admin.support.ticket.control.view', {
            //
            // })


            .state('admin.user_management', {
                controller: 'adminUsersController',
                template: require("ejs-compiled-loader!views/_admin/accounts/index.ejs")(data),
                preload: false
            })

            .state('admin.user_management.home', {
                url: "/admin/accounts",
                template: require("ejs-compiled-loader!views/_admin/accounts/_view.ejs")(data),
                preload: false
            })
            .state('admin.user_management.user', {
                controller: 'adminUsersSubController',
                url: "/admin/accounts/{accountId}",
                template: require("ejs-compiled-loader!views/_admin/accounts/_account.ejs")(data),
                preload: false
            })


            .state('error', {
                template: require("ejs-compiled-loader!views/_error/index.ejs")(data),
                controller: 'errorController',
            })
            .state('error.not_found', {
                url: "*path",
                template: require("ejs-compiled-loader!views/_error/not_found.ejs")(data)
            });
    }]);
