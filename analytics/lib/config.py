import logging, os
from simpleconfigparser import simpleconfigparser
appconfig = simpleconfigparser()

domain = "test"

SECRET_KEY      = 'hireEDGE1analytics'


if domain == "dev":
    f = "dev"
    PROJECT_DIR     = os.path.abspath('.')
elif domain == "test":
    f = "test.hireanalytics.in"
    PROJECT_DIR     = "/home/analytics/projects/webapp/analytics/"
elif domain == "live":
    f = "hireanalytics.in"
    PROJECT_DIR     = "/home/sreenath/projects/webapp/analytics/"

APP_DIR         = os.path.join(PROJECT_DIR, "analytics")

TEMPLATE_DIR    = 'templates'
STATIC_DIR      = 'static'
CACHE_DIR       = APP_DIR+'/cache'
LOGFILE         = APP_DIR+'/log/dashboard.log'
DATA_DIR        = APP_DIR+'/data/'
CACHE_TIME      = 60 * 60 * 24 * 365



appconfig.read(APP_DIR+"/conf/"+f+".exp")

js_config = {}
js_config["JS_DEBUG"]   = appconfig.JS.JS_DEBUG
js_config["MINJS"]      = appconfig.JS.MINJS
js_config["JS_VER"]     = appconfig.JS.JS_VER
