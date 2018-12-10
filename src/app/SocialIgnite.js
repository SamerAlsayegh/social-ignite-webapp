import angular from "angular";

import "@uirouter/angularjs/release/angular-ui-router"
import "angular-material-data-table";
import "angular-moment";
import "angular-animate";
import "angular-material";
import "angular-cookies";
import "angular-messages";
import "angular-sanitize";
import "angular-google-analytics";
import "ng-file-upload";
import "chart.js";
import 'script-loader!intro.js';
import 'script-loader!angular-intro.js/build/angular-intro';

import "../custom/angular-material-calendar";
import "../custom/emoji-picker";
import Plotly from "../custom/charting";
import "./directives/index";
import "./controllers/index";
import "./services/index";
import "./filters/index";
import moment from 'moment';
import wdtLoading from "wdt-loading";


window['moment'] = moment;
window['Plotly'] = Plotly;

require('plotly.js-dist');

require('angular-moment-picker');

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
    'vkEmojiPicker',
    'angular-intro'
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

            momentPickerProvider.options({hoursFormat: 'LT', minutesFormat: 'LT'});
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
    .run(['$rootScope', '$transitions', '$state', '$templateCache', '$http', 'Auth', 'moment', '$cookies', 'Analytics', '$location', '$window', 'Metadata',
        function ($rootScope, $transitions, $state, $templateCache, $http, Auth, moment,
                  $cookies, Analytics, $location, $window, Metadata) {

            Metadata.updateMetadata();

                var cached = false;
                $transitions.onSuccess({}, function (transition) {
                    window.wdtLoading.done();
                    Analytics.trackPage($location.path());
                    // console.log("finished");
                    if (cached == false && transition.to().name.startsWith("portal")) {
                        cached = true;
                        $rootScope.$evalAsync(function () {
                            var url;

                            function preload(v) {
                                if (v.preload) {
                                    if (url = v.templateUrl) {
                                        $http.get(url, {cache: $templateCache});
                                    }
                                }
                                // state has multiple views. See if they need to be preloaded.
                                if (v.views) {
                                    for (var i in v.views) {
                                        // I have seen views with a views property.
                                        // Not sure if it's standard but won't hurt to support them
                                        preload(v.views[i]);
                                    }
                                }
                            }

                            $state.get().forEach(preload);
                        });
                    }
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
                            if (loggedIn && transition.to().name != "public.email_verify" && !transition.to().name.startsWith("public.tools")) {
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


                $window.addEventListener('beforeinstallprompt', function (e) {
                    e.prompt();
                })

                if ('serviceWorker' in navigator) {
                    // Register a service worker hosted at the root of the
                    // site using the default scope.
                    navigator.serviceWorker.register('/serviceWorker.js').then(function (registration) {
                        console.log('Service worker registration succeeded');
                    }).catch(function (error) {
                        console.log('Service worker registration failed:', error);
                    });

                    navigator.serviceWorker.addEventListener('message', function (event) {
                        // console.log(event.data.message); // Hello World !
                        console.log("SW Received Message: " + event.data);
                        event.ports[0].postMessage("SW Says 'Hello back!'");
                    });

                } else {
                    console.log('Service workers are not supported.');
                }

                !function () {
                    var t = window.driftt = window.drift = window.driftt || [];
                    if (!t.init) {
                        if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
                        t.invoked = !0, t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
                            t.factory = function (e) {
                                return function () {
                                    var n = Array.prototype.slice.call(arguments);
                                    return n.unshift(e), t.push(n), t;
                                };
                            }, t.methods.forEach(function (e) {
                            t[e] = t.factory(e);
                        }), t.load = function (t) {
                            var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
                            o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
                            var i = document.getElementsByTagName("script")[0];
                            i.parentNode.insertBefore(o, i);
                        };
                    }
                }();
                drift.SNIPPET_VERSION = '0.3.1';
                drift.load('33f45sf6x9hp');


                (function () {
                    /* Add this class to any elements you want to use to open Drift.
                     *
                     * Examples:
                     * - <a class="drift-open-chat">Questions? We're here to help!</a>
                     * - <button class="drift-open-chat">Chat now!</button>
                     *
                     * You can have any additional classes on those elements that you
                     * would ilke.
                     */

                    drift.on('ready', function (api) {
                        $rootScope.drift = true;
                        if ($rootScope.user != null) {
                            drift.identify($rootScope.user.email, {
                                _id: $rootScope.user._id,
                                scope: $rootScope.user.scope,
                                mailing_list: $rootScope.user.mailing_list,
                                verified: $rootScope.user.verified
                            });
                        }
                        // hide the widget when it first loads
                        api.widget.hide()
                        // show the widget when you receive a message
                        drift.on('message', function (e) {
                            if (!e.data.sidebarOpen) {
                                api.widget.show()
                            }
                        })
                        // hide the widget when you close the sidebar
                        drift.on('sidebarClose', function (e) {
                            if (e.data.widgetVisible) {
                                api.widget.hide()
                            }
                        })
                    })
                    var DRIFT_CHAT_SELECTOR = '.drift-open-chat';

                    /* http://youmightnotneedjquery.com/#ready */
                    function ready(fn) {
                        if (document.readyState != 'loading') {
                            fn();
                        } else if (document.addEventListener) {
                            document.addEventListener('DOMContentLoaded', fn);
                        } else {
                            document.attachEvent('onreadystatechange', function () {
                                if (document.readyState != 'loading')
                                    fn();
                            });
                        }
                    }

                    /* http://youmightnotneedjquery.com/#each */
                    function forEachElement(selector, fn) {
                        var elements = document.querySelectorAll(selector);
                        for (var i = 0; i < elements.length; i++)
                            fn(elements[i], i);
                    }

                    function openSidebar(driftApi, event) {
                        event.preventDefault();
                        driftApi.sidebar.open();
                        return false;
                    }

                    ready(function () {
                        drift.on('ready', function (api) {
                            var handleClick = openSidebar.bind(this, api)
                            forEachElement(DRIFT_CHAT_SELECTOR, function (el) {
                                el.addEventListener('click', handleClick);
                            });
                        });
                    });
                })();
            }
        ])
            ;
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
