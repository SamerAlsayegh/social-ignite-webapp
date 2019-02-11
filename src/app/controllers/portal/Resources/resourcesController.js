define(['../../module'], controllers => {
    return controllers.controller('resourcesController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'Image', 'Alert',
        function ($rootScope, $scope, $state, $stateParams, Image, Alert) {
            $scope.setPage('Image Gallery');

            $scope.filter = {};
            $scope._ids = [];
            $scope.images = [];
            $scope.postId = $stateParams.postId;
            $scope.postInformation = $stateParams.postInformation;
            $scope.attachedImage = $stateParams.attachedImage;
            $scope.loadingImages = false;
            $scope.remaining = 0;

            $scope.finishedScroll = () => {
                if ($scope.remaining > 0) {
                    $scope.loadMore($scope.filter, $scope.images[$scope.images.length - 1]._id)
                }
            };


            // $scope.applyFilter = (filterName, filterValue) => {
            //     console.log("$ok", filterValue, filterName)
            //     $scope.filter[filterName] = filterValue;
            // }
            $scope.loadMore = (filter, cursor) => {
                if (cursor == null) $scope.images = [];

                if ($scope.loadingImages === false) {
                    $scope.loadingImages = true;
                    Image.getImages(filter, cursor, images => {
                        $scope.images = $scope.images.concat(images.data.images);
                        $scope.remaining = images.data.remaining;
                        $scope.loadingImages = false;
                        if (cursor == null && $scope.remaining > 0) {
                            $scope.loadMore(filter, $scope.images[$scope.images.length - 1]._id)
                        }
                    }, (status, message) => {
                        Alert.error(message);
                        $scope.loadingImages = false;
                    });
                }
            };
            $scope.loadMore($scope.filter);



        }]);
});

