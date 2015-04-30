#!/usr/bin/python
import sys
import logging

activate_this = '/home/analytics/projects/analytics/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

app_path = "/home/analytics/projects/webapp/analytics/"

logging.basicConfig(stream=sys.stderr)
if not app_path in sys.path:
    sys.path.insert(0, app_path)
#sys.path.insert(0,app_path)

#flaskfirst = "/sites/flaskfirst"


from analytics import app as application

#from flask.ext.cache import Cache
#from lib import config, DB, graph_api, skill_score, topics, skill_location, ijd

#cache = Cache(application, config={'CACHE_TYPE': 'filesystem', 'CACHE_DIR': config.CACHE_DIR})

application.secret_key = 'secret'
application.debug = True
