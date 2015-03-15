'use strict';

/* Services */

var hsdbServices = angular.module('hsdbServices', ['ngResource']);

hsdbServices.factory('Players', ['$resource',
  function($resource){
    return $resource('/players/:id', {}, {
      query: {method:'GET', isArray:true},
      update: {method:'PUT'}
    });
  }]);

hsdbServices.factory('Cards', ['$resource',
  function($resource){
    return $resource('/cards', {}, {
      query: {method:'GET', isArray:true}
    });
  }]);

hsdbServices.factory('Decks', ['$resource',
  function($resource){
    return $resource('/decks/:id/:card', {}, {
      'query': {method:'GET', isArray:true},
      'save': {method:'POST'},
      'update': {method: 'PUT'},
      'delete': {method: 'DELETE'}
    });
}]);

hsdbServices.factory('AvailableClasses', function availableClasses() {
  return ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rouge', 'Shaman', 'Warlock', 'Warrior'];
});
