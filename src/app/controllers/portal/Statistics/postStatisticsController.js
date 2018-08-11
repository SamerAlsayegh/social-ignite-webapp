define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('postStatisticsController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state) {
            $scope.postId = $stateParams.postId;
            $scope.socialPages = [];

            SocialPosts.getSocialPosts($scope.postId, null, function(socialPosts){
                socialPosts.social_posts.forEach(function (socialpost) {
                    socialpost.page_id.social_post = socialpost._id;
                    $scope.socialPages.push(socialpost.page_id)
                })
                if ($scope.socialPages.length == 1 && $stateParams.redirect != false){
                    $state.go('portal.statistics.post_detail', {postId: $scope.postId, socialPostId: $scope.socialPages[0].social_post})
                }
            }, function (status, message) {
                Alert.error(message);
            });

            $scope.return = function () {
                $state.go('portal.schedule.table')
            };


        }]);
});

