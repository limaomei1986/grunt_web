(function() {
	'use strict';

	angular.module('app.auth')
		.factory('authFact', ['$http', '$q', '$window', function($http, $q, $window) {
			// Service logic
			var user;
			var cachedToken;
			var baseAPI = 'http://www.alicun.top/v1/';

			function login(user) {

				var deferred = $q.defer();

				var req = {
					method: 'POST',
					url: baseAPI + 'account/login',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: user
				};

				$http(req)
					.then(function(response) {

						// success
						user = {
							token: response.data.jwt
						};
						// save the information
						$window.localStorage.setItem('userInfo', JSON.stringify(user));

						deferred.resolve(user);

					}, function(error) {
						
						// we have an error
						deferred.resolve(error);
					});

				return deferred.promise;

			}

			/**
			 *   Register will create a new user. Upon success, 
			 *   we will return the 'response' from the server
			 */
			function register(newUser) {

				var req = {
					method: 'POST',
					url: baseAPI + 'auth/register',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: newUser
				};

				return $http(req).then(function(response) {
					return response;
				});
			}

			/**
			 *   returns the token from cached. Otherwise, it will set from localstorage.
			 */
			function getToken() {
				if (!cachedToken) {
					cachedToken = $window.localStorage.getItem('userInfo');
				}

				return cachedToken;
			}

			/**
			 *   isUserAuthenticated returns true if we have a valid token.
			 *   false otehrwise
			 */
			function isUserAuthenticated() {
				return !!getToken();
			}

			/**
			 *   returns information about the user
			 */
			function getUserInfo() {
				return user;
			}

			/**
			 * Logs the user out.
			 */
			function logout() {
				var deferred = $q.defer();

				var reqLogout = {
					method: 'POST',
					url: baseAPI + 'auth/logout',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: user
				};

				$http(reqLogout).then(function(response) {
					// success

					if (response.data.status === 'OK') {
						// let's remove user info.
						$window.localStorage.removeItem('userInfo');
						cachedToken = null;
						user = null;

						deferred.resolve(response);

					}
				}, function(error) {
					deferred.resolve(error);
				});

				return deferred.promise;
			}


			// Public API here
			return {
				login: login,
				register: register,
				isUserAuthenticated: isUserAuthenticated,
				getUserInfo: getUserInfo,
				logout: logout,
				getToken: getToken
			};
		}]);
})();