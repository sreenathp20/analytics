import simplejson as json
from analytics.lib.config import appconfig
from analytics.lib.hire_mongo import HireMongo
from pytz import timezone
from openpyxl import load_workbook, Workbook
from datetime import datetime
from dateutil import parser
import arrow
from operator import itemgetter
from bson.code import Code
import pandas as pd
from numpy import unique

class HireStatistics:
    def __init__(self):
        m = HireMongo(appconfig.HCL.DB)
        self.collection = m.db.cas_requisition1
        #print "__init__"

    def GetInternalFillingData(self):
        reducer = Code("""
                   function ( curr, result ) {
                       result.count++;
                       result.Internal_Filled += curr.Internal_Filled;
                       result.Vacancy += curr.Vacancy;
                    }
                    """)
        data = {}
        attr_count = self.collection.group(key={"skills":1}, condition={}, initial={"count": 0, "Internal_Filled": 0, "Vacancy": 0}, reduce=reducer)
        attr_count = sorted(attr_count, key=itemgetter('count'), reverse=True)
        data["skills"] = []
        data["total"] = []
        data["Internal_Filled"] = []
        data["Vacancy"] = []
        data["perc"] = []
        for ac in attr_count:
            data["skills"].append(ac["skills"])
            data["total"].append(ac["count"])
            data["Internal_Filled"].append(ac["Internal_Filled"])
            data["Vacancy"].append(ac["Vacancy"])
            perc = 0
            if ac["Vacancy"]:
                perc = (ac["Internal_Filled"] / ac["Vacancy"]) * 100
            data["perc"].append(perc)

        data1 = {}
        data1["intr_count"] = data
        data1["attr_count"] = self.AttrData()
        return data1

    def AttrData(self):
        reducer = Code("""
                   function ( curr, result ) {
                       result.count++;
                       result.External_Offered += curr.External_Offered;
                       result.External_Joined += curr.External_Joined;
                    }
                    """)
        data = {}
        attr_count = self.collection.group(key={"skills":1}, condition={}, initial={"count": 0, "External_Offered": 0, "External_Joined": 0}, reduce=reducer)
        attr_count = sorted(attr_count, key=itemgetter('count'), reverse=True)
        data["skills"] = []
        data["total"] = []
        data["External_Offered"] = []
        data["External_Joined"] = []
        data["perc"] = []
        for ac in attr_count:
            data["skills"].append(ac["skills"])
            data["total"].append(ac["count"])
            data["External_Offered"].append(ac["External_Offered"])
            data["External_Joined"].append(ac["External_Joined"])
            perc = 0
            if ac["External_Offered"]:
                perc = (ac["External_Joined"] / ac["External_Offered"]) * 100
            data["perc"].append(perc)
        return data


    def LoR(self):
        r = [{'low': 0, 'up': 1, 'key': '0 Days'}, {'low': 1, 'up': 10, 'key': '1-10 Days'}, {'low': 10, 'up': 20, 'key': '10-20 Days'}, {'low': 20, 'up': 50, 'key': '20-50 Days'}, {'low': 50, 'up': 'infinity', 'key': '> 50 Days'}]
        map = self.DateDiffMap("this.Last_BSD_DT", "this.First_BSD_DT", r)
        reduce = Code("function(key,value){ var reduceVal=Array.sum(value);"
                        "return reduceVal;"
                    "};")
        result = self.collection.map_reduce(map, reduce, "map_loss_of_revenue")
        #print "result", result
        res = {}
        res["range"] = []
        res["values"] = []
        for r in result.find():
            #print "res", r
            res["range"].append(r["_id"]["key"])
            res["values"].append(r["value"])
        return res

    def DemandApproval(self):
        r = [{'low': 0, 'up': 1, 'key': '0 Days'}, {'low': 1, 'up': 10, 'key': '1-10 Days'}, {'low': 10, 'up': 20, 'key': '10-20 Days'}, {'low': 20, 'up': 50, 'key': '20-50 Days'}, {'low': 50, 'up': 'infinity', 'key': '> 50 Days'}]
        map = self.DateDiffMap("this.ApprovalDate", "this.RequisitionDate", r)
        reduce = Code("function(key,value){ var reduceVal=Array.sum(value);"
                        "return reduceVal;"
                    "};")
        result = self.collection.map_reduce(map, reduce, "map_demand_approval")
        #print "result", result
        res = {}
        res["range"] = []
        res["values"] = []
        for r in result.find():
            res["range"].append(r["_id"]["key"])
            res["values"].append(r["value"])

        return res

    def DemandLeadTime(self):
        r = [{'low': 0, 'up': 1, 'key': '0 Days'}, {'low': 1, 'up': 10, 'key': '1-10 Days'}, {'low': 10, 'up': 20, 'key': '10-20 Days'}, {'low': 20, 'up': 50, 'key': '20-50 Days'}, {'low': 50, 'up': 'infinity', 'key': '> 50 Days'}]
        map = self.DateDiffMap("this.ExpectedClosureDate", "this.RequisitionDate", r)
        reduce = Code("function(key,value){ var reduceVal=Array.sum(value);"
                        "return reduceVal;"
                    "};")
        result = self.collection.map_reduce(map, reduce, "map_lead_time")
        #print "result", result
        res = {}
        res["range"] = []
        res["values"] = []
        for r in result.find():
            res["range"].append(r["_id"]["key"])
            res["values"].append(r["value"])

        return res

    def HiringEfficiency(self):
        reducer = Code("""
                   function ( curr, result ) {
                        result.count++;
                        result.Total_forwarded += curr['Total forwarded'];
                        result.Total_Final_Select += curr['Total Final Select'];
                    }
                    """)
        data = {}
        attr_count = self.collection.group(key={"skills":1}, condition={}, initial={ "count": 0, "Total_forwarded": 0, "Total_Final_Select": 0}, reduce=reducer)
        attr_count = sorted(attr_count, key=itemgetter('count'), reverse=True)
        data["skills"] = []
        data["total"] = []
        data["Total_forwarded"] = []
        data["Total_Final_Select"] = []
        data["perc"] = []
        for ac in attr_count:
            data["skills"].append(ac["skills"])
            data["total"].append(ac["count"])
            data["Total_forwarded"].append(ac["Total_forwarded"])
            data["Total_Final_Select"].append(ac["Total_Final_Select"])
            perc = 0
            if ac["Total_forwarded"]:
                perc = (ac["Total_Final_Select"] / ac["Total_forwarded"]) * 100
            data["perc"].append(perc)

        return data

    def DateDiffMap(self, max_date, min_date, r):
        r = json.dumps(r)
        #print "r", r
        map = Code("function () { var range= "+r+";"
                            "var max_date = "+max_date+";"
                            "var min_date = "+min_date+";"
                            "if((max_date!=null)||(min_date!=null)){"
                                        "dateDifference=((max_date)- (min_date))/(24*60*60*1000);"
                                        "for(var j in range){"
                                            "if(j<Number((range.length-1))){"
                                                "if((dateDifference>=range[j]['low'])&&(dateDifference<range[j]['up'])){"
                                                    "var key=range[j];"
                                                    "var value=1;"
                                                    "emit(key,value);"
                                                 "}"
                                                 "else {emit(range[j],0)};"
                                            "}"
                                             "else{"
                                                "if((dateDifference>=range[j]['low'])&&(dateDifference<range[j]['up'])){"
                                                    "var check=1;"
                                                    "var key=range[j];"
                                                    "var value=1;"
                                                    "emit(key,value);"
                                                 "}"
                                                "else{emit(range[j],0)};"
                                             "};"
                                          "}"
                                 "}"
                            "}")
        #print "map", map
        return map