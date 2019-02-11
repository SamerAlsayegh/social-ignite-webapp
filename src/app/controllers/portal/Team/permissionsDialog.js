define(['../../module'], controllers => {
    return controllers.controller('permissionsDialog', [
        '$rootScope', '$scope', '$mdDialog', 'theme', 'member',
        function (
            $rootScope,
            $scope,
            $mdDialog,
            theme,
            member
        ) {
            $scope.theme = theme;
            $scope.member = member;
            $scope.selected = member.account_management.permissions || [];
            $scope.cancel = () => {
                $mdDialog.cancel();
            };


            $scope.possiblePermissions = [
                {
                    title: 'Permissions',
                    permissions: [
                        {name: 'publish_all', description: 'Publishing (posts, images)'},
                        {name: 'moderate_all', description: 'Moderation (like, reply, delete)'},
                        {name: 'statistics_all', description: 'Statistics (pages, posts)'},
                        {name: 'manage_all', description: 'Management (pages, images)'},
                        // {name: 'full_access', description: 'All Access'},
                    ]
                },
            ]

            // $scope.possiblePermissions = [
            //     {
            //         title: 'Publishing',
            //         permissions: [
            //             {name: 'posts_publish', description: 'Schedule Posts'},
            //             {name: 'posts_draft', description: 'Draft Posts'},
            //             {name: 'images_view', description: 'View Images'},
            //             {name: 'images_add', description: 'Add Images'},
            //             {name: 'posts_all_overview', description: 'View All Posts'},
            //             {name: 'posts_single_overview', description: 'View Post Details'},
            //             {name: 'action_suggestions', description: 'View Recommendations'},
            //         ]
            //     },
            //     {
            //         title: 'Moderation',
            //         permissions: [
            //             {name: 'action_comment_reply', description: 'Comment Reply'},
            //             {name: 'action_comment_like', description: 'Comment Like'},
            //             {name: 'action_comment_delete', description: 'Comment Delete'},
            //             {name: 'posts_mentions', description: 'View Mentions'},
            //
            //
            //         ]
            //     },
            //     {
            //         title: 'Statistics',
            //         permissions: [
            //             {name: 'posts_statistics', description: 'View Statistics'},
            //
            //
            //         ]
            //     },
            //     {
            //         title: 'Administration',
            //         permissions: [
            //             {name: 'pages_all_overview', description: 'View All Pages'},
            //             {name: 'pages_single_overview', description: 'View Page Details'},
            //             {name: 'pages_add_facebook', description: 'Add Facebook Pages'},
            //             {name: 'pages_add_instagram', description: 'Add Instagram Pages'},
            //             {name: 'pages_add_twitter', description: 'Add Twitter Pages'},
            //             {name: 'pages_add_linkedin', description: 'Add LinkedIn Pages'},
            //             {name: 'images_delete', description: 'Delete Images'},
            //         ]
            //     }
            // ]
            $scope.toggle = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };
            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };
            $scope.isChecked = function() {
                return $scope.selected.length === $scope.possiblePermissions[0].permissions.length;
            };
            $scope.toggleAll = function() {
                if ($scope.selected.length === $scope.possiblePermissions[0].permissions.length) {
                    $scope.selected = [];
                } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                    $scope.selected = [];

                    angular.forEach($scope.possiblePermissions[0].permissions, function (permission) {
                        $scope.selected.push(permission.name);
                    })
                }
            };

            $scope.submitPermissions = function () {
                $mdDialog.hide($scope.selected);
            }


        }]);
});

