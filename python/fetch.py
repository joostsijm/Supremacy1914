#!/usr/bin/env python

import time
import json
import requests

headers = {
        "Host": "xgs15.c.bytro.com",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0",
        "Accept": "text/plain, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Content-Length": "387",
        "Origin": "https://www.supremacy1914.com",
        "DNT": "1",
        "Connection": "keep-alive",
        }

payloadSample = {
        "@c": "ultshared.action.UltUpdateGameStateAction",
        "gameID": "2117045",
        "playerID": 0,
        "userAuth": "787925a25d0c072c3eaff5c1eff52829475fd506",
        "tstamp": int(time.time())
        }

url = 'https://xgs15.c.bytro.com/'

def print_json(jsonText):
    print(json.dumps(jsonText, sort_keys=True, indent=4))

def get_day():
    payload = payloadSample
    payload["stateType"] = 12
    payload["option"] = 30

    r = requests.post(url, headers=headers, json=payload)

    response = json.loads(r.text)
    result = response["result"]
    return result["dayOfGame"]

def get_score(day):
    payload = payloadSample
    payload["stateType"] = 2
    payload["option"] = day

    r = requests.post(url, headers=headers, json=payload)

    text = json.loads(r.text)
    return text["result"]["ranking"]["ranking"]


def write_results():
    resultsFile = open("results.csv","w")

    for day in range(0, get_day()):
        day += 1;

        print("day: " + str(day))
        result = get_score(day)
        result.pop(0)

        formatedResult = str();
        for player in result:
            formatedResult += str(player) + ","

        resultsFile.write(formatedResult + "\n");

    resultsFile.close()

def get_players():
    payload = payloadSample
    payload["stateType"] = 1

    r = requests.post(url, headers=headers, json=payload)

    text = json.loads(r.text)
    print_json(text["result"]["players"])


get_players()
#write_results()

print("\ndone!")
