from analytics import app, login_required
from flask import render_template, redirect, request, session, jsonify

import simplejson as json
from bson import json_util
from analytics.lib import config
from analytics.lib.hcl import hire_routes


@app.route("/<section>/")
@login_required
def home_hcl(section):
    print "section", section
    return render_template('pages/'+section+'/layout_blank_page.html', section=section)

@app.route("/<section>/<page>")
@login_required
def dashboard(section, page):
    return render_template('pages/'+section+'/'+page+'.html')

@app.route("/<section>/api/dashboard", methods=['GET', 'POST'])
@login_required
def api_dashboard(section):
    hcl = hire_routes.HireRoutes()
    result = hcl.Routes(request)
    return json.dumps(result)

@app.route("/<section>/api/statistics", methods=['GET', 'POST'])
@login_required
def api_statistics(section):
    hr = hire_routes.HireRoutes()
    result = hr.Routes(request, api='statistics')
    return json.dumps(result)

@app.route("/<section>/api/timeseries", methods=['GET', 'POST'])
@login_required
def api_timeseries(section):
    hr = hire_routes.HireRoutes()
    result = hr.Routes(request, api='timeseries')
    return json.dumps(result)

@app.route('/<section>/app.appcache')
def Appcache(section, action=None):
    return render_template('pages/'+section+'/app.appcache')

@app.route('/<section>/appcache.html')
def AppcacheHtml(section, action=None):
    return render_template('pages/'+section+'/appcache.html')


