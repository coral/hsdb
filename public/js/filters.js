'use strict';

hsdbApp.filter('toArray', function () {

    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).map(function (key) {
            return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
        });
    }
});

hsdbApp.filter('exclude', ['$rootScope', function ($rootScope) {

    return function (obj) {

		var newClass = _.reject($rootScope.AvailableClasses, function(n) {
			var truth = false;
			_.forEach(obj, function(y) {
				if(y.deckClass == n)
				{
					truth = true;
				}
			});
			return truth;
		});
		return newClass;
    }
}]);
