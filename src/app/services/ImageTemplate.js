define(['./module'], services => {
    services.factory('Image', ['Request',
        Request => {
            return {
                getDetails(imageId, cbSuccess, cbFail) {
                    if (!imageId)
                        return cbFail(400, 'Missing image id');

                    return Request.get('portal/image/' + imageId,
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
                getImages(filter, pagination, cbSuccess, cbFail) {
                    return Request.get('portal/image/', Object.assign(pagination ? {pagination: pagination} : {}, filter || {}),
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
                addImage(parameters, cbSuccess, cbFail, cbProgress) {
                    if (!parameters)
                        return;

                    return Request.formPost('portal/image/', parameters,
                        message => cbSuccess(message), (status, message) => cbFail(status, message), (loaded, total) => cbProgress(loaded, total));
                },
                modifyImage(imageId, parameters, cbSuccess, cbFail) {
                    if (!imageId)
                        return cbFail(400, 'Missing image id');
                    else if (!parameters)
                        return cbFail(400, 'Missing parameters');

                    return Request.post('portal/image/' + imageId, parameters,
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
                deleteImage(imageId, cbSuccess, cbFail) {
                    if (!imageId)
                        return cbFail(400, 'Missing image id');

                    return Request.post('portal/image/' + imageId + '/delete', {},
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
            };
        }]);
});
