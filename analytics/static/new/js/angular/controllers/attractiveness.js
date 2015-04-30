HirealchemyHcl.controller('AttractivenessController', function ($scope, $q, $http) {
        
        $scope.parent_level = false;
        //$scope.colors = ["#7b00ff", "#1bd18b", "#f21ae7", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"];
        $scope.colors = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        //$scope.colorsLimit = ["#7b00ff", "#1bd18b", "#f21ae7"];
        $scope.colorsLimit = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        $scope.LoadData = function() {
            $scope.attr_container1 = true;
            $scope.attr_container4 = true;
            $scope.chartConfig.loading = true;
            var params = {};
            params["action"] = "atrractiveness";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/dashboard',
                method: 'POST',
                data: params}).success(function(data) {
                           
                $scope.chartConfig.loading = false;
                $scope.chartConfig.series.push({"name": "Refer Back", "data": data.skills_count["Refer Back"], "color": $scope.colors[0], "events": { click: $scope.chartConfigClick }});  
                $scope.chartConfig.series.push({"name": "Open", "data": data.skills_count.Open, "color": $scope.colors[2], "events": { click: $scope.chartConfigClick }});  
                $scope.chartConfig.series.push({"name": "Approved", "data": data.skills_count.Approved, "color": $scope.colors[1], "events": { click: $scope.chartConfigClick }});      
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
            //$scope.LevelChartConfig.loading = true;
            var params = {};
            params["action"] = "level_data";
            params["level"] = level;
            params["parent_level"] = parent_level;
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/dashboard',
                method: 'POST',
                data: params}).success(function(data) {
                
                $scope.attr_container5 = false;
                $scope.attr_container6 = false;                
                switch(level) {
                    case "Level_1":
                        $scope.LevelChartConfig.series = [];
                        var level1 = "Level_2";
                        //$scope.LevelChartConfig.loading = false;
                        $scope.LevelChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "color": $scope.colors[0], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_1 = $scope.LevelChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_1);
                        } }});
                        $scope.LevelChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "color": $scope.colors[2], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_1 = $scope.LevelChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_1);
                        } }});                        
                        $scope.LevelChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "color": $scope.colors[1], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_1 = $scope.LevelChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_1);
                        } }});
                        $scope.LevelChartConfig.xAxis.categories = data.level_count.level;
                        // thisClick = function() {
                        // }
                        break;
                    case "Level_2":
                        //$scope.LevelChartConfig.loading = false;

                        $scope.Level1ChartConfig.series = [];
                        $scope.attr_container4 = false;
                        $scope.attr_container5 = true;
                        var level1 = "Level_3";
                        $scope.level_1 = parent_level;  
                        $scope.Level1ChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "color": $scope.colors[0], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_2 = $scope.Level1ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_2);
                        } }});               
                        $scope.Level1ChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "color": $scope.colors[2], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_2 = $scope.Level1ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_2);
                        } }});                        
                        $scope.Level1ChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "color": $scope.colors[1], "events": { click: function(e) {
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
                        $scope.Level2ChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "color": $scope.colors[0], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_3 = $scope.Level2ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_3);
                        } }});
                        $scope.Level2ChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "color": $scope.colors[2], "events": { click: function(e) {
                            var index = e.point.index;
                            $scope.level_3 = $scope.Level2ChartConfig.xAxis.categories[index];
                            $scope.LoadDataLevelClick(level1, next_level, $scope.level_3);
                        } }});                        
                        $scope.Level2ChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "color": $scope.colors[1], "events": { click: function(e) {
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
                        $scope.Level3ChartConfig.series.push({"name": "Refer Back", "data": data.level_count["Refer Back"], "color": $scope.colors[0], "events": { click: function(e) {
                            // var index = e.point.index;
                            // $scope.parent_level = $scope.Level3ChartConfig.xAxis.categories[index];
                            // $scope.LoadDataLevelClick(e, level1, next_level);
                        } }});
                        $scope.Level3ChartConfig.series.push({"name": "Open", "data": data.level_count.Open, "color": $scope.colors[2], "events": { click: function(e) {
                            // var index = e.point.index;
                            // $scope.parent_level = $scope.Level3ChartConfig.xAxis.categories[index];
                            // $scope.LoadDataLevelClick(e, level1, next_level);
                        } }});                        
                        $scope.Level3ChartConfig.series.push({"name": "Approved", "data": data.level_count.Approved, "color": $scope.colors[1], "events": { click: function(e) {
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
                    url: '/'+SECTION+'/api/dashboard',
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
                    
                    
                    $scope.LocChartConfig.series.push({"name": "Refer Back", "data": data.skills_count["Refer Back"], "color": $scope.colors[0]});
                    $scope.LocChartConfig.series.push({"name": "Open", "data": data.skills_count["Open"], "color": $scope.colors[2]});
                    $scope.LocChartConfig.series.push({"name": "Approved", "data": data.skills_count["Approved"], "color": $scope.colors[1]});
                    
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
        
    });