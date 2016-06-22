(function(angular){
  'use strict';

  angular.module('myApp',[
    'ngRoute',
    'ngMap',
    'LocalStorageModule',
    'satellizer',
    'naif.base64',
    'helloModule', 'ContactModule', 'CheckinModule',
  ])

  .config(function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl:'assets/template/checkinList.html',
    })
    .when('/auth', {
      templateUrl:'assets/template/authentification.html',
      controller: 'LoginController'
    })
    .when('/checkin/:checkinId', {
      templateUrl:'assets/template/checkinDetails.html',
      controller: 'CheckinDetailsController'
    });
  })

  .config(function($authProvider) {
    $authProvider.httpInterceptor = function() { return true; };
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.cordova = false;
    $authProvider.baseUrl = 'http://checkin-api.dev.cap-liberte.com/';
    $authProvider.loginUrl = 'auth';
    $authProvider.signupUrl = '/auth/signup';
    $authProvider.unlinkUrl = '/auth/unlink/';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'satellizer';
    $authProvider.authHeader = 'Authorization';
    $authProvider.authToken = 'Bearer';
    $authProvider.storageType = 'localStorage';
    //http:checkin-api.dev.cap-liberte.com/auth

    // Facebook
    $authProvider.facebook({
      clientId: 'Facebook App ID',
      responseType: 'token',
      name: 'facebook',
      url: '/auth/facebook',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/',
      requiredUrlParams: ['display', 'scope'],
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 580, height: 400 }
    });

    // Google
    $authProvider.google({
      clientId: '163298903866-mmpoj5bjtv4ne8crbh4l53v1tllguoes.apps.googleusercontent.com',
      url: '/auth/google',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin,
      requiredUrlParams: ['scope'],
      optionalUrlParams: ['display'],
      scope: ['profile', 'email'],
      scopePrefix: 'openid',
      scopeDelimiter: ' ',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 452, height: 633 }
    });

    // GitHub
    $authProvider.github({
      clientId: 'GitHub Client ID',
      url: '/auth/github',
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      redirectUri: window.location.origin,
      optionalUrlParams: ['scope'],
      scope: ['user:email'],
      scopeDelimiter: ' ',
      type: '2.0',
      popupOptions: { width: 1020, height: 618 }
    });

    // Twitter
    $authProvider.twitter({
      url: '/auth/twitter',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      redirectUri: window.location.origin,
      type: '1.0',
      popupOptions: { width: 495, height: 645 }
    });

    $authProvider.oauth2({
      name: null,
      url: null,
      clientId: '109838506980143940494',
      redirectUri: null,
      authorizationEndpoint: null,
      defaultUrlParams: ['response_type', 'client_id', 'redirect_uri'],
      requiredUrlParams: null,
      optionalUrlParams: null,
      scope: null,
      scopePrefix: null,
      scopeDelimiter: null,
      state: null,
      type: null,
      popupOptions: null,
      responseType: 'code',
      responseParams: {
        code: 'code',
        clientId: 'clientId',
        redirectUri: 'redirectUri'
      }
    });

    // Generic OAuth 1.0
    $authProvider.oauth1({
      name: null,
      url: null,
      authorizationEndpoint: null,
      redirectUri: null,
      type: null,
      popupOptions: null
    });
  });
})(window.angular);
