import simplejson as json
import config, hire_keen
from pytz import timezone
from openpyxl import load_workbook, Workbook
from datetime import datetime
from mongo import Mongo
from dateutil import parser
import arrow
from operator import itemgetter
from bson.code import Code
import pandas as pd
from numpy import unique


class HireHcl:
    def __init__(self):
        self.hk = hire_keen.HireKeen()
        m = Mongo()
        db = m.client.hirealchemy_hcl
        self.collection = db.cas_requisition1
        self.reducer = Code("""
                   function(curr, result){
                        result.count++;
                   }
                    """)
        print "__init__"

    def Routes(self, request, *args, **kwargs):
        api = kwargs.get('api', 'dashboard')
        data = json.loads(request.data)
        action = data["action"]
        res = {}
        if api == 'dashboard':
            if action == "dashboard":
                res = self.DashboardData()
            if action == "location_filter":
                loc = data["loc"]
                res = self.GetLocationData(loc)
            if action == "atrractiveness":
                res = self.GetAtrractivenessData()
            if action == "level_data":
                level = data["level"]
                parent_level = data["parent_level"]
                res["level_count"] = self.LevelData(level, parent_level = parent_level)
            if action == "skill_filter":
                skill = data["skill"]
                res = self.GetSkillFilterData(skill)
            if action == "internal_filling":
                res = self.GetInternalFillingData()
            if action == "level1_filter":
                level = data["level"]
                res = self.Level1Data(level)
        elif api == 'statistics':
            if action == "hiring_efficiency":
                res = self.HiringEfficiency()
            elif action == "maximum_demands":
                res = self.MaximumDemands()

        return  res

    def MaximumDemands(self):

        return ""

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

    def LevelData(self, levelarg, *args, **kwargs):

        parent_level = kwargs.get('parent_level', None)
        print "parent_level", parent_level
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
        #print df
        #exit()
        # countries = df['country'].unique()
        # columns = df['Status'].unique()
        # foo_df = pd.DataFrame(columns=columns)
        # final_df = []
        # countries_series = df.groupby(['country','Status']).all()
        # final_df = []
        # print df[(df['country']=='INDIA' and df['Status']=='Approved')]
        # query_str = "country == ",str() and Status == 'Approved'"
        #print df.query(query_str)
        #foo = pd.DataFrame(coulmns=unique(df.Status))
        #foo.loc[-1] = ['approved,]
        #exit()
        # for cntry in countries:
        #     entry = df[df.country==cntry]
        #     for ele in entry.values:
        #         if ele[2] == 'Approved':
        #             approved = ele[1]
        #         if ele[2] == 'Referback':
        #             refer_back = ele[1]
        #         if ele[2] == 'Open':
        #             open = ele[1]
        #     row = pd.DataFrame(coulmns=unique(df.Status))
        #      row.index = cntry
        #     if not approved:
        #
        #     row['approved'] = approved
        #     row['refer_back'] =
        #pd.concat(final_df)

        #for d in df:
        #print df.country.unique()
        #print df.Status.unique()
        #print df.where(df.Status == "Approved")
        country = df['country'].unique()
        # print df['status'].unique()
        # for c in country:
        #     print c
        #print df.select(lambda count: count == 5, axis=1)
        #df1 = pd.DataFrame()
        #indexed_df = df1.set_index(df['Status'].unique())
        #print "indexed_df", indexed_df

        #print "country_count", country_count
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


    def RecordData(self):
        wb = load_workbook(filename = config.DATA_DIR+'CAS - Requisition Dump.xlsx')
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



    