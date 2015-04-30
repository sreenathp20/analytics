var DoAnalyticsLogin = angular.module('DoAnalyticsLogin', []);
            DoAnalyticsLogin.controller('LoginController', function ($scope, $http) {
                $scope.Login = function() {
                    //console.log($scope.username);
                    //console.log($scope.password);
                    var params = {
                        "username": $scope.username,
                        "password": $scope.password
                      };
                    
                    $http({
                        url: '/loginuser',
                        method: 'POST',
                        data: params}).success(function(data) {
                        //console.log("data", data);                
                        if (data.success) {
                            $scope.loginerror = "success!";
                            window.location.href = "/";
                        } else {
                            $scope.loginerror = "Incorrect username or password!";
                        }
                    }).error(function(data) {
                        $scope.loginerror = "Error in server!";
                    });
                }
            });