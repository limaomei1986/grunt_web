(function() {
	'use strict';

	angular.module('app.auth')
		.controller('authCtrl', ['$scope', '$location', '$http', '$rootScope', 'authFact', authCtrl]);

	function authCtrl($scope, $location, $http, $rootScope, authFact) {
		$scope.signin = function() {
			authFact.login($scope.user).then(function(response) {
				// success                
				//console.log(authFact.isUserAuthenticated());
				if (authFact.isUserAuthenticated()) {

					$rootScope.isUserAuthenticated = authFact.isUserAuthenticated();

					$location.path('/dashboard/dashboard');

				} else {

					window.alert(response.data.message);

					$scope.user.username = '';
					$scope.user.password = '';
				}
			}, function(response) {
				// error
				window.alert('error:' + response.data.message);
			});
		};
	}

})();