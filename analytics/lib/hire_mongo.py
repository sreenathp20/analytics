
from mongo import Mongo

class HireMongo:
    def __init__(self, DB):
        m = Mongo()
        self.db = m.client[DB]
        #print "__mongo connect__"

