define(['../../module'], controllers => {
    return controllers.controller('resourcesController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'Image', 'Alert',
        function ($rootScope, $scope, $state, $stateParams, Image, Alert) {
            $scope._ids = [];
            $scope.images = [];
            $scope.postId = $stateParams.postId;
            $scope.postInformation = $stateParams.postInformation;
            $scope.attachedImage = $stateParams.attachedImage;
            $scope.loadingImages = true;

            // $scope.image_ids = [];
            Image.getImages(null, images => {
                $scope.images = images.data.images;
                $scope.remaining = images.data.remaining;
                $scope.loadingImages = false;

            }, (status, message) => {
                Alert.error("Failed to load images");
            });
            $scope.finishedScroll = () => {
                if ($scope.remaining > 0) {
                    $scope.loadMore($scope.images[$scope.images.length - 1]._id)
                }
            };

            $scope.loadMore = cursor => {
                if ($scope.loadingImages === false) {
                    $scope.loadingImages = true;
                    Image.getImages(cursor, images => {
                        $scope.images = $scope.images.concat(images.data.images);
                        $scope.remaining = images.data.remaining;
                        $scope.loadingImages = false;

                    }, (status, message) => {
                        Alert.error("Failed to load images");
                        $scope.loadingImages = false;
                    });
                }
            };


        }]);
});

