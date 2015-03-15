'use strict';

/* App Module */

var hsdbApp = angular.module('hsdbApp', [
  'ngRoute',
  'angucomplete-alt',
  'hsdbControllers',
  'hsdbServices'
]).run(["$rootScope", "AvailableClasses", function($rootScope, AvailableClasses) {
    $rootScope.AvailableClasses = AvailableClasses;
}]);

hsdbApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/decks/:player', {
        templateUrl: 'partials/decks.html',
        controller: 'DecksList'
      }).
      when('/edit/:player/:deck', {
        templateUrl: 'partials/edit.html',
        controller: 'DecksEdit'
      }).
      when('/', {
        templateUrl: 'partials/hello.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
