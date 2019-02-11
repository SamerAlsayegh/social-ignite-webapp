define(['../../module'], controllers => {
    return controllers.controller('pagesController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'SocialAccounts', '$mdDialog', 'moment', '$window', 'Alert',
        function (
            $rootScope,
            $scope,
            $state,
            $stateParams,
            SocialAccounts,
            $mdDialog,
            moment,
            $window,
            Alert
        ) {
            $scope.openTab = 0;
            $scope.setPage('Page Management');

            if ($stateParams.sub != null) {
                if ($stateParams.sub === 'pages')
                    $scope.openTab = 0;
                else if ($stateParams.sub === 'statistics')
                    $scope.openTab = 1;
                else if ($stateParams.sub === 'brands')
                    $scope.openTab = 2;
            }
            console.log($scope.openTab, $stateParams.sub)

            if ($stateParams.fail != null) {
                Alert.error("Failed to register. " + $scope.errorCodes[$stateParams.fail].detail, 4000);
                $state.go($state.current.name, {fail: null}, {reload: true});
            }
            $scope.platformFilter = null;
            $scope.socialPlatformDetails = [];
            $scope.pagesModel = {
                order: null,
                selected: [],
            };

            $scope.past5Minutes = new Date(new Date().getTime() - (1000 * 60 * 5));


            $scope.updatedRecently = itemUpdated => new Date(itemUpdated).getTime() < $scope.past5Minutes.getTime();
            for (let platformKey in $rootScope.platforms) {
                if (parseInt(platformKey) == platformKey) {
                    $scope.socialPlatformDetails.push({
                        id: platformKey,
                        shortname: $rootScope.platforms[platformKey].id,
                        fullname: $rootScope.platforms[platformKey].detail
                    });
                }
            }
            $scope.socket.on('updatedPageStatistics', pageInfo => {
                SocialAccounts.getSocialAccount(pageInfo._id, message => {
                    for (let i = 0; i < $rootScope.allPages.length; i++) {
                        if ($rootScope.allPages[i]._id === pageInfo._id) {
                            $rootScope.allPages[i] = message;
                            break;
                        }
                    }
                }, (status, message) => {
                    Alert.error(message);
                })
            });


            $scope.socialAccounts = {};

            $scope.filteredPlatforms = [];


            $scope.isPlatformFiltered = platform => $scope.filteredPlatforms.indexOf(platform) !== -1;

            $scope.refreshSocialAccount = (_id, $event) => {
                if ($event) $event.stopPropagation();
                SocialAccounts.refreshSocialAccount(_id, 'page_statistics', message => {
                    Alert.success("Successfully queued page for update.");
                }, (status, message) => {
                    Alert.error(message);
                })
            };

            $scope.removeSocialAccount = (_id, $event) => {
                if ($event) $event.stopPropagation();

                SocialAccounts.removeSocialAccount(_id, message => {
                    Alert.success("Successfully deleted social page.");
                    let lookup = {};
                    for (let index in $rootScope.allPages)
                        lookup[$rootScope.allPages[index]._id] = $rootScope.allPages[index];
                    delete $rootScope.allPages.splice($rootScope.allPages.indexOf(lookup[_id]), 1);
                }, (status, message) => {
                    Alert.error(message);
                })
            };

            $scope.loadMoreSocialPages = () => {
                SocialAccounts.getSocialAccounts(($rootScope.allPages.length > 0 ? ($rootScope.allPages[$rootScope.allPages.length - 1]._id) : null), $scope.filteredPlatforms, message => {
                    $rootScope.allPages = $rootScope.allPages.concat(message.pages);
                    $scope.remaining = message.remaining;
                }, (status, message) => {
                    Alert.error(message);
                });
            };


            // $scope.loadMoreSocialPages();


            $scope.togglePlatformFilter = platform => {
                $scope.filteredPlatforms.indexOf(platform) === -1 ? $scope.filteredPlatforms.push(platform) : $scope.filteredPlatforms.splice($scope.filteredPlatforms.indexOf(platform), 1);
                $rootScope.allPages = [];
                $scope.loadMoreSocialPages();
            };

            // $scope.platformFiltered = function () {
            //     $rootScope.allPages = [];
            //     $scope.loadMoreSocialPages($scope.mod);
            // };


        }]);
});

