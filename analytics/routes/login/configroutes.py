from analytics import app, login_user, login_required, logout_user, login_manager, current_user
from flask import render_template, redirect, request, session, jsonify
from functools import wraps
import simplejson as json
from urlparse import urlparse
from analytics.lib.user.user import User
from analytics.lib.user.manageuser import ManageUser
from bson import json_util

def load_config(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        domain = urlparse(request.url).netloc
        f = domain
        if domain == "localhost:1110" or domain == "127.0.0.1:1110":
            f = "dev"
        return func(*args, **kwargs)
    return decorated_function

