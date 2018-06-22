define(['./module'], function (services) {
    'use strict';
    services.factory('SocialStacks', ['Request',
        function (Request) {


            return {
                addSocialStack: function (name, description, socialPages, cbSuccess, cbFail) {
                    if (!name || !description)
                        return cbFail(400, "Invalid parameters.");
                    return Request.post('portal/social_stacks',
                        {
                            name: name,
                            description: description,
                            social_pages: socialPages
                        }, function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                updateSocialStack: function (stackId, name, description, socialPages, cbSuccess, cbFail) {
                    if (!stackId || !name || !description)
                        return cbFail(400, "Invalid parameters.");

                    return Request.post('portal/social_stacks/' + stackId,
                        {
                            name: name,
                            description: description,
                            social_pages: socialPages
                        },
                        function (message, data) {
                            return cbSuccess(data.pages);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSocialStacks: function (strict, populated, page, cbSuccess, cbFail) {
                    var params = {};
                    if (strict != null) params.strict = strict;
                    if (page != null) params.page = page;
                    if (populated != null) params.populated = populated;

                    return Request.get('portal/social_stacks' + Request.ArrayToURL(params),
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSocialStack: function (_stackId, populated, cbSuccess, cbFail) {
                    var params = {};
                    if (populated != null) params.populated = populated;

                    return Request.get('portal/social_stacks/' + _stackId + Request.ArrayToURL(params),
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                deleteSocialStack: function (_stackId, cbSuccess, cbFail) {
                    if (!_stackId)
                        return cbFail(400, "Invalid parameters.");

                    return Request.post('portal/social_stacks/' + _stackId + "/delete", {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                }
            };
        }]);
});
