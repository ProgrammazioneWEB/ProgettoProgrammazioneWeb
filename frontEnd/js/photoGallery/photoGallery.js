var indexApp = angular.module('indexApp', ['ngAnimate', 'ngTouch']);

// create the controller and inject Angular's $scope
indexApp.controller('photoGalleryController', function ($scope) {
    // Set of Photos
    $scope.photos = [
      {
        src: './CSS/images/camerino.jpg',
        title: 'Centro di Camerino',
      },
      {
        src: './CSS/images/fotoPolo.png',
        title: 'Università di Camerino',
      },
      {
        src: './CSS/images/roccaCamerino.jpg',
        title: 'La Rocca di Camerino',
      }
    ];
    //INDEX
    $scope.indexPhoto = 0;
    //length of array photo
    $scope.lenghtOfArray = $scope.photos.length;
    //PRESENT PHOTO
    $scope.presentPhoto = $scope.photos[$scope.indexPhoto];
    //tile of photo gallery
    $scope.message = "Photo gallery";
    //next photo function
    $scope.nextPhotoFunction = function () {
      //if true, i'm at the last photo
      if ($scope.indexPhoto === $scope.photos.length - 1) {
        $scope.nextPhotoDisabled = true;
      }
      else {
        $scope.nextPhotoDisabled = false;
        $scope.previousPhotoDisabled = false;
        $scope.indexPhoto++;
        $scope.presentPhoto = $scope.photos[$scope.indexPhoto];
      }
    };
    //previous photo function
    $scope.previousPhotoFunction = function () {
      //if true, i'm at the first photo
      if ($scope.indexPhoto === 0) {
        $scope.previousPhotoDisabled = true;
      }
      else {
        $scope.previousPhotoDisabled = false;
        $scope.nextPhotoDisabled = false;
        $scope.indexPhoto--;
        $scope.presentPhoto = $scope.photos[$scope.indexPhoto];
      }
    };
  });


