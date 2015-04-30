from analytics.lib import hire_mongo
from analytics.lib.hire_mongo import HireMongo
from analytics.lib.config import appconfig
import csv, datetime, pymongo
import bson.objectid as objectid

class User:
    def __init__(self, email, password):
        #print "appconfig.HCL.DB", appconfig.HCL.DB
        self.m = HireMongo(appconfig.ANALYTICS.DB)
        self.collection = self.m.db.users
        self.email = email
        self.password = password
        self.get_id()
        #print self.CreateUser()

    def is_anonymous(self):
        return True

    def is_authenticated(self):
        exist = self.collection.find({"$and": [{"$or": [{"email": self.email}, {"_id": self.email}]}, {"password": self.password}]})
        if exist.count() > 0:
            self.role = exist[0]["role"]
            return True
        else:
            return False

    def is_active(self):
        exist = self.collection.find({"$and": [{"$or": [{"email": self.email}, {"_id": self.email}]}, {"password": self.password}, {"status": "active"}]})
        #exist = self.collection.find({"_id": self.email, "password": self.password, "status": "active"})
        if exist.count() > 0:
            return True
        else:
            return False

    def get_id(self):
        #print "email", self.email
        exist = self.collection.find({"$and": [{"$or": [{"email": self.email}, {"_id": self.email}]}, {"password": self.password}]})
        #exist = self.collection.find({"_id": self.email, "password": self.password})
        if exist.count() > 0:
            return unicode(exist[0]["_id"])
        else:
            return None

    def CreateUser(self):
        exists = self.collection.find({"email": "sreenathp20@gmail.com"})
        cnt = exists.count()
        post_id = None
        if cnt == 0:
            data = {"email": "sreenathp20@gmail.com", "password": "123456", "c_date": datetime.datetime.utcnow(), "last_login": False, "role": "admin", "name": "sreenath", "phone": "9902616691", "status": "active"}
            post_id = self.collection.insert(data)
        return post_id

    def AllPendingConnections(self):
        collection = self.m.skill_connection
        conn = collection.find({"status": "pending"})
        res = []
        for c in conn:
            #print c
            val = {}
            val["fskill"] = c["fskill"]
            val["tskill"] = c["tskill"]
            val["user_id"] = c["user_id"]
            val["a_date"] =  str(c["a_date"])
            val["a_id"] = c["a_id"]
            val["c_date"] = str(c["c_date"])
            val["_id"] = str(c["_id"])
            val["status"] = c["status"]
            res.append(val)
        return res

    def ChangeStatus(self, data):
        id = data["_id"]
        status = data["status"]
        collection = self.m.skill_connection
        doc = collection.find_one({"_id": objectid.ObjectId(id)})
        doc["status"] = status
        collection.update({"_id": objectid.ObjectId(id)}, doc)
        if status == "approve":
            self.AddConToNeo(doc)
        res = self.AllPendingConnections()
        return res





