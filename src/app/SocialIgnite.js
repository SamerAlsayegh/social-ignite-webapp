Object.defineProperty(exports, "__esModule", {
    value: true
});
let _angular = require("angular");

let _angular2 = _interopRequireDefault(_angular);

require("@uirouter/angularjs/release/angular-ui-router");

require("angular-material-data-table");

require("angular-moment");

require("angular-animate");

require("angular-material");

require("angular-cookies");

require("angular-messages");

require("angular-sanitize");

require("angular-google-analytics");

require("ng-file-upload");
require("ng-password-meter/dist/ng-password-meter")


require("chart.js");

// require("script-loader!angular-dragdrop");

require("script-loader!intro.js");

require("script-loader!angular-intro.js/build/angular-intro");

require("../custom/angular-material-calendar");

require("../custom/emoji-picker");

require("./directives/index");

require("./controllers/index");

require("./services/index");

require("./filters/index");

let _moment = require("moment");

let _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

window['moment'] = _moment2.default;
// window['Plotly'] = Plotly;
// require('plotly.js-dist');

require('angular-moment-picker');
// require("script-loader!draggabilly/dist/draggabilly.pkgd.js");


_moment2.default.locale('en');

exports.default = _angular2.default.module('SocialIgnite', ['SocialIgnite.controllers',
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
    'angular-intro', require('ng-sortable'), 'ngPasswordMeter']).config(['$mdThemingProvider', '$httpProvider', '$mdGestureProvider', 'AnalyticsProvider', 'momentPickerProvider', '$sceDelegateProvider', ($mdThemingProvider,
                                                                                                                                                                                         _ref,
                                                                                                                                                                                          $mdGestureProvider,
                                                                                                                                                                                         AnalyticsProvider,
                                                                                                                                                                                         momentPickerProvider,
                                                                                                                                                                                         $sceDelegateProvider) => {
    let defaults = _ref.defaults;

    let lightBlueCustom = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
        'contrastLightColors': undefined
    });

    AnalyticsProvider.setAccount('UA-63794417-10');
    AnalyticsProvider.trackPrefix('p');

    momentPickerProvider.options({hoursFormat: 'LT', minutesFormat: 'LT'});
    $mdThemingProvider.definePalette('lightBlueCustom', lightBlueCustom);
    $mdThemingProvider.theme('default').primaryPalette('lightBlueCustom').accentPalette('light-blue').backgroundPalette('grey');
    $mdThemingProvider.theme('dark').primaryPalette('lightBlueCustom').accentPalette('light-blue').backgroundPalette('grey').dark();
    $mdGestureProvider.disableAll();
    defaults.withCredentials = true;
    $sceDelegateProvider.resourceUrlWhitelist(['https://assets.socialignite.media/**', 'self']);
}]).run(['$rootScope', '$transitions', '$state', '$templateCache', '$http', 'Auth', 'moment', '$cookies', 'Analytics', '$location', '$window', 'Metadata', ($rootScope,
                                                                                                                                                            $transitions,
                                                                                                                                                            $state,
                                                                                                                                                            $templateCache,
                                                                                                                                                            $http,
                                                                                                                                                            Auth,
                                                                                                                                                            moment,
                                                                                                                                                            $cookies,
                                                                                                                                                            Analytics,
                                                                                                                                                            $location,
                                                                                                                                                            $window,
                                                                                                                                                            Metadata) => {

    Metadata.updateMetadata();

    let cached = false;
    $transitions.onSuccess({}, transition => {
        window.wdtLoading.done();
        Analytics.trackPage($location.path());
        // console.log("finished");
        // if (cached === false && transition.to().name.startsWith("portal")) {
        //     cached = true;
        //     $rootScope.$evalAsync(() => {
        //         let url = void 0;
        //
        //         function preload(v) {
        //             if (v.preload) {
        //                 if (url = v.templateUrl) {
        //                     $http.get(url, {cache: $templateCache});
        //                 }
        //             }
        //             // state has multiple views. See if they need to be preloaded.
        //             if (v.views) {
        //                 for (let i in v.views) {
        //                     // I have seen views with a views property.
        //                     // Not sure if it's standard but won't hurt to support them
        //                     preload(v.views[i]);
        //                 }
        //             }
        //         }
        //
        //         $state.get().forEach(preload);
        //     });
        // }
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

    $transitions.onBefore({to: 'portal.**'}, transition => {
        let Auth = transition.injector().get('Auth');
        return new Promise((resolve, reject) => {
            Auth.sessionValidate(loggedIn => {
                if (!loggedIn) {
                    console.log("Redirecting from portal to public");
                    $cookies.put("redirect_on_login", transition.to().name);
                    $state.go('public.auth.register');
                    reject();
                } else resolve();
            });
        });
    });

    $transitions.onBefore({to: 'public.**'}, transition => {
        let Auth = transition.injector().get('Auth');
        return new Promise((resolve, reject) => {
            Auth.sessionValidate(loggedIn => {
                if (loggedIn && transition.to().name !== "public.email_verify" && !transition.to().name.startsWith("public.tools")) {
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
    $transitions.onBefore({to: 'admin.**'}, transition => {
        let Auth = transition.injector().get('Auth');
        return new Promise((resolve, reject) => {
            Auth.sessionValidate(loggedIn => {
                if (!$rootScope.user || !($rootScope.user.scope === "admin" || $rootScope.user.scope === "support")) {
                    console.log("Redirecting from admin to portal");
                    $state.go('portal.home');
                    reject();
                } else {
                    resolve();
                }
            });
        });
    });

    $window.addEventListener('beforeinstallprompt', e => {
        e.prompt();
    });

    if ('serviceWorker' in navigator) {
        // Register a service worker hosted at the root of the
        // site using the default scope.
        navigator.serviceWorker.register('/serviceWorker.js').then(registration => {
            console.log('Service worker registration succeeded');
        }).catch(error => {
            console.log('Service worker registration failed:', error);
        });
        //
        // navigator.serviceWorker.addEventListener('message', _ref2 => {
        //     let data = _ref2.data,
        //         ports = _ref2.ports;
        //
        //     console.log(event.data.message); // Hello World !
        // console.log("SW Received Message: " + data);
        // ports[0].postMessage("SW Says 'Hello back!'");
        // });
    } else {
        console.log('Service workers are not supported.');
    }
    // !function () {
    //     var t = window.driftt = window.drift = window.driftt || [];
    //     if (!t.init) {
    //         if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
    //         t.invoked = !0, t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
    //             t.factory = function (e) {
    //                 return function () {
    //                     var n = Array.prototype.slice.call(arguments);
    //                     return n.unshift(e), t.push(n), t;
    //                 };
    //             }, t.methods.forEach(function (e) {
    //             t[e] = t.factory(e);
    //         }), t.load = function (t) {
    //             var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
    //             o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
    //             var i = document.getElementsByTagName("script")[0];
    //             i.parentNode.insertBefore(o, i);
    //         };
    //     }
    // }();
    // drift.SNIPPET_VERSION = '0.3.1';
    // drift.load('33f45sf6x9hp');
    // (() => {
    //     /* Add this class to any elements you want to use to open Drift.
    //      *
    //      * Examples:
    //      * - <a class="drift-open-chat">Questions? We're here to help!</a>
    //      * - <button class="drift-open-chat">Chat now!</button>
    //      *
    //      * You can have any additional classes on those elements that you
    //      * would ilke.
    //      */
    //
    //     drift.on('ready', _ref3 => {
    //         let widget = _ref3.widget;
    //
    //         $rootScope.drift = true;
    //         if ($rootScope.user != null) {
    //             drift.identify($rootScope.user.email, {
    //                 _id: $rootScope.user._id,
    //                 scope: $rootScope.user.scope,
    //                 mailing_list: $rootScope.user.mailing_list,
    //                 verified: $rootScope.user.verified
    //             });
    //         }
    //         // hide the widget when it first loads
    //         widget.hide();
    //         // show the widget when you receive a message
    //         drift.on('message', _ref4 => {
    //             let data = _ref4.data;
    //
    //             if (!data.sidebarOpen) {
    //                 widget.show();
    //             }
    //         });
    //         // hide the widget when you close the sidebar
    //         drift.on('sidebarClose', _ref5 => {
    //             let data = _ref5.data;
    //
    //             if (data.widgetVisible) {
    //                 widget.hide();
    //             }
    //         });
    //     });
    //     let DRIFT_CHAT_SELECTOR = '.drift-open-chat';
    //
    //     /* http://youmightnotneedjquery.com/#ready */
    //     function ready(fn) {
    //         if (document.readyState != 'loading') {
    //             fn();
    //         } else if (document.addEventListener) {
    //             document.addEventListener('DOMContentLoaded', fn);
    //         } else {
    //             document.attachEvent('onreadystatechange', () => {
    //                 if (document.readyState != 'loading') fn();
    //             });
    //         }
    //     }
    //
    //     /* http://youmightnotneedjquery.com/#each */
    //     function forEachElement(selector, fn) {
    //         let elements = document.querySelectorAll(selector);
    //         for (let i = 0; i < elements.length; i++) {
    //             fn(elements[i], i);
    //         }
    //     }
    //
    //     function openSidebar(_ref6, event) {
    //         let sidebar = _ref6.sidebar;
    //
    //         event.preventDefault();
    //         sidebar.open();
    //         return false;
    //     }
    //
    //     ready(() => {
    //         drift.on('ready', function (api) {
    //             let handleClick = openSidebar.bind(this, api);
    //             forEachElement(DRIFT_CHAT_SELECTOR, el => {
    //                 el.addEventListener('click', handleClick);
    //             });
    //         });
    //     });
    // })();
}]);
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