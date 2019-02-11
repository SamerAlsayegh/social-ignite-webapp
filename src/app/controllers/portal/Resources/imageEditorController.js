define(['../../module'], controllers => {
    return controllers.controller('imageEditorController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'Image', 'Alert',
        function ($rootScope, $scope, $state, $stateParams, Image, Alert) {
            $scope.setPage('Image Editor');
            $scope.imageId = $stateParams.img;

            var pixie = new Pixie({
                watermarkText: 'SocialIgnite',
                image: image.url,
                ui: {
                    theme: $scope.theme  || 'light',
                    mode: 'overlay',
                    openImageDialog: {
                        show: false,
                    },
                    allowEditorClose: true,
                    allowZoom: true,
                    nav: {
                        position: 'top',
                    },
                },
                tools: {
                    crop: {
                        replaceDefault: true,
                        hideCustomControls: false,
                        items: ['1:1', '3:2', '4:3', '16:9']
                    },
                },
                onSave: function(data, name) {
                    // Upload file to backend, trying to replace the original?



                },
                onLoad: function() {
                    console.log('Pixie is ready');
                }
            });



            Image.getDetails($scope.imageId, (data)=>{


            }, (status, message)=>{
                Alert.error(message);
            })



        }]);
});

