HirealchemyHcl.controller('SummaryController', function ($scope, $q, $http) {  
      
        //$scope.colors = ["#f21ae7",  "#1bd18b", "#7b00ff", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"];
        $scope.colors = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        //$scope.colorsLimit = ["#f21ae7",  "#1bd18b", "#7b00ff"]
        $scope.colorsLimit = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        $scope.metColors = ["green", "blue", "yellow"];

        
        $scope.LoadSummary = function() {
            console.log("SECTION 2", SECTION);

            $scope.chart_container1 = true;
            
            $scope.chartConfig.loading = true;
            var params = {};
            params["action"] = "dashboard_summary";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/dashboard',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.chartConfig.loading = false;  
                $scope.tot_count = data.tot_count;
                $scope.status_count = data.status_count;

                angular.forEach(data.status_count, function(value, key) {
                    this.push([value.Status, value.count]);
                }, $scope.chartConfig.series[0].data);                      
               
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }
        $scope.LoadCountrySummary = function() {
            $scope.chart_container2 = true;
            $scope.CountryChartConfig.loading = true;
            var params = {};
            params["action"] = "dashboard_country_summary";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/dashboard',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.CountryChartConfig.loading = false;

                //$scope.tot_count = data.tot_count;
                $scope.country_count = data.country_count.total;
                
                $scope.CountryChartConfig.series = [];
                $scope.CountryChartConfig.xAxis.categories = [];
                

                $scope.CountryChartConfig.series.push({"name": "Refer Back", "data": data.country_count["Refer Back"], "color": $scope.colors[0], "events": {
                                click: function(e) {
                                    var index = e.point.index;
                                    var loc = $scope.CountryChartConfig.xAxis.categories[index];
                                    $scope.LocationFilter(loc);        
                                }
                            }
                        });
                $scope.CountryChartConfig.series.push({"name": "Open", "data": data.country_count["Open"], "color": $scope.colors[2], "events": {
                                click: function(e) {
                                    var index = e.point.index;
                                    var loc = $scope.CountryChartConfig.xAxis.categories[index];
                                    $scope.LocationFilter(loc);        
                                }
                            }
                        });                
                $scope.CountryChartConfig.series.push({"name": "Approved", "data": data.country_count["Approved"], "color": $scope.colors[1], "events": {
                                click: function(e) {
                                    var index = e.point.index;
                                    var loc = $scope.CountryChartConfig.xAxis.categories[index];
                                    $scope.LocationFilter(loc);        
                                }
                            }
                        });

                
                $scope.CountryChartConfig.xAxis.categories = data.country_count.country;
                
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }
        $scope.SelectCountry = function(loc) {
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
                    url: '/'+SECTION+'/api/dashboard',
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

                    $scope.LocChartConfig.series.push({"name": "Refer Back", "data": data.loc_count["Refer Back"], "color": $scope.colors[0]});
                    $scope.LocChartConfig.series.push({"name": "Open", "data": data.loc_count["Open"], "color": $scope.colors[2]});
                    $scope.LocChartConfig.series.push({"name": "Approved", "data": data.loc_count["Approved"], "color": $scope.colors[1]});                    
                    
                    
                    $scope.LocChartConfig.xAxis.categories = data.loc_count.PersonalSubArea;
                }).error(function(data) {
                    $scope.loginerror = "Error in server!";
                });
        }
        $scope.DemandReasons = function() {
            $scope.attr_container8 = true;
            $scope.DemandReasonChart.loading = true;
            var params = {};
                params["action"] = "demand_reasons";
                $http({
                    url: '/'+SECTION+'/api/dashboard',
                    method: 'POST',
                    data: params}).success(function(data) {   
                    $scope.DemandReasonChart.loading = false;
                    $scope.DemandReasonChart.series.push({"name": "No. of Demands", "data": data.reason_count["count"], "color": $scope.colors[0]});            
                                        
                    $scope.DemandReasonChart.xAxis.categories = data.reason_count["reasons"];
                }).error(function(data) {
                    $scope.loginerror = "Error in server!";
                });
        }
        $scope.DemandCustomers = function() {
            $scope.attr_container9 = true;
            $scope.DemandCustomerChart.loading = true;
            var params = {};
                params["action"] = "demand_customers";
                $http({
                    url: '/'+SECTION+'/api/dashboard',
                    method: 'POST',
                    data: params}).success(function(data) {   
                    $scope.DemandCustomerChart.loading = false;
                    $scope.DemandCustomerChart.series.push({"name": "Refer Back", "data": data.customers_count["Refer Back"], "color": $scope.colors[0]}); 
                    $scope.DemandCustomerChart.series.push({"name": "Open", "data": data.customers_count["Open"], "color": $scope.colors[2]}); 
                    $scope.DemandCustomerChart.series.push({"name": "Approved", "data": data.customers_count["Approved"], "color": $scope.colors[1]});            
                                        
                    $scope.DemandCustomerChart.xAxis.categories = data.customers_count["customers"];
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
             exporting: {
                    enabled: true
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
                //colors: $scope.colors,
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
        $scope.DemandReasonChart = {
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
        $scope.DemandCustomerChart = {
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