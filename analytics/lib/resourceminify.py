import os, config as conf
from slimit import minify
from rcssmin import cssmin

jspath = conf.APP_DIR+"/static/new/js"
csspath = conf.APP_DIR+"/static/new/css"

def minifyCSSProc(srcText):
    return cssmin(srcText, keep_bang_comments=True)

def minifyJSProc(srcText):
    return minify(srcText, mangle=True, mangle_toplevel=True)

def doProcessFiles(minifyProc, sourcePaths, header, destPath, minPath):
    print "Combining to %s and %s" % (destPath,minPath)
    f = open(destPath, 'w')
    mf = None
    try:
        mf = open(minPath, 'w')
        mf.write(header)
        for srcFile in sourcePaths:
            print(srcFile)
            with open(srcFile) as inputFile:
                srcText = inputFile.read()
                minText = minifyProc(srcText)
            f.write(srcText)
            mf.write(minText)
    finally:
        f.close()
        if mf and not mf.closed:
            mf.close()

def doJSMin(sourcePaths, header, destPath, minPath):
    return doProcessFiles(minifyJSProc, sourcePaths, header, destPath, minPath)

def doCSSMin(sourcePaths, destPath, minPath):
    return doProcessFiles(minifyCSSProc, sourcePaths, '', destPath, minPath)




jsHeaderPath = jspath+"/jslicenses.js"

jsDestPath = jspath+"/analytics.js"
jsMinPath = jspath+"/analytics.min.js"

jsLibDestPath = jspath+"/lib.js"
jsLibMinPath = jspath+"/lib.min.js"

jsLibSources = [
    jspath+"/jquery-1.11.0.min.js",
    jspath+"/jquery-migrate-1.2.1.min.js",
    jspath+"/jquery-ui-1.10.3.custom.min.js",
    jspath+"/bootstrap.min.js",
    jspath+"/bootstrap-hover-dropdown.min.js",
    jspath+"/jquery.slimscroll.min.js",
    jspath+"/jquery.blockui.min.js",
    jspath+"/jquery.cokie.min.js",
    jspath+"/jquery.uniform.min.js",
    jspath+"/metronic.js",
    jspath+"/layout.js",
    jspath+"/demo.js",
    jspath+"/lock.js",
    jspath+"/jquery.backstretch.min.js",

    jspath+"/angular/angular.min.js",
    jspath+"/angular/angular-route.min.js",
    jspath+"/highstock.src.js",
    jspath+"/angular/highcharts-ng.js"]

jsSources = [
    jspath+"/angular/app.js",
    jspath+"/angular/controllers/summary.js",
    jspath+"/angular/controllers/attractiveness.js",
    jspath+"/angular/controllers/statistics.js",
	jspath+"/angular/controllers/timeseries.js"
]

cssDestPath = csspath+"/allmy.css"
cssMinPath = csspath+"/allmy.min.css"

cssSources = [
    csspath+"/font-awesome.min.css",
    csspath+"/bootstrap.min.css",
    csspath+"/uniform.default.css",
    csspath+"/components.css",
    csspath+"/plugins.css",
    csspath+"/layout.css",
    csspath+"/red-sunglo.css",
    csspath+"/default.css",
    csspath+"/custom.css",
    #csspath+"/animate.css",
    csspath+"/animate_old.css"
]

jsHeader = ''
with open(jsHeaderPath) as f:
    jsHeader = f.read()
#doJSMin(jsLibSources, jsHeader, jsLibDestPath, jsLibMinPath)
#doCSSMin(cssSources, cssDestPath, cssMinPath)

doJSMin(jsSources, jsHeader, jsDestPath, jsMinPath)