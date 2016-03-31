(function(angular){
  'use strict';

  angular.module('CheckinModule',[])
  .controller('CheckinController', function($scope, $http){

    var getCheckInList = function(){
      // Simple GET request example:
      $http({
        method: 'GET',
        url: 'http://checkin-api.dev.cap-liberte.com/checkin'
      }).then(function successCallback(response) {

        $scope.checkins = response.data;
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {

        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    };

    getCheckInList();

    $scope.$on('EnvoiSucces', function () {

      getCheckInList();
    });

  })

  .controller('CheckinDetailsController', function($routeParams, $scope, $http){
    var cities;

    // Simple GET request example:
    $http({
      method: 'GET',
      url: 'http://checkin-api.dev.cap-liberte.com/checkin/'+$routeParams.checkinId
    }).then(function successCallback(response) {
      $scope.checkinsDetails = response.data;
      getMeteo();

      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });


    // Simple GET request example:
    var getMeteo=function(){
      $http({
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather?lat='+$scope.checkinsDetails.lat+'&lon='+$scope.checkinsDetails.lng+'&appid=c68e847fbb4213fb36c3bfb29a4a9b02&lang=fr'
      }).then(function successCallback(response) {
        $scope.openweather = response.data;
        $scope.openweather.main.temp_min=  Math.round($scope.openweather.main.temp_min - 273);
        $scope.openweather.main.temp_max=  Math.round($scope.openweather.main.temp_max - 273);
        $scope.openweather.main.temp=  Math.round($scope.openweather.main.temp - 273);
        getMaps();
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
    };

    var getMaps=function(){
      var latLng = new google.maps.LatLng($scope.checkinsDetails.lat, $scope.checkinsDetails.lng); // Correspond au coordonnées de Lille
      var myOptions = {
        zoom      : 14, // Zoom par défaut
        center    : latLng, // Coordonnées de départ de la carte de type latLng
        mapTypeId : google.maps.MapTypeId.ROADMAP, // Type de carte, différentes valeurs possible HYBRID, ROADMAP, SATELLITE, TERRAIN
        maxZoom   : 20
      };

      $scope.map = new google.maps.Map(document.getElementById('map'), myOptions);
      $scope.panel    = document.getElementById('panel');
      var marker = new google.maps.Marker({
        position : latLng,
        map      : $scope.map,
        title    : 'Position de '+$scope.checkinsDetails.user.name
      });

      var contentMarker = [
            '<div id="containerTabs">',
            '<div id="tabs">',
            '<h1>'+$scope.openweather.name+', '+$scope.openweather.sys.country+'</h1>',
            '<div id="tab-1">',
              '<h3>Position de '+$scope.checkinsDetails.user.name+'</h3><p> Latitude: '+$scope.checkinsDetails.lat+' Longitude: '+$scope.checkinsDetails.lng+'</p>',
            '</div>',
            '<div id="tab-2">',
            '<h3>Meteo</h3>',
            '<p> Temps: '+$scope.openweather.weather[0].description+'</p>',
            '<p> Temperature: '+$scope.openweather.main.temp+'°C</p>',
            '</div>',
            '</div>',
            '</div>'
        ].join('');

        var infoWindow = new google.maps.InfoWindow({
          content  : contentMarker,
          position : latLng
        });

        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open($scope.map,marker);
        });

        google.maps.event.addListener(infoWindow, 'domready', function(){ // infoWindow est biensûr notre info-bulle
          jQuery("#tabs").tabs();
        });

      $scope.direction = new google.maps.DirectionsRenderer({
        map   : $scope.map,
        draggable : true,
        panel : $scope.panel // Dom element pour afficher les instructions d'itinéraire
      });
    };

    $scope.submitMaps = function(){

      $scope.origin      = new google.maps.LatLng($scope.checkinsDetails.lat, $scope.checkinsDetails.lng);  // Le point départ
      $scope.destination = $scope.destination; // Le point d'arrivé
      if($scope.origin && $scope.destination){

          var request = {
              origin      : $scope.origin,
              destination : $scope.destination,
              travelMode  : google.maps.DirectionsTravelMode.DRIVING // Mode de conduite
          };

          var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
          directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
              if(status == google.maps.DirectionsStatus.OK){
                  //directionsDisplay.setMap($scope.map);
                  $scope.direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
              }
          });
      }
    };

  })

  .controller('CheckinFormController', function($rootScope, $scope, $http, localStorageService){
    $scope.loading = false;
    $scope.number = 0;
    var CheckinFormController= this;
    $scope.geolocationIsSupported= false;

    $scope.getLocation=function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.falsePosition);
      } else {
      }
    };

    $scope.showPosition=function(position){
      $scope.geolocationIsSupported= true;
      $scope.$apply(function () {
        $scope.lat=position.coords.latitude;
        $scope.lng=position.coords.longitude;
      });
      //return position.coords;
    };

    $scope.falsePosition=function(position){
      $scope.geolocationIsSupported= false;
    };

    $scope.submit = function (key, val) {
        var tab = localStorageService.get("CheckIn");
        if (tab === null) {
          console.log("test");
          tab = [];
        }

        var checkins={
                lat: $scope.lat,
                lng: $scope.lng
              };

        tab.push(checkins);
        key = "CheckIn";
        val = tab;
        localStorageService.set(key, val);

        $rootScope.$broadcast('LocalStorageSucces');
    };

    $scope.$on('LocalStorageSucces', function () {
      var tab = localStorageService.get("CheckIn");
      $scope.number = tab.length;
    });

  })

  .controller('OpenWeatherController', function($scope, $http){

    // Simple GET request example:
    $http({
      method: 'GET',
      url: 'http://api.openweathermap.org/data/2.5/weather?lat='+$scope.checkinsDetails.lat+'&lon='+$scope.checkinsDetails.lng+'&appid=c68e847fbb4213fb36c3bfb29a4a9b02&lang=fr'
    }).then(function successCallback(response) {

      $scoop.openweather = response.data;
      // this callback will be called asynchronously
      // when the response is available
    }, function errorCallback(response) {

      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

  })

  .controller('SyncController', function($rootScope, $scope, $http, localStorageService){
    $scope.submitLS = function () {
      var tabLS = localStorageService.get("CheckIn");
      if (tabLS !== null) {
        for (var i = 0; i < tabLS.length; i++){
          envoie(tabLS, i);
        }
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
        $scope.checkinsDetails = response.data;
        $scope.loading = false;
        //localStorageService.remove("CheckIn");
        tabLS.splice(i, 1);
        $rootScope.$broadcast('EnvoiSucces', tabLS);

        // tab splice -> enlever les items qui ont réussi
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        $scope.loading = false;
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
      localStorageService.remove("CheckIn");
    }

  });

})(window.angular);
