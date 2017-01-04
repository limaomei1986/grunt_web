(function() {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', function($routeProvider) {
            var routes, setRoutes, loginRequired;

            routes = [
                'dashboard',
                'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/boxes', 'ui/timeline', 'ui/pricing-tables', 'ui/maps',
                'table/static', 'table/dynamic', 'tableiu/responsive',
                'form/elements', 'form/layouts', 'form/validation', 'form/wizard',
                'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/invoice', 'page/signin', 'page/signup',
                'app/tasks', 'app/calendar'
            ]

            setRoutes = function(route) {
                var config, url;
                url = '/' + route;
                config = {
                    templateUrl: 'app/' + route + '.html'
                };
                $routeProvider.when(url, config);
                return $routeProvider;
            };

            loginRequired = function($q, $location, authFact) {
                var deffered = $q.defer();
                if (authFact.isUserAuthenticated()) {
                    deffered.resolve();
                } else {
                    $location.path('/auth/signin');
                }

                return deffered.promise;
            };

            routes.forEach(function(route) {
                return setRoutes(route);
            });

            $routeProvider
                .when('/', {
                    redirectTo: '/dashboard'
                })
                .when('/dashboard', {
                    templateUrl: 'app/dashboard/dashboard.html',
                    resolve: {
                        loginRequired: loginRequired
                    }
                })
                .when('/auth/signin', {
                    templateUrl: 'app/auth/signin.html'
                })
                .when('/404', {
                    templateUrl: 'app/page/404.html'
                })
                .otherwise({
                    redirectTo: '/404'
                });

        }]).run(function($rootScope, authFact) {
            if (authFact.isUserAuthenticated()) {
                $rootScope.isUserAuthenticated = authFact.isUserAuthenticated();
            }

        });

})();