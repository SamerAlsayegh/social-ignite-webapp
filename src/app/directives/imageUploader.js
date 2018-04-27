define(['./module'], function (directives) {
    'use strict';
    directives.directive("imageUploader", ['$http', '$injector','Request', 'Alert', 'Image', '$state', function($http, $injector, Request, Alert, Image, $state) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                images: "=",
                uploading: "=",
                postId: "=",
                attachedImage: "=",
                postInformation: "=",
                control: "@",
            },
            templateUrl: '/pub/portal/resources/_imageUploader.html',
            link: function($scope, element, attrs) {
                $scope.uploading = false;
                $scope.isOpen = false;
                $scope.control = $scope.control.toLowerCase() || 'view';


                $scope.$watch('images', function (newVal, oldVal) {
                    // $scope.image_ids = [];
                    // angular.forEach(newVal, function (image) {
                    //     $scope.imageIds.push(image._id);
                    // });
                    $scope.images = newVal;
                });



                $scope.openSelectorForPost = function () {
                    if ($scope.control == 'view' && ($scope.postId || $scope.postInformation)) {
                        Alert.success("You opened selector" + $scope.postId)
                        $state.go('portal.resources.view', {'postId': $scope.postId, 'attachedImage': $scope.attachedImage, 'postInformation': $scope.postInformation});
                    }
                };

                $scope.deleteImage = function (image) {
                    if ($scope.control == 'manage') {
                        Image.deleteImage(image._id, function (data) {
                            Alert.success('Successfully deleted image.');
                        }, function (status, message) {
                            Alert.error('Failed to delete image.');
                        });
                    }
                    $scope.images.splice($scope.images.indexOf(image), 1);
                    // $scope.imageIds.splice($scope.imageIds.indexOf(image._id), 1);
                };


                $scope.favouriteImage = function (image) {
                    image.favourite = !image.favourite;
                    Image.modifyImage(image._id, {favourite: image.favourite}, function (data) {
                        Alert.success('Successfully favourite image.');
                    }, function (status, message) {
                        Alert.error('Failed to favourite image.');
                    });
                };

                $scope.useImage = function (image) {
                    $state.go('portal.schedule.edit', {'postId': $scope.postId, 'attachedImage': image._id, 'postInformation': $scope.postInformation});
                };

                $scope.uploadImages = function (imagesList, callback) {
                    var image = imagesList.shift();
                    if (image != null) {

                        $scope.images.unshift({loading: true, progress: 0});

                        Image.addImage({image: image}, function (data) {
                            Alert.success('Successfully uploaded image.', 1000);
                            $scope.images[0].loading = false;
                            delete $scope.images[0].progress;
                            $scope.uploadImages(imagesList, callback);
                            $scope.images[0] = (data);
                            // $scope.imageIds.unshift(data._id);
                        }, function (status, message) {
                            Alert.error('Failed to upload image.');
                            $scope.uploadImages(imagesList, callback);
                        }, function (loaded, total) {
                            $scope.images[0].progress = (loaded / total) * 100;
                        });
                    } else {
                        callback();
                    }
                };
                $scope.uploadFiles = function (imagesList) {
                    $scope.uploading = true;
                    $scope.uploadImages(imagesList, function () {
                        $scope.uploading = false;
                        Alert.success('Uploaded all images.', 1000);
                    })
                };


            }
        };
    }]);
});