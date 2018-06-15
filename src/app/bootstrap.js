// var dankMessages = ["Prettifying UI...", "Bootstrapping servers...", "Preparing extinguishers...", "Adding more sticks...", "Pouring lighter fluid...", "Using coal...", "Adding fuel to the flames..."];
// var num = Math.round(dankMessages.length * Math.random());
// var message = dankMessages[num >= dankMessages.length ? dankMessages.length - 1 : num];
// var loading_screen = pleaseWait({
//     logo: "https://assets.socialignite.media/img/thumbnail/w400/dark_logo.png",
//     backgroundColor: '#FAFAFA',
//     loadingHtml: '<h1 class="dark"><div class="sk-cube-grid"> <div class="sk-cube sk-cube1"></div> <div class="sk-cube sk-cube2"></div> <div class="sk-cube sk-cube3"></div> <div class="sk-cube sk-cube4"></div> <div class="sk-cube sk-cube5"></div> <div class="sk-cube sk-cube6"></div> <div class="sk-cube sk-cube7"></div> <div class="sk-cube sk-cube8"></div> <div class="sk-cube sk-cube9"></div> </div><br>' + message + '</h1>'
// });

require([
    'angular',
    './routes'
], function (angular) {
    'use strict';
    angular.bootstrap(document, ['SocialIgnite']);
    // loading_screen.finish();
});
