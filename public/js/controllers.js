var hsdbControllers = angular.module('hsdbControllers', []);



hsdbControllers.controller('Menu', ['$scope', 'Players', '$location',
  function ($scope, Players, $location) {
  	$scope.players = Players.query();
  	$scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}]);



hsdbControllers.controller('DecksList', ['$scope', '$routeParams', 'Players', 'Cards','Decks',
  function ($scope, $routeParams, Players, Cards, Decks) {
  	$scope.player = Players.get({id:$routeParams.player});
  	$scope.cards = Cards.query();
    $scope.selected = "lol";

    $scope.addDeck = function(deck) {
        var save = Players.get({id:$routeParams.player}, function() {
            var newDeck = Decks.save({"deckClass": deck}, function() {
                var addedDeck = Players.update({ id: save._id }, {"decks": newDeck._id});
                $scope.player = Players.get({id:$routeParams.player});
            });
        });
    };

}]);

hsdbControllers.controller('DecksEdit', ['$scope', '$routeParams', 'Players', 'Cards','Decks',
  function ($scope, $routeParams, Players, Cards, Decks) {
    $scope.player = Players.get({id:$routeParams.player});
    $scope.deck = Decks.get({id:$routeParams.deck});

    $scope.addCard = function (card){
        var newCard = Decks.update( {id: $routeParams.deck }, {"cards": card.description}, function() {
            $scope.deck = Decks.get({id:$routeParams.deck});
        });
    };

    $scope.deleteCard = function (card){
        var deleteCard = Decks.delete( {id: $routeParams.deck, "card": card }, function() {
            $scope.deck = Decks.get({id:$routeParams.deck});
        });
    }


}]);
