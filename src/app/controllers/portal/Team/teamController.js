define(['../../module'], controllers => {
    return controllers.controller('teamController', ['$rootScope', '$scope', 'Alert', 'Team', '$mdDialog',
        function ($rootScope, $scope, Alert, Team, $mdDialog) {
            $scope.setPage('Team Management');
            $scope.teamModel = {
                order: null,
                selected: [],
            };


            $scope.team = [];

            Team.getMembers((data)=>{
                $scope.team = data.data;
                console.log(data);
            }, (status, message)=>{
                Alert.error("Failed to fetch members");
            });



            $scope.addMember = member => {
                if (member.$valid) {
                    $scope.memberLoading = true;
                    // Backup code that was previouslky coded but technically not needed.
                    let email = $scope.memberEmail;

                    Team.addMember({
                        email,
                    }, data => {
                        $scope.memberEmail = null;
                        $scope.memberLoading = false;
                    }, (status, message) => {
                        $scope.memberLoading = false;
                        Alert.error(message);
                    });
                }
            };

            $scope.loadPermissionsEditor = member => {
                // Load a popup with check options

                $mdDialog.show({
                    locals: {
                        theme: $scope.theme,
                        member: member
                    },
                    template: require("compile-ejs-loader!../../../views/_portal/team/_permissionsDialog.ejs")(),
                    controller: 'permissionsDialog',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                    .then(selectedPermissions => {
                        console.log(selectedPermissions);
                        Team.applyPermissions(member._id, selectedPermissions, (data) => {
                            Alert.success("Applied permissions successfully.");
                            // Update member with new permissions

                        }, (status, message)=>{
                            return Alert.error("Failed to apply permissions.");
                        })
                    }, () => {
                        return Alert.error("Cancelled permissions.");
                    });

            };

        }]);
});

