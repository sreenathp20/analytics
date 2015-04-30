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


class HireLog:
    def __init__(self):
        print "HireLog __init__"

    def Log(self, request, *args, **kwargs):


        return  ""