import os, sys, json, subprocess as sp
import urllib2

directories = [f for f in os.listdir(".") 
                 if os.path.isdir(f)
                 and "test" in f]

# Load Mocha files
mocha_files = {  os.path.join(path, f)
                for dir in directories
                for path, dirs, files in os.walk(dir)
                for f in files
                if f.endswith(".js") and f.startswith("mocha") }
                
# Load Protractor files (just the config file)
prtctr_files = {  os.path.join(path, f)
                for dir in directories
                for path, dirs, files in os.walk(dir)
                for f in files
                if f == "protractor.config.js" }

# open ONLY if gulp is already there...
try:
    # HEAD request
    urllib2.urlopen("http://localhost:5001/").info()
except urllib2.URLError:
    print("RUN GULP IN PARALLEL FIRST")
    sys.exit()

# Execute Protractor tests (just run the config file)
for test_file in prtctr_files:
    cmd = ["protractor", os.path.abspath(test_file)]
    process = sp.Popen(cmd, shell=True)
    process.wait()

# Execute mocha tests
for test_file in mocha_files:
    cmd = ["mocha", os.path.abspath(test_file)]
    process = sp.Popen(cmd, shell=True)
    process.wait()