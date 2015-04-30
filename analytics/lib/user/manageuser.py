from analytics.lib.config import appconfig
from analytics.lib.hire_mongo import HireMongo
import bson.objectid as objectid, datetime, pymongo, csv
from analytics.lib.user.user import User
import apostle

class ManageUser:
    def __init__(self):
        self.m = HireMongo(appconfig.ANALYTICS.DB)
        self.collection = self.m.db.users

    def SendNotification(self, ip):
        apostle.domain_key = '8af9f19962458b59682de6079a4c7c46dcd3f0e9'
        apostle.deliver("welcome", {"email": "sreenathp20@gmail.com", "name": "Sreenath P", "ip_address": ip})
        #test = 'hi'
    
    def AddUser(self, data):
        res = {}
        exist = self.collection.find_one({"email": data["email"]})
        #print exist
        if exist != None:
            res["msg"] = "User already exist with email."
        else:
            data = {"email": data["email"], "password": data["password"], "c_date": datetime.datetime.utcnow(), "last_login": False, "role": data["role"], "name": data["name"], "phone": data["phone"], "status": "active"}
            post_id = self.collection.insert(data)
            res["allusers"] = self.GetAllUsers()
            res["msg"] = "success"
        return res

    def GetCredential(self, userid):
        res = {}
        #exist = self.collection.find_one({"_id": objectid.ObjectId(userid)})
        exist = self.collection.find_one({"_id": userid})
        res["email"] = exist["email"]
        res["password"] = exist["password"]
        res["_id"] = exist["_id"]
        res["role"] = exist["role"]
        res["access"] = exist["access"]
        res["main_access"] = "hcl"
        return res

    def GetAllUsers(self):
        users = self.collection.find()
        res = []
        for u in users:
            val = {}
            val["_id"] = str(u["_id"])
            val["email"] = u["email"]
            val["name"] = u["name"]
            val["phone"] = u["phone"]
            val["status"] = u["status"]
            u["_id"] = str(u["_id"])
            u["c_date"] = str(u["c_date"])
            res.append(u)
        return res

    def UpdateUser(self, data):
        doc = self.collection.find_one({"_id": objectid.ObjectId(data["_id"])})
        doc["name"] = data["name"]
        doc["password"] = data["password"]
        doc["phone"] = data["phone"]
        doc["role"] = data["role"]
        doc["name"] = data["name"]
        self.collection.update({"_id": objectid.ObjectId(data["_id"])}, doc)
        users = self.GetAllUsers()
        return users

    def UpdateUserStatus(self, data):
        doc = self.collection.find_one({"_id": objectid.ObjectId(data["_id"])})
        doc["status"] = data["status"]
        self.collection.update({"_id": objectid.ObjectId(data["_id"])}, doc)
        users = self.GetAllUsers()
        return users
