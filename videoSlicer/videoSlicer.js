
(function () {
  'use strict';

  angular.module('videoSlicer', [
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay"
  ]);

  angular.module('videoSlicer').directive('videoSlicer',
    function () {
      return {
        restrict: 'AE',
        replace: true,
        scope: {
          videoUrl: '=',
          videoStartTime: '=',
          videoEndTime: '='
        },
        bindToController: true,
        controller: [
          '$sce',
          '$scope',
          '$log',
          function($sce, $scope, $log) {

            var debug = false;
            var vm = this;

            vm.sources = [
              {src: $sce.trustAsResourceUrl(vm.videoUrl), type: "video/" + getType(vm.videoUrl)}
            ];

            vm.virtualDuration = 0;

            // Recalculate video slice
            $scope.$watch(function(){return vm.videoStartTime}, function() {

              if (parseInt(vm.videoEndTime) <= parseInt(vm.videoStartTime) || isNaN(parseInt(vm.videoEndTime)) || isNaN(parseInt(vm.videoStartTime))) {
                vm.virtualDuration = -1;
                $log.error('Incorrect start/end time. Original video stats set.');
              }
              else {
                vm.virtualDuration = parseInt(vm.videoEndTime) - parseInt(vm.videoStartTime);
              }

              if(debug) {
                $log.log('start: ' + vm.videoStartTime + '; duration: ' + vm.virtualDuration + ';');
              }
            });

            // Recalculate video slice
            $scope.$watch(function(){return vm.videoEndTime}, function() {

              if (parseInt(vm.videoEndTime) <= parseInt(vm.videoStartTime) || isNaN(parseInt(vm.videoEndTime)) || isNaN(parseInt(vm.videoStartTime))) {
                vm.virtualDuration = -1;
                $log.error('Incorrect start/end time. Original video stats set.');
              }
              else {
                vm.virtualDuration = parseInt(vm.videoEndTime) - parseInt(vm.videoStartTime);
              }

              if(debug) {
                $log.log('end: ' + vm.videoEndTime + '; duration: ' + vm.virtualDuration + ';');
              }

            });

            $scope.$watch(function(){return vm.videoUrl}, function() {
              vm.sources[0].src = $sce.trustAsResourceUrl(vm.videoUrl);
              vm.sources[0].type = "video/" + getType(vm.videoUrl);
              if(debug) {
                $log.log('video url: ' + vm.videoUrl + '; type: ' + getType(vm.videoUrl) + ';');
              }
            });

            //
            // Function declaration
            //

            function getType(url) {
              if (!angular.isString(url)) {
                return 'mp4'; // most popular default type
              }

              var fileExtensionPatter = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/;
              return url.match(fileExtensionPatter)[0].slice(1);
            }
          }
        ],
        controllerAs: 'slicerVm',
        template: [
          '<div class="video-slicer-container">',
            '<videogular vg-start-time="slicerVm.videoStartTime" vg-virtual-clip-duration="slicerVm.virtualDuration">',
              '<vg-media vg-src="slicerVm.sources" vg-type="video">',
              '</vg-media>',
              '<vg-controls>',
                '<vg-play-pause-button></vg-play-pause-button>',
                '<vg-time-display>{{ currentTime | date:"mm:ss" }}</vg-time-display>',
                '<vg-scrub-bar>',
                '<vg-scrub-bar-current-time></vg-scrub-bar-current-time>',
                '</vg-scrub-bar>',
                '<vg-time-display>{{ totalTime | date:"mm:ss" }}</vg-time-display>',
                '<vg-volume>',
                  '<vg-mute-button></vg-mute-button>',
                  '<vg-volume-bar></vg-volume-bar>',
                '</vg-volume>',
                '<vg-fullscreen-button></vg-fullscreen-button>',
              '</vg-controls>',
              '<vg-overlay-play></vg-overlay-play>',
            '</videogular >',
          '</div>'
        ].join('')
      }
    })
})();

