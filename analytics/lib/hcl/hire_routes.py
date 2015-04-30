import simplejson as json
from hire_dashboard import HireDashboard
from hire_statistics import HireStatistics
from hire_timeseries import HireTimeseries
from pytz import timezone
from datetime import datetime
from dateutil import parser
from operator import itemgetter
from bson.code import Code
import arrow

class HireRoutes:
    def __init__(self):
        print "HireRoutes __init__"

    def Routes(self, request, *args, **kwargs):
        dash_obj = HireDashboard()
        stats_obj = HireStatistics()
        ts_obj = HireTimeseries()
        api = kwargs.get('api', 'dashboard')
        print "api", api
        data = json.loads(request.data)
        action = data["action"]
        res = {}
        if api == 'dashboard':
            if action == "dashboard":
                res = dash_obj.DashboardData()
            elif action == "dashboard_summary":
                res = dash_obj.DashboardSummaryData()
            elif action == "dashboard_country_summary":
                res = dash_obj.DashboardCountrySummaryData()
            elif action == "location_filter":
                loc = data["loc"]
                res = dash_obj.GetLocationData(loc)
            elif action == "atrractiveness":
                res = dash_obj.GetAtrractivenessData()
            elif action == "level_data":
                level = data["level"]
                parent_level = data["parent_level"]
                res["level_count"] = dash_obj.LevelData(level, parent_level = parent_level)
            elif action == "skill_filter":
                skill = data["skill"]
                res = dash_obj.GetSkillFilterData(skill)
            elif action == "level1_filter":
                level = data["level"]
                res = dash_obj.Level1Data(level)
            elif action == "demand_reasons":
                res = dash_obj.DemandReasons()
            elif action == "demand_customers":
                res = dash_obj.DemandCustomers()
        elif api == 'statistics':
            if action == "internal_filling":
                res = stats_obj.GetInternalFillingData()
            elif action == "hiring_efficiency":
                res = stats_obj.HiringEfficiency()
            elif action == "loss_of_revenue":
                res = stats_obj.LoR()
            elif action == "demand_approval":
                res = stats_obj.DemandApproval()
            elif action == "lead_time":
                res = stats_obj.DemandLeadTime()

        elif api == 'timeseries':
            if action == "date_aggregation":
                res = ts_obj.GetDateAggrData()

        return  res

    def StrToDate(self, str):
        try:
            val = arrow.get(str)
            val = val._datetime
        except Exception as e:
            val = None
        return val

    def StrToInt(self, str):
        try:
            val = int(str)
        except Exception as e:
            print e
            val = 0
        return val
