#!/usr/bin/python
# Version 1

import os
import sys
import signal
import re
from os import fsync


def signal_handler(signal, frame):
    print('\nYou pressed Ctrl+C! Bye')
    sys.exit(0)

def printmenu():
    os.system('cls' if os.name == 'nt' else 'clear')
    os.system('cls') # for Windows
    #os.system('clear')

    print (35 * '-')
    print ("Power Index Log Config Builder")
    print ("Lets Get Started!")
    print (35 * '-')
    print ("1. Build Your Config")
    print ("0. Quit")
    print (35 * '-')
    choice = raw_input('Enter your choice [0-1] : ')
    try:
        choice = int(choice)
    except:
        printmenu()
    print (35 * '-')

    if choice == 1:
        configBuilder()
    elif choice == 0:
        cleanExit("bye")
    else:
        printmenu()


def configBuilder():

    "Calculates the number of accounts needed for a specific step value to achiece a specific scan time"
    username = raw_input("Your username where that is logged into the game: ")
    password = raw_input("Your password: ")
    screenshotResult = raw_input("Save Screenshot of each Success? (recommend: true): ")
    screenshotOnFailure = raw_input("Save Screenshot of each Failure? (recommend: true): ")
    gameid = raw_input("The ID of the game to log the power index: ")

    #Now lets check what people input vs what is valid
    flag = 1
    while flag == 1:
        try:
            int(gameid)
        except ValueError:
            try:
                int(gameid)
            except ValueError:
                print (35 * '-')
                print "Your game ID is not a number"
                print "Your Current Game ID: %s" %(gameid)
                gameid= raw_input("Game ID to scan (example: 1520251): ")
                flag = 1
            else:
                flag = 0
        if screenshotResult.lower() not in ("true", "false"):
            print (35 * '-')
            print "You didn't type 'true' or 'false' for Save Screenshot of each Success: %s" %(screenshotResult)
            screenshotResult = raw_input("Save Screenshot of each Success? (recommend: true): ")
            flag = 1
        else:
            flag = 0
        if screenshotOnFailure.lower() not in ("true", "false"):
            print (35 * '-')
            print "You didn't type 'true' or 'false' for Save Screenshot of each Failure: %s" %(screenshotOnFailure)
            screenshotOnFailure = raw_input("Save Screenshot of each Failure? (recommend: true): ")
            flag = 1
        else:
            flag = 0
    vars = ['screenshotResult','screenshotOnFailure','username','password','gameid']
    new_values = [screenshotResult + ',',screenshotOnFailure + ',','"' + username + '",','"' + password + '",','"' + gameid + '"']
    what_to_change = dict(zip(vars,new_values))

    updating('config.js',what_to_change)

    raw_input("Config Built Successfully! Press Enter")
    printmenu()

def updating(filename,dico):

    RE = '(('+'|'.join(dico.keys())+')\s*:)[^\r\n]*?(\r?\n|\r)'
    pat = re.compile(RE)

    def jojo(mat,dic = dico ):
        return dic[mat.group(2)].join(mat.group(1,3))

    with open(filename,'rb') as f:
        content = f.read() 

    with open(filename,'wb') as f:
        f.write(pat.sub(jojo,content))

def cleanExit(message):
    sys.exit(message)


signal.signal(signal.SIGINT, signal_handler)
printmenu()
