define(['./module'], services => {
    services.factory('SocialStacks', ['Request',
        Request => ({
            addSocialStack(name, socialPages, cbSuccess, cbFail) {
                if (!name)
                    return cbFail(400, "Invalid parameters.");
                return Request.post('portal/social_stacks',
                    {
                        name,
                        social_pages: socialPages
                    }, message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            updateSocialStack(stackId, name, socialPages, cbSuccess, cbFail) {
                if (!stackId || !name)
                    return cbFail(400, "Invalid parameters.");

                return Request.post('portal/social_stacks/' + stackId,
                    {
                        name,
                        social_pages: socialPages
                    },
                    (message, data) => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getSocialStacks(strict, populated, page, cbSuccess, cbFail) {
                let params = {};
                if (strict != null) params.strict = strict;
                if (page != null) params.page = page;
                if (populated != null) params.populated = populated;

                return Request.get('portal/social_stacks' + Request.ArrayToURL(params),
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getSocialStack(_stackId, populated, cbSuccess, cbFail) {
                let params = {};
                if (populated != null) params.populated = populated;

                return Request.get('portal/social_stacks/' + _stackId + Request.ArrayToURL(params),
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            deleteSocialStack(_stackId, cbSuccess, cbFail) {
                if (!_stackId)
                    return cbFail(400, "Invalid parameters.");

                return Request.post('portal/social_stacks/' + _stackId + "/delete", {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
