(function(angular){
  'use strict';

  angular.module('ContactModule',[])
  .controller('ContactController', function(){
    var ContactController= this;
    this.contact=[
      {
        name:'Michel',
        phone:'06 06 06 06 06'
      },
      {
        name:'Michelline',
        phone:'07 07 07 07 07'
      }
    ];

    ContactController.Affiche = function(){

      return this.contact;
    };

  });


})(window.angular);
