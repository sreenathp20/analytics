# -*- coding: utf-8 -*-
# created by Sreenath P
from analytics import app
app.run(port=1120, debug=True, host='0.0.0.0')
# import sys
# sys.dont_write_bytecode = True
#
# #Wsgi apache server
# from tornado.wsgi import WSGIContainer
# from tornado.httpserver import HTTPServer
# from tornado.ioloop import IOLoop
#
# http_server = HTTPServer(WSGIContainer(app))
# http_server.listen(5000)
# IOLoop.instance().start()
