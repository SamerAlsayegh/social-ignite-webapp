define(['./module'], directives => {
    directives.directive("imageUploader", ['$http', '$injector', 'Request', 'Alert', 'Image', '$state', '$mdDialog', '$rootScope', '$filter', ($http, $injector, Request, Alert, Image, $state, $mdDialog, $rootScope, $filter) => ({
        restrict: 'E',
        replace: false,

        scope: {
            images: "=",
            uploading: "=",
            postId: "=",
            attachedImage: "=",
            postInformation: "=",
            control: "@",
            loadMore: "=",
            filter: "=?"
        },

        template: require("compile-ejs-loader!views/_portal/resources/_imageUploader.ejs")(),

        link($scope, element, attrs) {
            $scope.imageEditing = null;
            $scope.uploading = false;
            $scope.isOpen = false;
            $scope.control = $scope.control.toLowerCase() || 'view';

            $scope.$watch('images', (newVal, oldVal) => {
                $scope.images = newVal;
            });


            $scope.openSelectorForPost = () => {
                if ($scope.control === 'view' && ($scope.postId || $scope.postInformation)) {
                    $state.go('portal.resources.view', {
                        'postId': $scope.postId,
                        'attachedImage': $scope.attachedImage,
                        'postInformation': $scope.postInformation
                    });
                }
            };

            $scope.deleteImage = image => {
                if ($scope.control === 'manage' || $scope.control === 'manage2') {
                    image.hide = true;
                    Image.deleteImage(image._id, data => {
                        $scope.images.splice($scope.images.indexOf(image), 1);
                        // Alert.success('Successfully deleted image.');
                    }, (status, message) => {
                        image.hide = false;
                        Alert.error('Failed to delete image.');
                    });
                }
                else {
                    $scope.images.splice($scope.images.indexOf(image), 1);
                }
                // $scope.imageIds.splice($scope.imageIds.indexOf(image._id), 1);
            };


            $scope.favouriteImage = image => {
                console.log($scope.filter)
                image.favourite = !image.favourite;
                Image.modifyImage(image._id, {favourite: image.favourite}, data => {

                }, (status, message) => {
                    Alert.error('Failed to favourite image.');
                });
            };

            $scope.useImage = image => {
                // $mdDialog.show({
                //     locals: {'postId': null, 'postInformation': {attachedImages: [image._id]}, 'theme': $scope.$parent.theme, 'socket': $scope.$parent.socket},
                //     controller: 'editControllerDialog',
                //     template: require("compile-ejs-loader!views/_portal/schedule/_scheduleDialog.ejs")(),
                //     parent: angular.element(document.body),
                //     clickOutsideToClose: true,
                //     fullscreen: true // Only for -xs, -sm breakpoints.
                // })
                //     .then(function (message) {
                //
                //     }, function () {
                //
                //     });
                $rootScope.addPost(null, {attachedImages: [image._id]})
            };

            $scope.uploadImages = (imagesList, callback) => {
                let image = imagesList.shift();
                if (image != null) {

                    $scope.images.unshift({loading: true, progress: 0});

                    Image.addImage({image}, data => {
                        $scope.images[0].loading = false;
                        delete $scope.images[0].progress;
                        $scope.uploadImages(imagesList, callback);
                        $scope.images[0] = (data);
                        // $scope.imageIds.unshift(data._id);
                    }, (status, message) => {
                        Alert.error('Failed to upload image.');
                        $scope.uploadImages(imagesList, callback);
                    }, (loaded, total) => {
                        $scope.images[0].progress = (loaded / total) * 100;
                    });
                } else {
                    callback();
                }
            };
            $scope.uploadFiles = imagesList => {
                if (imagesList.length > 0) {
                    $scope.uploading = true;
                    $scope.uploadImages(imagesList, () => {
                        $scope.uploading = false;
                        Alert.success('Uploaded all images.', 1000);
                    })
                }
            };

            // $scope.$watch('filter', (newVal, oldVal) => {
            //     // $scope.image_ids = [];
            //     // angular.forEach(newVal, function (image) {
            //     //     $scope.imageIds.push(image._id);
            //     // });
            //     console.log("222Filte")
            // });



            $scope.$watch("filter", function(filter) {
                //inject $filter service in your main controller
                $scope.filter = filter;
                if ($scope.filter.used == true)
                    delete $scope.filter.used;

                $scope.loadMore(filter);
            }, true);


            var pixie = new Pixie({
                // watermarkText: 'SocialIgnite',
                crossOrigin: true,
                ui: {
                    theme: $rootScope.theme || 'light',
                    mode: 'overlay',
                    openImageDialog: false,
                    allowEditorClose: true,
                    allowZoom: true,
                    nav: {
                        position: 'top',
                    },
                    toolbar: {
                        hideOpenButton: true,
                    },
                },
                tools: {
                    crop: {
                        replaceDefault: true,
                        hideCustomControls: false,
                        items: ['1:1', '3:2', '4:3', '16:9']
                    },
                    export: {
                        defaultFormat: 'png', //png, jpeg or json
                        defaultName: 'image', //default name for downloaded photo file
                        defaultQuality: 0.8, //works with jpeg only, 0 to 1
                    }
                },
                onSave: function(data, name) {
                    console.log($scope.imageEditing);
                    // Upload file to backend, trying to replace the original?
                    if ($scope.imageEditing  == null) {
                        Alert.error("Must choose an image to edit");
                    } else {
                        $scope.images.unshift({loading: true, progress: 0});
                        Image.addImage({data, original: $scope.imageEditing._id}, data => {
                            // Soon add modifying old pic...
                            $scope.images[0].loading = false;
                            delete $scope.images[0].progress;
                            $scope.images[0] = (data);
                            // $scope.imageIds.unshift(data._id);
                        }, (status, message) => {
                            Alert.error('Failed to upload image.');
                        }, (loaded, total) => {
                            $scope.images[0].progress = (loaded / total) * 100;
                        });
                    }
                },
                onLoad: function() {
                    console.log('Pixie is ready');
                }
            });



            $scope.editImage = image => {
                // $http({
                //     method: 'GET',
                //     url: (image.url.replace("300x300/", "")),
                //     timeout: 10000,
                // }).then(data => {
                    pixie.openEditorWithImage((image.url.replace("300x300/", "")));
                    $scope.imageEditing = image;
                // }, data => {
                //
                //
                // });



            }



        }
    })]);
});