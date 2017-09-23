
//user movements controller
angular.module('indexUserApp').controller('userAverageController', function ($scope) {
    //take the date of creatione of the count
    this.dateOfCreation = new Date(userProfile.dataCreazioneConto);
    //take the current day
    this.currentDay = Date.now();
    //differences between the two dates
    this.numberOfDays = this.currentDay - this.dateOfCreation.getDate();
    //take the sum of the passive
    this.sumOfPassive = 0;
    //define a function into the for each called on the movement's array to find the average of the spent
    //of the user for every day
    userProfile.movimenti.forEach(function (movimento) {
        this.sumOfPassive += Number(movimento.spesa);
    }, this);
    //return the sum divided by the total of the days with some activity
    this.average = Math.round(this.sumOfPassive / this.numberOfDays).toFixed(2);
    $scope.message = "La tua spesa giornaliera media è di: " + this.average;
});