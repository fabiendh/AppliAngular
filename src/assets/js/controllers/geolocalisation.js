(function(angular){
  'use strict';

  angular.module('GeolocationModule',[])
  .controller('GeolocationController', function(){
    var GeolocationController= this;
    GeolocationController.getLocation=function(){
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position);
          console.log( position.coords.latitude + " "+position.coords.longitude);
          return position;
      } else {
          console.log("Geolocation is not supported by this browser.");
      }
    };

    /*GeolocationController.showPosition=function(position){
      console.log("Latitude: " + position.coords.latitude +
      "<br>Longitude: " + position.coords.longitude);

      return position.coords.latitude;
    };*/

  });
})(window.angular);

/*function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
  console.log("Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude);
}*/
