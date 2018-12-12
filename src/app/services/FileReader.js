define(['./module'], services => {
    services.factory('FileReader', ['$q', '$log', 'Alert',
        ($q, $log, Alert) => {

            let onLoad = (reader, deferred, scope) => () => {
                scope.$apply(() => {
                    deferred.resolve(reader.result);
                });
            };

            let onError = (reader, deferred, scope) => () => {
                deferred.resolve(null);
                Alert.error("Failed to render image.");
            };

            let getReader = (deferred, scope) => {
                let reader = new FileReader();
                reader.onerror = onError(reader, deferred, scope);
                reader.onload = onLoad(reader, deferred, scope);
                // reader.onloadstart = function(){
                //     Alert.info("Rendering image, please wait...");
                // };
                return reader;
            };

            let readAsDataURL = (file, scope) => {
                let deferred = $q.defer();

                let reader = getReader(deferred, scope);
                reader.readAsDataURL(file);

                return deferred.promise;
            };

            return {
                readAsDataUrl: readAsDataURL
            };
        }]);
});
