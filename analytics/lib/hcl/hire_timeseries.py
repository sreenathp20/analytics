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

class HireTimeseries:
    def __init__(self):
        m = HireMongo(appconfig.HCL.DB)
        self.collection = m.db.cas_requisition1
        #print "__init__"

    def GetDateAggrData(self):
        reducer = Code("""
                   function(obj, prev) {prev.count++;}
                    """)
        keyf = Code("""
                    function(doc) {
                        var date = new Date(doc.RequisitionDate);
                        //var month =
                        var dateKey = date.getFullYear()+'-'+(date.getMonth()+1)+"-"+date.getDate();
                        return {'day':dateKey};
                    }
                """)
        data = {}
        ts_data = self.collection.group(key = keyf, condition={}, initial={"count": 0}, reduce=reducer)
        # attr_count = sorted(attr_count, key=itemgetter('count'), reverse=True)
        data["day"] = []
        data["count"] = []
        for sd in ts_data:
            data["day"].append(sd["day"])
            data["count"].append(sd["count"])
        return data