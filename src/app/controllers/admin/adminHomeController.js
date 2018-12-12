require("expose-loader?io!socket.io-client");

define(['./../module'], controllers => controllers.controller('adminHomeController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
    '$state', '$stateParams', 'moment', '$timeout', 'Alert', '$mdSidenav', 'Auth', 'AdminGeneral',
    function (
        $rootScope,
        $scope,
        $http,
        $cookies,
        $location,
        $state,
        $stateParams,
        moment,
        $timeout,
        Alert,
        $mdSidenav,
        Auth,
        AdminGeneral) {

        $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";

        // $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";


        $scope.socket = io(__SOCKETS__);

        $scope.socket.on('online', onlineCount => {
            $scope.onlineCount = onlineCount;
            $scope.$apply();
        });


        $scope.socket.on('changedScope', () => {
            Auth.logout(() => {
                Alert.error("Your scope has been changed, please relogin...");
            }, (status, message) => {
                Alert.error(message);
            })
        });


        AdminGeneral.getNotifications(message => {
            $scope.usersCount = message.data.users;
            $scope.usersOnline = message.data.online_users;
            $scope.support_tickets = message.data.support_tickets;
        }, (status, message) => {
            Alert.error(message);
        });

        $scope.platformLookup = platformId => $rootScope.platforms[platformId];

        $scope.toggleMenu = () => {
            $mdSidenav('left').toggle()
        };


        $scope.logout = () => {
            Auth.logout(data => {
                Alert.info('Logged out successfully!');
                $state.go('public.login', {}, {reload: 'public.login'});
            }, (err, data) => {
                Alert.error('Failed to log out.');
            });
        };

    }]));

