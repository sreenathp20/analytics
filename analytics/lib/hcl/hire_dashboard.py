import simplejson as json
from analytics.lib.config import appconfig
from analytics.lib.hire_mongo import HireMongo
from pytz import timezone
from openpyxl import load_workbook, Workbook
from datetime import datetime
from dateutil import parser
#import arrow
from operator import itemgetter
from bson.code import Code
import pandas as pd
from numpy import unique

class HireDashboard:
    def __init__(self):
        m = HireMongo(appconfig.HCL.DB)
        self.collection = m.db.cas_requisition1
        self.reducer = Code("""
                   function(curr, result){
                        result.count++;
                   }
                    """)
        #print "__init__"

    def LevelData(self, levelarg, *args, **kwargs):
        parent_level = kwargs.get('parent_level', None)
        #print "parent_level", parent_level
        if levelarg == "Level_1":
            cond = {}
        elif levelarg == "Level_2":
            cond = {"Level_1": parent_level}
        elif levelarg == "Level_3":
            cond = {"Level_2": parent_level}
        elif levelarg == "Level_4":
            cond = {"Level_3": parent_level}

        reducer = Code("""
                   function ( curr, result ) {
                       result.count++;
                    }
                    """)
        data = {}
        level_count = self.collection.group(key={levelarg:1, "Status": 1}, condition=cond, initial={"count": 0}, reduce=reducer)
        level_count = sorted(level_count, key=itemgetter('count'), reverse=True)

        fields = [levelarg, "count", "Status"]
        df = pd.DataFrame(list(level_count), columns = fields)
        df = df.sort(['count'], ascending=[0])
        level = df[levelarg].unique()

        dict = {}
        for cc in level_count:
            #print cc
            if cc["Status"] not in dict:
                dict[cc["Status"]] = {}
            dict[cc["Status"]][cc[levelarg]] = cc["count"]
        #print dict
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in level:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)
        j["level"] = list(level)
        data = j
        return data

    def GetSkillFilterData(self, skill):
        data = {}
        skill_loc_count = self.collection.group(key={"country":1,"Status": 1}, condition={"skills": skill}, initial={"count": 0}, reduce=self.reducer)
        skill_loc_count = sorted(skill_loc_count, key=itemgetter('count'), reverse=True)

        fields = ["country", "count", "Status"]
        df = pd.DataFrame(list(skill_loc_count), columns = fields)
        df = df.sort(['count'], ascending=[0])
        #print df
        country = df['country'].unique()
        dict = {}
        for lc in skill_loc_count:
            #print lc
            if lc["Status"] not in dict:
                dict[lc["Status"]] = {}
            dict[lc["Status"]][lc["country"]] = lc["count"]
        #print dict
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in country:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)
        j["country"] = list(country)
        #j["total"] = loc_count1
        data["skills_count"] = j
        return data

    def DemandReasons(self):
        data = {}
        data["reason_count"] = {}
        data["reason_count"]["reasons"] = []
        data["reason_count"]["count"] = []
        res = self.collection.group(key={"RequisitionSource":1}, condition={}, initial={"count": 0}, reduce=self.reducer)
        for r in res:
            data["reason_count"]["reasons"].append(r["RequisitionSource"])
            data["reason_count"]["count"].append(r["count"])

        return data

    def DemandCustomers(self):
        data = {}
        customer_count = self.collection.group(key={"Customer":1,"Status": 1}, condition={}, initial={"count": 0}, reduce=self.reducer)
        customer_count = sorted(customer_count, key=itemgetter('count'), reverse=True)

        fields = ["Customer", "count", "Status"]
        df = pd.DataFrame(list(customer_count), columns = fields)
        df = df.sort(['count'], ascending=[0])
        customer = df['Customer'].unique()
        dict = {}
        for lc in customer_count:
            #print cc
            if lc["Status"] not in dict:
                dict[lc["Status"]] = {}
            dict[lc["Status"]][lc["Customer"]] = lc["count"]
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in customer:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)

        j["customers"] = list(customer)

        #removing others from data
        del j["customers"][2]
        del j["Approved"][2]
        del j["Refer Back"][2]
        del j["Open"][2]

        cnt = 5
        j["customers"] = j["customers"][:cnt]
        j["Approved"] = j["Approved"][:cnt]
        j["Refer Back"] = j["Refer Back"][:cnt]
        j["Open"] = j["Open"][:cnt]

        data["customers_count"] = j
        return data

    def GetAtrractivenessData(self):
        data = {}
        skills_count = self.collection.group(key={"skills":1,"Status": 1}, condition={}, initial={"count": 0}, reduce=self.reducer)
        skills_count = sorted(skills_count, key=itemgetter('count'), reverse=True)

        # skills_count1 = self.collection.group(key={"PersonalSubArea":1}, condition={"country": loc}, initial={"count": 0}, reduce=self.reducer)
        # skills_count1 = sorted(skills_count1, key=itemgetter('count'), reverse=True)

        fields = ["skills", "count", "Status"]
        df = pd.DataFrame(list(skills_count), columns = fields)
        df = df.sort(['count'], ascending=[0])
        skills = df['skills'].unique()
        dict = {}
        for lc in skills_count:
            #print cc
            if lc["Status"] not in dict:
                dict[lc["Status"]] = {}
            dict[lc["Status"]][lc["skills"]] = lc["count"]
        #print dict
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in skills:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)

        j["skills"] = list(skills)
        #j["total"] = loc_count1
        data["skills_count"] = j
        return data

    def Level1Data(self, level):
        reducer = Code("""
                   function ( curr, result ) {
                       result.count++;
                    }
                    """)
        data = {}
        level_count = self.collection.group(key={"Level_2":1, "Status": 1}, condition={"Level_1": level}, initial={"count": 0}, reduce=reducer)
        level_count = sorted(level_count, key=itemgetter('count'), reverse=True)


        fields = ["Level_2", "count", "Status"]
        df = pd.DataFrame(list(level_count), columns = fields)
        df = df.sort(['count'], ascending=[0])
        level = df['Level_2'].unique()

        dict = {}
        for cc in level_count:
            #print cc
            if cc["Status"] not in dict:
                dict[cc["Status"]] = {}
            dict[cc["Status"]][cc["Level_2"]] = cc["count"]
        #print dict
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in level:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)
        j["level"] = list(level)
        data = j
        return data

    def GetLocationData(self, loc):
        data = {}
        loc_count = self.collection.group(key={"PersonalSubArea":1, "Status": 1}, condition={"country": loc}, initial={"count": 0}, reduce=self.reducer)
        loc_count = sorted(loc_count, key=itemgetter('count'), reverse=True)

        loc_count1 = self.collection.group(key={"PersonalSubArea":1}, condition={"country": loc}, initial={"count": 0}, reduce=self.reducer)
        loc_count1 = sorted(loc_count1, key=itemgetter('count'), reverse=True)

        fields = ["PersonalSubArea", "count", "Status"]
        df = pd.DataFrame(list(loc_count1), columns = fields)
        df = df.sort(['count'], ascending=[0])
        PersonalSubArea = df['PersonalSubArea'].unique()
        dict = {}
        for lc in loc_count:
            #print cc
            if lc["Status"] not in dict:
                dict[lc["Status"]] = {}
            dict[lc["Status"]][lc["PersonalSubArea"]] = lc["count"]
        #print dict
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in PersonalSubArea:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)

        j["PersonalSubArea"] = list(PersonalSubArea)
        j["total"] = loc_count1

        data["loc_count"] = j
        return data

    def DashboardData(self):
        data = {}
        data["tot_count"] = self.collection.find().count()
        reducer = Code("""
                   function(curr, result){
                        result.count++;
                   }
                    """)
        reducer1 = Code("""
                   function(curr, result){
                        result.count++;
                   }
                    """)
        data["status_count"] = self.collection.group(key={"Status":1}, condition={}, initial={"count": 0}, reduce=reducer)
        country_count = self.collection.group(key={"country":1, "Status": 1}, condition={}, initial={"count": 0}, reduce=reducer1)
        country_count = sorted(country_count, key=itemgetter('count'), reverse=True)

        country_count1 = self.collection.group(key={"country":1}, condition={}, initial={"count": 0}, reduce=reducer1)
        country_count1 = sorted(country_count1, key=itemgetter('count'), reverse=True)

        fields = ["country", "count", "Status"]
        df = pd.DataFrame(list(country_count), columns = fields)
        df = df.sort(['count'], ascending=[0])

        country = df['country'].unique()
        dict = {}
        for cc in country_count:
            #print cc
            if cc["Status"] not in dict:
                dict[cc["Status"]] = {}
            dict[cc["Status"]][cc["country"]] = cc["count"]
        #print dict
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in country:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)
        j["country"] = list(country)
        j["total"] = country_count1

        j["country"] = j["country"][:4]
        j["Approved"] = j["Approved"][:4]
        j["Refer Back"] = j["Refer Back"][:4]
        j["Open"] = j["Open"][:4]
        data["country_count"] = j
        #exit()
        return data

    def DashboardCountrySummaryData(self):
        data = {}
        data["tot_count"] = self.collection.find().count()
        reducer1 = Code("""
                   function(curr, result){
                        result.count++;
                   }
                    """)
        country_count = self.collection.group(key={"country":1, "Status": 1}, condition={}, initial={"count": 0}, reduce=reducer1)
        country_count = sorted(country_count, key=itemgetter('count'), reverse=True)

        country_count1 = self.collection.group(key={"country":1}, condition={}, initial={"count": 0}, reduce=reducer1)
        country_count1 = sorted(country_count1, key=itemgetter('count'), reverse=True)

        fields = ["country", "count", "Status"]
        df = pd.DataFrame(list(country_count), columns = fields)
        df = df.sort(['count'], ascending=[0])

        country = df['country'].unique()
        dict = {}
        for cc in country_count:
            #print cc
            if cc["Status"] not in dict:
                dict[cc["Status"]] = {}
            dict[cc["Status"]][cc["country"]] = cc["count"]
        #print dict
        j = {}
        for d in dict:
            if d not in j:
                j[d] = []
            for c in country:
                if c in dict[d]:
                    j[d].append(dict[d][c])
                else:
                    j[d].append(0)
        j["country"] = list(country)
        j["total"] = country_count1

        j["country"] = j["country"][:4]
        j["Approved"] = j["Approved"][:4]
        j["Refer Back"] = j["Refer Back"][:4]
        j["Open"] = j["Open"][:4]
        data["country_count"] = j
        #exit()
        return data

    def DashboardSummaryData(self):
        data = {}
        data["tot_count"] = self.collection.find().count()
        reducer = Code("""
                   function(curr, result){
                        result.count++;
                   }
                    """)
        data["status_count"] = self.collection.group(key={"Status":1}, condition={}, initial={"count": 0}, reduce=reducer)

        return data

    def RecordData(self):
        wb = load_workbook(filename = appconfig.DATA_DIR+'CAS - Requisition Dump.xlsx')
        sheet_ranges = wb['Sheet1']
        j = 0
        cols = []
        for rows in sheet_ranges.rows:
            if j == 0:
                #print rows
                for row in rows:
                    col = row.value
                    #print col
                    cols.append(col)
                break
        #print cols
        #exit()
        date_keys = ["ExpectedClosureDate", "Req_Resubmission_dt", "Last_BSD_DT", "TPG_To_TAG_Assign_dt", "Last_ReferBack_DT", "Approver1_dt", "First_Resubmission_dt", "Req_Close_dt", "BillingStartDate", "First_ReferBack_DT", "RequisitionDate", "First_BSD_DT", "Resource_Availability_Date", "TAG_Exe_Assign_dt", "Approver2_dt", "Last_Resubmission_dt", "ApprovalDate", "Resource_Project_Allocation_Date", "Approver3_dt", "ValidTillDate"]
        int_keys = ["Balance_Postions", "iEmpGroup", "iRoleID", "Internal_Filled", "InitialDemand", "Total Shortlisted", "iBillingTypeId", "External_Joined", "Vacancy", "iStatusId", "Total Blocked", "External_Offered", "iRequistionSource", "ReferBackCount", "Offer_Declined", "Total Final Select", "Total Rejected", "Total forwarded", "actionablePosition", "age", "Total Attached", "iCountryId"]
        i = 0
        for rows in sheet_ranges.rows:
            print "#####################################################"
            if i > 0:
                val = {}
                k = 0
                for row in rows:
                    key = cols[k]
                    value = row.value

                    if key in date_keys:
                        value = self.StrToDate(value)

                    if key in int_keys:
                        #print "value", value
                        value = self.StrToInt(value)
                        #print "value", value
                    print "key", key
                    print "value", value
                    # if value == "SL C/SL C/2014/339221":
                    #     exit()
                    #print "value", value
                    val[key] = value
                    k = k+1
                #print val
                #self.hk.record_keen("cas_requisition1", val)
                data = val
                post_id = self.collection.insert(data)
                #exit()
            i = i+1

        return ""



    