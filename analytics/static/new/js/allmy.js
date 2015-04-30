  
    var HirealchemyHcl = angular.module('HirealchemyHcl', ["highcharts-ng", "ngRoute"]);

	HirealchemyHcl.config(['$interpolateProvider', function($interpolateProvider) {
      $interpolateProvider.startSymbol('{[');
      $interpolateProvider.endSymbol(']}');
    }]);


    HirealchemyHcl.config(['$routeProvider',	function($routeProvider) {

	    $routeProvider.
	      when('/', {
	        templateUrl: '/dashboard',
	        controller: 'SummaryController'
	      }).
	      when('/statistics', {
	        templateUrl: '/statistics',
	        controller: 'SummaryController'
	      }).
	      when('/phones', {
	        templateUrl: 'partials/phone-list.html',
	        controller: 'PhoneListCtrl'
	      }).
	      when('/phones/:phoneId', {
	        templateUrl: 'partials/phone-detail.html',
	        controller: 'PhoneDetailCtrl'
	      }).
	      otherwise({        
	        redirectTo: '/phones'
	      });
  	}]);

    HirealchemyHcl.controller('SummaryController', function ($scope, $q, $http) {
        $scope.chart_container1 = false;
        $scope.chart_container2 = false;
        $scope.chart_container3 = false;
        //$scope.colors = ["#f21ae7",  "#1bd18b", "#7b00ff", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"];
        $scope.colors = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        //$scope.colorsLimit = ["#f21ae7",  "#1bd18b", "#7b00ff"]
        $scope.colorsLimit = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        $scope.metColors = ["green", "blue", "yellow"];

        $scope.LoadData = function() {
            var params = {};
            params["action"] = "dashboard";
            $scope.answers = {};
            $http({
                url: '/api/dashboard',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.chart_container1 = true; 
                $scope.chart_container2 = true; 
                //console.log("data", data);             
                $scope.tot_count = data.tot_count;
                $scope.status_count = data.status_count;
                $scope.country_count = data.country_count.total;

                console.log("$scope.country_count", $scope.country_count);
                
                $scope.CountryChartConfig.series = [];
                $scope.CountryChartConfig.xAxis.categories = [];
                angular.forEach(data.status_count, function(value, key) {
                    this.push([value.Status, value.count]);
                }, $scope.chartConfig.series[0].data);

                angular.forEach(data.country_count, function(value, key) {
                    if (key == "Approved" || key == "Open" || key == "Refer Back") {
                        this.push({"name": key, "data": value, "events": {
                                click: function(e) {
                                    //console.log("e", e); 
                                    //console.log("x", e.point.index);
                                    var index = e.point.index;
                                    //console.log("$scope.CountryChartConfig.xAxis.categories", $scope.CountryChartConfig.xAxis.categories[index]);
                                    var loc = $scope.CountryChartConfig.xAxis.categories[index];
                                    $scope.LocationFilter(loc);        
                                }
                            }
                        });
                    }   
                }, $scope.CountryChartConfig.series);

                //$scope.CountryChartConfig.series = [];
                $scope.CountryChartConfig.xAxis.categories = data.country_count.country;
                
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }
        $scope.SelectCountry = function(loc) {
            console.log(loc)
            $scope.LocationFilter(loc);
        }
        $scope.LocationFilter = function(loc) {
            $scope.country = loc;
            $scope.CountryChartConfig.loading = true;
            $scope.LocChartConfig.loading = true;
            var params = {};
                params["action"] = "location_filter";
                params["loc"] = loc;
                $http({
                    url: '/api/dashboard',
                    method: 'POST',
                    data: params}).success(function(data) {                           
                    //console.log("data", data);
                    $scope.LocChartConfig.series = [];
                    $scope.LocChartConfig.xAxis.categories = [];
                    $scope.CountryChartConfig.loading = false;
                    $scope.LocChartConfig.loading = false;
                    $scope.chart_container2 = false;
                    $scope.chart_container3 = true;
                    $scope.loc_count = data.loc_count.total;
                    
                    angular.forEach(data.loc_count, function(value, key) {
                        if (key == "Approved" || key == "Open" || key == "Refer Back") {
                            this.push({"name": key, "data": value});
                        }
                    }, $scope.LocChartConfig.series);
                    
                    $scope.LocChartConfig.xAxis.categories = data.loc_count.PersonalSubArea;
                }).error(function(data) {
                    $scope.loginerror = "Error in server!";
                });
        }
        $scope.BackToCountryChart = function() {
            $scope.chart_container2 = true;
            $scope.chart_container3 = false;
        }
        $scope.ChangeChart = function(val){
            //console.log('val', val);
            //console.log('$scope.chartConfig', $scope.chartConfig);
            $scope.chartConfig.options.chart.type = val;
            $scope.chartConfig.series[0].type = val;
            if (val == 'bar') {
                //$scope.chartConfig.series[0].data= [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
            }
        }
        $scope.chartConfig = {
             options: {
                 chart: {
                     type: 'pie'
                 },
                 tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     hideDelay: 0
                 },
                 colors: $scope.colors
             },
             plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                    
                }
            },
            series: [{
                name: 'Demands',
                type: 'pie',
                data: []
             }],
             title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
             xAxis: {
              currentMin: 0,
              currentMax: 20,
              title: {text: 'values'}
             },
             yAxis: {
                gridLineWidth: 0,
                allowDecimals: false
             },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
             func: function (chart) {
             }

        }
        $scope.CountryChartConfig = {
            // chart: {
            //          type: 'column'
            // },
            // colors: ["#bf3d3d",  "#1bd18b", "#7b00ff", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"],
             options: {
                chart: {
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     hideDelay: 0
                },
                colors: $scope.colors,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    },
                    series: {
                        cursor: 'pointer'
                    }
                },
                legend: {
                    enabled: false
                }
                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: ["Approved", "Open", "Refer Back"],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }
        $scope.LocChartConfig = {
             options: {
                chart: {
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     hideDelay: 0
                },
                colors: $scope.colorsLimit,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }
                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100
            },
            yAxis: {
                min: 0,
                allowDecimals: false,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }
});HirealchemyHcl.controller('AttractivenessController', function ($scope, $q, $http) {
        $scope.attr_container1 = false;
        $scope.attr_container3 = false;
        $scope.parent_level = false;
        //$scope.colors = ["#7b00ff", "#1bd18b", "#f21ae7", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"];
        $scope.colors = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        //$scope.colorsLimit = ["#7b00ff", "#1bd18b", "#f21ae7"];
        $scope.colorsLimit = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        $scope.LoadData = function() {
            var params = {};
            params["action"] = "atrractiveness";
            $scope.answers = {};
            $http({
                url: '/api/dashboard',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.attr_container1 = true;
                $scope.attr_container3 = true;
                           
                $scope.chartConfig.series.push({"name": "Open", "data": data.skills_count.Open, "events": { click: $scope.chartConfigClick }});  
                $scope.chartConfig.series.push({"name": "Refer Back", "data": data.skills_count["Refer Back"], "events": { click: $scope.chartConfigClick }});  
                $scope.chartConfig.series.push({"name": "Approved", "data": data.skills_count.Approved, "events": { click: $scope.chartConfigClick }});      
                $scope.chartConfig.xAxis.categories = data.skills_count.skills;         
              
                $scope.LoadDataLevel("Level_1", "Level_2", "");

                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }
        $scope.SelectDataLevel = function(level, next_level, l_value) {
            console.log("l_value", l_value);
            $scope.LoadDataLevelClick(level, next_level, l_value);
        }
        $scope.LoadDataLevelClick = function(level, next_level, parent_level) {
            $scope.LoadDataLevel(level, next_level, parent_level);
        }
        $scope.LoadDataLevel = function(level, next_level, parent_level) {
            var params = {};
            params["action"] = "level_data";
            params["level"] = level;
            params["parent_level"] = parent_level;
            $scope.answers = {};
            $http({
                url: '/api/dashboard',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.attr_container4 = false;
                $scope.attr_container5 = false;
                $scope.attr_container6 = false;                
                switch(level) {
                    case "Level_1":
                        $scope.LevelChartConfig.series = [];
                        var level1 = "Level_2";
                        $scope.attr_container4 = true;
                        $scope.LevelChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_1 = $scope.LevelChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_1);
                        } }});
                        $scope.LevelChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_1 = $scope.LevelChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_1);
                        } }});
                        $scope.LevelChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_1 = $scope.LevelChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_1);
                        } }});
                        $scope.LevelChartConfig.xAxis.categories = data.level_count.level;
                        // thisClick = function() {
                        // }
                        break;
                    case "Level_2":
                        $scope.Level1ChartConfig.series = [];
                        $scope.attr_container5 = true;
                        var level1 = "Level_3";
                        $scope.level_1 = parent_level;                 
                        $scope.Level1ChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_2 = $scope.Level1ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_2);
                        } }});
                        $scope.Level1ChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_2 = $scope.Level1ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_2);
                        } }});
                        $scope.Level1ChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_2 = $scope.Level1ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_2);
                        } }});
                        $scope.Level1ChartConfig.xAxis.categories = data.level_count.level;
                        break;
                    case "Level_3":
                        $scope.Level2ChartConfig.series = [];
                        $scope.attr_container6 = true;
                        var level1 = "Level_4";
                        $scope.level_2 = parent_level;
                        $scope.Level2ChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_3 = $scope.Level2ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_3);
                        } }});
                        $scope.Level2ChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_3 = $scope.Level2ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_3);
                        } }});
                        $scope.Level2ChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_3 = $scope.Level2ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_3);
                        } }});
                        $scope.Level2ChartConfig.xAxis.categories = data.level_count.level;
                        break;
                    case "Level_4":
                        $scope.Level3ChartConfig.series = [];
                        $scope.attr_container7 = true;
                        var level1 = "Level_4";
                        $scope.level_3 = parent_level;
                        $scope.Level3ChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "events": { click: function(e) {
                            // var index = e.point.index;
                            // $scope.parent_level = $scope.Level3ChartConfig.xAxis.categories[index];
                            // $scope.LoadDataLevelClick(e, level1, next_level);
                        } }});
                        $scope.Level3ChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "events": { click: function(e) {
                            // var index = e.point.index;
                            // $scope.parent_level = $scope.Level3ChartConfig.xAxis.categories[index];
                            // $scope.LoadDataLevelClick(e, level1, next_level);
                        } }});
                        $scope.Level3ChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "events": { click: function(e) {
                            // var index = e.point.index;
                            // $scope.parent_level = $scope.Level3ChartConfig.xAxis.categories[index];
                            // $scope.LoadDataLevelClick(e, level1, next_level);
                        } }});
                        $scope.Level3ChartConfig.xAxis.categories = data.level_count.level;
                        break;                    
                }                     
                
                //console.log("$scope.AttractivenessChartConfig", $scope.AttractivenessChartConfig);
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }

        $scope.BackToLevel = function(hide, show) {
            $scope[hide] = false;
            $scope[show] = true;
        }        
        $scope.chartConfigClick = function(e) {         
            var index = e.point.index;
            var skill = $scope.chartConfig.xAxis.categories[index];
            $scope.SkillFilter(skill);  
        }
        $scope.BackToSkills = function() {
            $scope.attr_container1 = true;
            $scope.attr_container2 = false;
        }
        $scope.SkillFilter = function(skill) {
            $scope.chartConfig.loading = true;
            $scope.LocChartConfig.loading = true;
            var params = {};
                params["action"] = "skill_filter";
                params["skill"] = skill;
                $http({
                    url: '/api/dashboard',
                    method: 'POST',
                    data: params}).success(function(data) {                           
                    //console.log("data", data);
                    $scope.LocChartConfig.series = [];
                    $scope.LocChartConfig.xAxis.categories = [];
                    $scope.chartConfig.loading = false;
                    $scope.LocChartConfig.loading = false;
                    $scope.attr_container1 = false;
                    $scope.attr_container2 = true;
                    $scope.skill = skill;
                    //$scope.loc_count = data.skills_count.total;
                    
                    angular.forEach(data.skills_count, function(value, key) {
                        if (key == "Approved" || key == "Open" || key == "Refer Back") {
                            this.push({"name": key, "data": value});
                        }
                    }, $scope.LocChartConfig.series);
                    
                    $scope.LocChartConfig.xAxis.categories = data.skills_count.country;
                }).error(function(data) {
                    $scope.loginerror = "Error in server!";
                });
        }
        
        $scope.chartConfig = {
            // chart: {
            //          type: 'column'
            // },
            // colors: ["#bf3d3d",  "#1bd18b", "#7b00ff", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"],
             options: {
                chart: {
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     hideDelay: 0
                },
                colors: $scope.colors,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    },
                    series: {
                        cursor: 'pointer'
                    }
                },
                legend: {
                    enabled: false
                }
                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: ["Approved", "Open", "Refer Back"],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0,
                allowDecimals: false
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }
        $scope.LocChartConfig = {
            // chart: {
            //          type: 'column'
            // },
            // colors: ["#bf3d3d",  "#1bd18b", "#7b00ff", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"],
             options: {
                chart: {
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     hideDelay: 0
                },
                colors: $scope.colorsLimit,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }
                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: ["Approved", "Open", "Refer Back"],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0,
                allowDecimals: false
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }
        
        $scope.LevelChartConfig = {
            options: {
                chart: {
                    alignTicks: false,
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40
                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 2,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colorsLimit,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    },
                    series: {
                        cursor: 'pointer'
                    }
                },
                legend: {
                    enabled: false
                }
                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100,
                gridLineWidth: 0
            },
            
            yAxis: {
                min: 0,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0,
                allowDecimals: false
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }

        $scope.Level1ChartConfig = {
             options: {
                chart: {
                    alignTicks: false,
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 2,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colorsLimit,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    },
                    series: {
                        cursor: 'pointer'
                    }
                },
                legend: {
                    enabled: false
                }                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100,
                gridLineWidth: 0
            },
            
            yAxis: {
                min: 0,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0,
                allowDecimals: false
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }
        $scope.Level2ChartConfig = {
             options: {
                chart: {
                    alignTicks: false,
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 2,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colorsLimit,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    },
                    series: {
                        cursor: 'pointer'
                    }
                },
                legend: {
                    enabled: false
                }                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100,
                gridLineWidth: 0
            },
            
            yAxis: {
                min: 0,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0,
                allowDecimals: false
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }
        $scope.Level3ChartConfig = {
             options: {
                chart: {
                    alignTicks: false,
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 2,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colorsLimit,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100,
                gridLineWidth: 0
            },
            
            yAxis: {
                min: 0,
                title: {
                    text: 'Demands'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                gridLineWidth: 0,
                allowDecimals: false
            },
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }
        
    });HirealchemyHcl.controller('StatisticsController', function ($scope, $q, $http) {
        $scope.chart_container1 = false;
        $scope.chart_container2 = false;
        //$scope.colors = ["#7b00ff", "#1bd18b", "#f21ae7", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"];
        $scope.colors = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        //$scope.colorsLimit = ["#f21ae7",  "#1bd18b", "#7b00ff"];
        $scope.colorsLimit = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        $scope.LoadData = function() {
            $scope.LoadInternalFillingData();
            $scope.LoadHiringEfficiencyData();            
        }
        $scope.LoadInternalFillingData = function() {
            var params = {};
            params["action"] = "internal_filling";
            $scope.answers = {};
            $http({
                url: '/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.chart_container1 = true;
                $scope.chart_container2 = true;
                // $scope.attr_container3 = true;

                
                $scope.chartConfig.series.push({"name": "Internal_Filled", "data": data.intr_count.Internal_Filled, "yAxis": 1, "type": "column"});
                $scope.chartConfig.series.push({"name": "Vacancy", "data": data.intr_count.Vacancy, "yAxis": 1, "type": "column"});
                $scope.chartConfig.series.push({"name": "Internal Filling Rate", "data": data.intr_count.perc, "yAxis": 0, "type": "line"});                               
                $scope.chartConfig.xAxis.categories = data.intr_count.skills;

                $scope.AttractivenessChartConfig.series.push({"name": "External_Joined", "data": data.attr_count.External_Joined, "yAxis": 1, "type": "column"});
                $scope.AttractivenessChartConfig.series.push({"name": "External_Offered", "data": data.attr_count.External_Offered, "yAxis": 1, "type": "column"});
                $scope.AttractivenessChartConfig.series.push({"name": "Employer Attractiveness", "data": data.attr_count.perc, "yAxis": 0, "type": "line"});
                $scope.AttractivenessChartConfig.xAxis.categories = data.attr_count.skills;
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }  
        $scope.LoadHiringEfficiencyData = function() {
            var params = {};
            params["action"] = "hiring_efficiency";
            $scope.answers = {};
            $http({
                url: '/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.chart_container3 = true;

                $scope.HiringEfficiencyChartConfig.serie = [];
                
                
                $scope.HiringEfficiencyChartConfig.series.push({"name": "Total_Final_Select", "data": data.Total_Final_Select, "yAxis": 1, "type": "column"});
                $scope.HiringEfficiencyChartConfig.series.push({"name": "Total_forwarded", "data": data.Total_forwarded, "yAxis": 1, "type": "column"});
                $scope.HiringEfficiencyChartConfig.series.push({"name": "Internal Hiring Efficiency", "data": data.perc, "yAxis": 0, "type": "line"});                               
                $scope.HiringEfficiencyChartConfig.xAxis.categories = data.skills;

                
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }        
        $scope.LoadLoR = function() {
            var params = {};
            params["action"] = "loss_of_revenue";
            $scope.answers = {};
            $http({
                url: '/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.chart_container4 = true;

                // $scope.HiringEfficiencyChartConfig.serie = [];
                
                $scope.LoRChartConfig.series.push({"name": "No. of demands", "data": data.values, "type": "column"});
                                               
                $scope.LoRChartConfig.xAxis.categories = data.range;
                
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        } 
        $scope.LoadDemandApproval = function() {
            var params = {};
            params["action"] = "demand_approval";
            $scope.answers = {};
            $http({
                url: '/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.chart_container5 = true;

                // $scope.HiringEfficiencyChartConfig.serie = [];
                
                $scope.DemandApprovalChart.series.push({"name": "No. of demands", "data": data.values, "type": "column"});
                                               
                $scope.DemandApprovalChart.xAxis.categories = data.range;
                
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }  
        
        $scope.chartConfig = {
            
             options: {
                chart: {
                    alignTicks: false,
                     type: 'line',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 2,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colors,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }
                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: ["Approved", "Open", "Refer Back"],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} %'
                    // style: {
                    //     color: Highcharts.getOptions().colors[2]
                    // }
                },
                min: 0,
                max: 25,
                allowDecimals: false,
                ceiling: 100,
                title: {
                    text: 'Internal filling rate'
                },
                opposite: true,
                gridLineWidth: 0

            }, { // Secondary yAxis
                min: 0,
                allowDecimals: false,
                gridLineWidth: 0,
                title: {
                    text: 'Demands',
                    
                },
                labels: {
                    format: '{value}',
                    // style: {
                    //     color: Highcharts.getOptions().colors[0]
                    // }
                }

            }],
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }

        $scope.AttractivenessChartConfig = {
             options: {
                chart: {
                    alignTicks: false,
                     type: 'line',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 2,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colors,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }
                 
             },
            title: {
                 text: ''
             },
             credits:{"enabled":true},
             loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100,
                gridLineWidth: 0
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} %'
                    // style: {
                    //     color: Highcharts.getOptions().colors[2]
                    // }
                },
                min: 0,
                max: 100,
                allowDecimals: false,
                ceiling: 100,
                title: {
                    text: 'Attraction rate'
                },
                opposite: true,
                gridLineWidth: 0

            }, { // Secondary yAxis
                min: 0,
                allowDecimals: false,
                gridLineWidth: 0,
                title: {
                    text: 'Demands',
                    
                },
                labels: {
                    format: '{value}',
                    // style: {
                    //     color: Highcharts.getOptions().colors[0]
                    // }
                }

            }],
            
             useHighStocks: false,
             // size: {
             //   width: 500,
             //   height: 400
             // },
            series: [],
             func: function (chart) {
             }

        }   
        $scope.HiringEfficiencyChartConfig = {
             options: {
                chart: {
                    alignTicks: false,
                     type: 'line',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40
                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 2,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colors,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }
                 
            },
            title: {
                 text: ''
            },
            credits:{"enabled":true},
            loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60},
                minPadding: 100,
                gridLineWidth: 0
            },
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} %'
                    // style: {
                    //     color: Highcharts.getOptions().colors[2]
                    // }
                },
                min: 0,
                max: 100,
                allowDecimals: false,
                ceiling: 100,
                title: {
                    text: 'Internal Hiring Efficiency'
                },
                opposite: true,
                gridLineWidth: 0

            }, { // Secondary yAxis
                min: 0,
                allowDecimals: false,
                gridLineWidth: 0,
                title: {
                    text: 'Demands',
                    
                },
                labels: {
                    format: '{value}',
                    // style: {
                    //     color: Highcharts.getOptions().colors[0]
                    // }
                }

            }],
            
            useHighStocks: false,
            // size: {
            //   width: 500,
            //   height: 400
            // },
            series: [],
            func: function (chart) {
            }
        }  
        $scope.LoRChartConfig = {
             options: {
                chart: {
                    alignTicks: false,
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 0,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colors,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }
                 
            },
            title: {
                 text: ''
            },
            credits:{"enabled":true},
            loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60, format: '{value}'},
                minPadding: 100,
                gridLineWidth: 0
            },
            yAxis: { // Secondary yAxis
                min: 0,
                allowDecimals: false,
                gridLineWidth: 0,
                title: {
                    text: 'Demands',
                    
                },
                labels: {
                    format: '{value}',
                    // style: {
                    //     color: Highcharts.getOptions().colors[0]
                    // }
                }
            },
            
            useHighStocks: false,
            // size: {
            //   width: 500,
            //   height: 400
            // },
            series: [],
            func: function (chart) {
            }
        }   
        $scope.DemandApprovalChart = {
             options: {
                chart: {
                    alignTicks: false,
                     type: 'column',
                     marginBottom: 70,
                     marginLeft: 40,
                     marginRight: 40

                },
                tooltip: {
                     style: {
                         padding: 10,
                         fontWeight: 'bold'
                     },
                     valueDecimals: 0,
                     valueSuffix: '',
                     hideDelay: 0
                },
                colors: $scope.colors,
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                }
                 
            },
            title: {
                 text: ''
            },
            credits:{"enabled":true},
            loading: false,
            xAxis: {
                categories: [],
                title: {text: ''},
                labels: {rotation: 60, format: '{value}'},
                minPadding: 100,
                gridLineWidth: 0
            },
            yAxis: { // Secondary yAxis
                min: 0,
                allowDecimals: false,
                gridLineWidth: 0,
                title: {
                    text: 'Demands',
                    
                },
                labels: {
                    format: '{value}',
                    // style: {
                    //     color: Highcharts.getOptions().colors[0]
                    // }
                }
            },
            
            useHighStocks: false,
            // size: {
            //   width: 500,
            //   height: 400
            // },
            series: [],
            func: function (chart) {
            }
        }   
        
    });