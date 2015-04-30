import pymongo, config, csv, time
from flask.ext.cache import Cache
from flask import jsonify

class Mongo:
	def __init__(self):
		self.client = pymongo.MongoClient()

	