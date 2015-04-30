var myMapper=function () { var range=[{'low': 0, 'up': 10}, {'low': 10, 'up': 50},
                                      {'low': 50, 'up': 100}, {'low': 100, 'up': 200},
                                      {'low': 200, 'up': 'infinity'}
                                      ];
                            if((this.Last_BSD_DT!=null)||(this.First_BSD_DT!=null)){
                                        dateDifference=((this.Last_BSD_DT)- (this.First_BSD_DT))/(24*60*60*1000);
                                        for(var j in range){                                       
                                            if(j<Number((range.length-1))){                                               
                                                if((dateDifference>=range[j]['low'])&&(dateDifference<range[j]['up'])){
                                                    var key=range[j];
                                                    var value=1;
                                                    emit(key,value);
                                                 }
                                                 else {emit(range[j],0)};
                                            }
                                             else{
                                                if((dateDifference>=range[j]['low'])&&(dateDifference<range[j]['up'])){
                                                    var check=1;
                                                    var key=range[j];
                                                    var value=1;
                                                    emit(key,value);
                                                 }
                                                else{emit(range[j],0)};
                                             };
                                          }   
                                 }
                            }
var myReducer=function(key,value){ var reduceVal=Array.sum(value);
                                   return reduceVal;
                                  };

db.cas_requisition1.mapReduce( myMapper,
                     myReducer,
                     {
                     out: {inline: 1},
                      }
                   )
                      