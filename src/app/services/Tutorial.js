define(['./module'], function (services) {
    'use strict';
    services.factory('Tutorial', ['$state', '$rootScope',
        function ($state, $rootScope) {


            let enabledTutorial = false;
            let steps = [
                {
                    div: "tutorial-step-pages-menu",
                    description: "Lets add pages."
                },
                // {
                //     div: "tutorial-step-add-pages",
                //     description: "Hover here, and choose a platform to add."
                // },
                {
                    div: "tutorial-step-schedule-menu",
                    description: "Now we schedule your first post."
                },
                {
                    div: "tutorial-step-schedule-add-post",
                    description: "Now we schedule your first post."
                },
                {
                    div: "tutorial-step-schedule-add-post-step-1",
                    description: "Choose the pages you wish to post on."
                },
                {
                    div: "tutorial-step-schedule-add-post-step-2",
                    description: "Type the text content to post."
                },
                {
                    div: "tutorial-step-schedule-add-post-step-3",
                    description: "Add an image by clicking here..."
                },
                {
                    div: "tutorial-step-schedule-add-post-step-4",
                    description: "Choose when to schedule your post."
                }
            ];

            return {
                nextStep: function () {
                    if (enabledTutorial) {
                        var step = steps.shift();
                        $rootScope.activeDiv = step.div;
                        $rootScope.activeDescription = step.description;
                    }
                },
                resetTutorial: function () {

                },
                pauseTutorial: function () {
                    enabledTutorial = false;
                },
                resumeTutorial: function () {
                    enabledTutorial = false;
                },
            };
        }]);
});
