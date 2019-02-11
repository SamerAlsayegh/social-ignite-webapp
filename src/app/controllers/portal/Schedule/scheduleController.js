define(['../../module'], controllers => {
    return controllers.controller('scheduleController', ['$rootScope', '$scope', '$state', 'SocialPosts', '$q', 'moment', 'Alert', '$mdDialog', "$stateParams",
        function (
            $rootScope,
            $scope,
            $state,
            SocialPosts,
            $q,
            moment,
            Alert,
            $mdDialog,
            $stateParams
        ){
            $scope.setPage('Calendar');

            $scope.scheduledPosts = [];
            $scope.curDate = new Date();
            $scope.defaultTab = 0;

            if ($stateParams.tab != null) {
                if ($stateParams.tab == 'schedule')
                    $scope.defaultTab = 0;
                else if ($stateParams.tab == 'drafts')
                    $scope.defaultTab = 1;
            }


            /**
             * Any module declarations here
             */

            $scope.limit = {
                minDate: new Date(),
                maxDate: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))
            };
            $scope.sortPostedPosts = {
                order: '-post_time',
                page: 1,
                limit: 10
            };
            $scope.sortScheduledPosts = {
                order: '-post_time',
                page: 1,
                limit: 10
            };


            $scope.getActivePosts = params => {
                SocialPosts.getSelectivePosts('active', params, data => {
                    $scope.allActivePosts = data.data;
                }, (status, error) => {
                    $scope.allActivePosts = [];
                    Alert.error("Failed to get all social posts.");
                });
            };

            $scope.getDraftedPosts = params => {
                SocialPosts.getSelectivePosts('draft', params, data => {
                    $scope.allDraftedPosts = data.data;
                }, (status, error) => {
                    $scope.allDraftedPosts = [];
                    Alert.error("Failed to get all social posts.");
                });
            };

            $scope.updateSocialPost = (postId, postDetails) => {
                let postChangeIndex = null;
                for (let postIndex in $scope.allActivePosts) {
                    if ($scope.allActivePosts[postIndex]._id === postId) {
                        postChangeIndex = postIndex;
                        break;
                    }
                }
                if (postChangeIndex != null && postDetails != null) {
                    $scope.allActivePosts[postChangeIndex] = postDetails;
                } else if (postChangeIndex != null) {
                    $scope.allActivePosts.splice(postChangeIndex, 1);
                }
            };


            $scope.$on('alterSocialPost', ($event, postId) => {
                $scope.addPost(postId);
            });

            $scope.$on('statisticsSocialPost', ($event, postId) => {
                $scope.viewStatistics($event, postId);
            });


            $scope.viewStatistics = ($event, postId) => {
                $state.go('portal.statistics.post_list', {postId});
            };


            $scope.platformLookup = platformId => $scope.platforms[platformId].id;
            $scope.startOfDay = $scope.curDate.setHours(0, 0, 0, 0);
            $scope.dayClick = date => {
                if (date >= $scope.startOfDay) {
                    $scope.addPost(null, {date});
                }
                // $state.go('portal.schedule.edit', );
            };

            $scope.getActivePosts();
            $scope.getDraftedPosts();

            $scope.prevMonth = data => {
                let monthEnd = new Date(data.year, data.month, 1, 0, 0, 0, 0).getTime();
                let monthStart = new Date(data.year, data.month - 1, 1, 0, 0, 0, 0).getTime();
                $scope.getActivePosts({start: monthStart, end: monthEnd});
            };

            $scope.nextMonth = data => {
                let monthEnd = new Date(data.year, data.month, 1, 0, 0, 0, 0).getTime();
                let monthStart = new Date(data.year, data.month - 1, 1, 0, 0, 0, 0).getTime();
                $scope.getActivePosts({start: monthStart, end: monthEnd});
            };

            $scope.dayFormat = "d";

            $scope.firstDayOfWeek = 1; // First day of the week, 0 for Sunday, 1 for Monday, etc.
            $scope.setDirection = direction => {
                $scope.direction = direction;
                $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
            };

            $scope.tooltips = true;
        }]);
});

