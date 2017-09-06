//declare module
var indexApp = angular.module('indexApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'zingchart-angularjs']);

//declare controller
indexApp.controller('aboutUsController', function ($scope) {
    // Set of userPhotos
    $scope.userPhotos = [
        {
            src: './CSS/images/Fondatori/Ls.png',
            title: 'Lorenzo Stacchio',
        },
        {
            src: './CSS/images/Fondatori/Ml.png',
            title: 'Matteo Lupini',
        },
        {
            src: './CSS/images/Fondatori/Lm.png',
            title: 'Luca Marasca',
        },
        {
            src: './CSS/images/Fondatori/Nr.png',
            title: 'Nicolò Ruggeri',
        }
    ];
    //INDEX
    $scope.indexPhoto = 0;
    //length of array photo
    $scope.lenghtOfArray = $scope.userPhotos.length;
    //PRESENT PHOTO
    $scope.presentPhoto = $scope.userPhotos[$scope.indexPhoto];
    //tile of photo gallery
    $scope.message = "About us";
    //next photo function
    $scope.nextPhotoFunction = function () {
        //if true, i'm at the last photo
        if ($scope.indexPhoto === $scope.userPhotos.length - 1) {
            $scope.nextPhotoDisabled = true;
        }
        else {
            $scope.nextPhotoDisabled = false;
            $scope.previousPhotoDisabled = false;
            $scope.indexPhoto++;
            $scope.presentPhoto = $scope.userPhotos[$scope.indexPhoto];
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
            $scope.presentPhoto = $scope.userPhotos[$scope.indexPhoto];
        }
    };
});