define(['./module'], function (services) {
    'use strict';
    services.factory('FileReader', ['$q', '$log', 'Alert',
        function ($q, $log, Alert) {

            var onLoad = function(reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.resolve(reader.result);
                    });
                };
            };

            var onError = function(reader, deferred, scope) {
                return function () {
                    deferred.resolve(null);
                    Alert.error("Failed to render image.");
                };
            };

            var getReader = function(deferred, scope) {
                var reader = new FileReader();
                reader.onerror = onError(reader, deferred, scope);
                reader.onload = onLoad(reader, deferred, scope);
                // reader.onloadstart = function(){
                //     Alert.info("Rendering image, please wait...");
                // };
                return reader;
            };

            var readAsDataURL = function (file, scope) {
                var deferred = $q.defer();

                var reader = getReader(deferred, scope);
                reader.readAsDataURL(file);

                return deferred.promise;
            };

            return {
                readAsDataUrl: readAsDataURL
            };
    }]);
});
