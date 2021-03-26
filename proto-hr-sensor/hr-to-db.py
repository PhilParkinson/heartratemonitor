from pulsesensor import Pulsesensor
from datetime import date
import time
import requests
import json 

# Creates the pulse sensor
p = Pulsesensor()

# Starts reading in the pulse sensor data
p.startAsyncBPM()

# In order to be able to stop the script
try:
    while True:
        # read in the beats per minute
        bpm = p.BPM
        
        # Only readings that are actually being taken should be included.
        # This gets rid of storing data when the sensor doesnt pick any
        # up or is interupted by signal noise.
        if bpm > 0 and bpm < 165:
            print("BPM: %d" % bpm)

            # Gets the time at this current reading
            currentTime = str(date.today())

            # post request url for my server
            # use your computers ip address taht is running the server here
            url = 'http://192.168.0.19:3000/heartrates'

            # Data to be sent with the post request
            myobj = {
                'time': currentTime, # Time from before
                'heartrate':bpm # BPM at the time of reading
                }
            
            # Post requets being sent
            x = requests.post(url, json = myobj)
            print(x)
        else:
            print("No Heartbeat found")
        
        # This tells the sensor to not read in any data for 3 seconds
        # Doing this should give create 20 readings a minute
        time.sleep(3)
except:
    p.stopAsyncBPM()