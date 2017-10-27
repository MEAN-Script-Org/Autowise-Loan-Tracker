import os, sys, json, subprocess as sp
import urllib2

directories = [f for f in os.listdir(".") 
                 if os.path.isdir(f)
                 and "test" in f]

# this reduces the recursive search for children
test_files = {  os.path.join(path, f)
                for dir in directories
                for path, dirs, files in os.walk(dir)
                for f in files
                if f.endswith(".js") }

# open gulp if not already there...
try:
    urllib2.urlopen("http://localhost:5001/").read()
except urllib2.URLError:
    print("RUN GULP FIRST IN PARALLEL")
    sys.exit()

for test_file in test_files:
    cmd = ["mocha", os.path.abspath(test_file)]
    # print(" ".join(cmd))
    # process = sp.Popen(["echo", "dale"], shell=True)
    process = sp.Popen(cmd, shell=True)
    process.wait()
