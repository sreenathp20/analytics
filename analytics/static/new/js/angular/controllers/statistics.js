HirealchemyHcl.controller('StatisticsController', function ($scope, $q, $http) {
        
        //$scope.colors = ["#7b00ff", "#1bd18b", "#f21ae7", "#CB14E8", "#FE142F", "#FF4917", "#2315E8", "#C3E715", "#E71497", "#2AE613"];
        $scope.colors = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        $scope.colorsLimit = ["#4d8178",  "#95bc89", "#2f524f", "#6a8d56", "#9bc1ab"];
        $scope.LoadData = function() {
            $scope.chart_container1 = true;
            $scope.chart_container2 = true;
            $scope.chart_container3 = true;
            $scope.chart_container4 = true;
            $scope.chart_container5 = true;
            $scope.chart_container6 = true;

            //$scope.LoadInternalFillingData();
            //$scope.LoadHiringEfficiencyData();            
        }
        $scope.LoadInternalFillingData = function() {
            $scope.chartConfig.loading = true;
            var params = {};
            params["action"] = "internal_filling";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.chartConfig.loading = false;
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
            $scope.HiringEfficiencyChartConfig.loading = true;
            var params = {};
            params["action"] = "hiring_efficiency";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {

                $scope.HiringEfficiencyChartConfig.loading = false;

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
            $scope.LoRChartConfig.loading = true;
            var params = {};
            params["action"] = "loss_of_revenue";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {
                $scope.LoRChartConfig.loading = false;

                // $scope.HiringEfficiencyChartConfig.serie = [];
                
                $scope.LoRChartConfig.series.push({"name": "No. of demands", "data": data.values, "type": "column"});
                                               
                $scope.LoRChartConfig.xAxis.categories = data.range;
                
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        } 
        $scope.LoadDemandApproval = function() {
            $scope.DemandApprovalChart.loading = true;
            var params = {};
            params["action"] = "demand_approval";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {
                
                $scope.DemandApprovalChart.loading = false;
                // $scope.HiringEfficiencyChartConfig.serie = [];
                
                $scope.DemandApprovalChart.series.push({"name": "No. of demands", "data": data.values, "type": "column"});
                                               
                $scope.DemandApprovalChart.xAxis.categories = data.range;
                
                
            }).error(function(data) {
                $scope.loginerror = "Error in server!";
            });
        }  
        $scope.LeadTime = function() {
            
            $scope.LeadTimeChart.loading = true;
            var params = {};
            params["action"] = "lead_time";
            $scope.answers = {};
            $http({
                url: '/'+SECTION+'/api/statistics',
                method: 'POST',
                data: params}).success(function(data) {                
                $scope.LeadTimeChart.loading = false;
                // $scope.HiringEfficiencyChartConfig.serie = [];
                
                $scope.LeadTimeChart.series.push({"name": "No. of demands", "data": data.values, "type": "column"});
                                               
                $scope.LeadTimeChart.xAxis.categories = data.range;
                
                
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
        $scope.LeadTimeChart = {
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