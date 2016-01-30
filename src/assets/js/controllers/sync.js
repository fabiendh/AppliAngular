(function(angular){
  'use strict';

  angular.module('SyncModule',[])
  .controller('SyncController', function($rootScope, $scope, $http, localStorageService){
    $scope.submitLS = function () {
      var tabLS = localStorageService.get("CheckIn");
      console.log("tabLS" + tabLS);
      console.log("tabLS taille" + tabLS.length);

      for (var i = 0; i < tabLS.length; i++){
        console.log(tabLS[i].lat);
        envoie(tabLS, i);
      }
    };

    function envoie (tabLS, i) {
      $http({
        method: 'POST',
        url: 'http://checkin-api.dev.cap-liberte.com/checkin',
        data: {
          lat: tabLS[i].lat,
          lng: tabLS[i].lng
        },
        headers:{
          'Content-Type':undefined
        }
      }).then(function successCallback(response) {
        console.log("Succes Envoie");
        console.log(response.data);
        $scope.checkinsDetails = response.data;
        $scope.loading = false;
        //localStorageService.remove("CheckIn");
        tabLS.splice(i, 1);
        $rootScope.$broadcast('EnvoiSucces', tabLS);

        // tab splice -> enlever les items qui ont réussi
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log("Erreur Envoie");
        console.log(response);
        $scope.loading = false;
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
      localStorageService.remove("CheckIn");
      $scope.number = 0;
    }

  });

})(window.angular);
