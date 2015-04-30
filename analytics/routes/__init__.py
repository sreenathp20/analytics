from flask import Flask, render_template, request, jsonify
from flask.ext.cache import Cache
from flask.ext.login import LoginManager, login_user, logout_user, current_user, login_required
import  logging, simplejson as json, os, sys, urlparse
from ast import literal_eval
from analytics.lib import config as conf

#if conf.domain == "dev":
    #from analytics.lib import resourceminify

path = os.path.join('.', os.path.dirname(__file__), 'static/js/sijax/')
app = Flask(__name__, template_folder = conf.TEMPLATE_DIR, static_folder = conf.STATIC_DIR)

app.current_user = current_user

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_MODEL = os.path.join(APP_ROOT, 'lib')

#print "APP_ROOT", APP_ROOT
#print "APP_MODEL", APP_MODEL

#print "conf.PROJECT_DIR", conf.PROJECT_DIR
#print "conf.SECRET_KEY", conf.appconfig.APP.SECRET_KEY

#print urlparse(request.META.get('HTTP_REFERER')).hostname

#Reading ini extension file

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

#logging.basicConfig(format='%(asctime)s|%(levelname)s|%(message)s', filemode = 'w', filename = config.LOGFILE,level = config.LOGLEVEL, datefmt = '%m/%d/%Y %H:%M:%S')
cache = Cache(app, config={'CACHE_TYPE': 'filesystem', 'CACHE_DIR': conf.CACHE_DIR})

cache.clear()

app.secret_key = conf.SECRET_KEY

app.config['CONFIG']    = conf.js_config

#from analytics.routes.login import configroutes as config
from analytics.routes.login import baseroutes
from analytics.routes.hcl import baseroutes


if __name__ == "__main__":	
    app.debug = config.DEBUG
    app.run(host = '0.0.0.0', port = 1110)
    #app.run()
