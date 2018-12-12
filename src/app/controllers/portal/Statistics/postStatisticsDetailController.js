define(['../../module'], controllers => {
    return controllers.controller('postStatisticsDetailController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state) {
            $scope.postId = $stateParams.postId;
            $scope.socialPostId = $stateParams.socialPostId;

            $scope.socialPost = null;
            $scope.openStat = null;
            $scope.supportedStatistics = ['overview'];

            $scope.loadNewState = newVar => {
                if ($scope.socialPost != null) {
                    switch (newVar) {
                        case 'likes':
                            $scope.loadLikes();
                            break;
                        case 'visitors':
                            $scope.loadVisitors();
                            break;
                        default:
                            $scope.loadLikes();
                            break;
                    }
                }
            };

            $scope.$watch('openStat', (newVar, oldVar) => {
                if (newVar != null) {
                    $scope.loadNewState(newVar);
                }
            }, true);


            $scope.loadVisitors = () => {
                if (!$scope.chartObjectVisitors) {
                    $scope.chartElementVisitors = document.getElementById("visitorsChart").getContext('2d');
                    $scope.chartObjectVisitors = new Chart($scope.chartElementVisitors, Statistics.getStatisticsConfig("Post Statistics", "Time", "Value"));
                }
                Statistics.getPostStatistics($scope.socialPost._id, ["views.total"], data => {

                    $scope.chartObjectVisitors.data.datasets = [
                        {
                            label: 'Visitors (Total)',
                            borderColor: "rgba(63,169,245, 0.7)",
                            backgroundColor: "rgba(63,169,245, 0.5)",
                            fill: true,
                            datalabels: {
                                display: false,
                            },
                            lineTension: 0.3,
                            data,
                        },
                    ];
                    $scope.chartObjectVisitors.update();
                }, (status, message, rawMessage) => {
                    Alert.error(message);

                });
            };

            $scope.loadLikes = () => {

                if (!$scope.chartObjectLikes) {
                    $scope.chartElementLikes = document.getElementById("likesChart").getContext('2d');
                    $scope.chartObjectLikes = new Chart($scope.chartElementLikes, Statistics.getStatisticsConfig("Post Statistics", "Time", "Value"));
                }

                Statistics.getPostStatistics($scope.socialPost._id, ["likes.total"], data => {
                    $scope.chartObjectLikes.data.datasets = [
                        {
                            label: 'Likes (Total)',
                            borderColor: "rgba(63,169,245, 0.7)",
                            backgroundColor: "rgba(63,169,245, 0.5)",
                            fill: true,
                            datalabels: {
                                display: false,
                            },
                            lineTension: 0.3,
                            data,
                        }
                    ];

                    $scope.chartObjectLikes.update();
                }, (status, message, rawMessage) => {
                    Alert.error(message);
                });
            };

            SocialPosts.getDetails($scope.postId, message => {
                $scope.socialPostMain = message;
                SocialPosts.getSocialPost($scope.postId, $scope.socialPostId, message => {
                    $scope.socialPost = message;
                    if ($scope.socialPost.statistic.likes != null && $scope.socialPost.statistic.likes.total != null)
                        $scope.supportedStatistics.push("likes.total");
                    if ($scope.socialPost.statistic.likes != null && $scope.socialPost.statistic.likes.new != null)
                        $scope.supportedStatistics.push("likes.new");
                    if ($scope.socialPost.statistic.views != null && $scope.socialPost.statistic.views.total != null)
                        $scope.supportedStatistics.push("views.total");
                    $scope.loadNewState('overview');
                }, (status, message) => {
                    Alert.error(message);
                });
            }, (status, message) => {
                Alert.error(message);
            });


            $scope.deletePost = socialPostId => {
                SocialPosts.deletePostedSocialPost(socialPostId, success => {
                    Alert.success("Deleted social post on " + $scope.socialPost.page_id.name);
                }, (status, message) => {
                    Alert.error(message);
                })
            };


            $scope.return = () => {
                $state.go('portal.statistics.post_list', {postId: $scope.postId, redirect: false})
            };


        }]);
});

