#!/usr/bin/env python

import time
import json
import datetime
import requests

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Game 
from app.models.base import Map 


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
        "playerID": 0,
        "userAuth": "787925a25d0c072c3eaff5c1eff52829475fd506",
        "tstamp": int(time.time())
        }

# temp place for variables
url = 'https://xgs3.c.bytro.com/'
#id = 2117045
id = 2100250

engine = create_engine("postgresql://supindex@localhost/supindex")
Session = sessionmaker(bind=engine)
session = Session()


def print_json(jsonText):
    print(json.dumps(jsonText, sort_keys=True, indent=4))

def get_day():
    payload = payloadSample
    payload["gameID"] = id
    payload["stateType"] = 12
    payload["option"] = 30

    r = requests.post(url, headers=headers, json=payload)

    response = json.loads(r.text)
    result = response["result"]
    return result["dayOfGame"]

def get_score(day):
    payload = payloadSample
    payload["gameID"] = id
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

def get_game():
    payload = payloadSample
    payload["gameID"] = id
    payload["stateType"] = 12

    game = session.query(Game).filter(Game.game_id == id).first()
    if game is None:
        game = Game();
        game.game_id = id,
        game.game_host = url,

        session.add(game)
        session.commit()

    r = requests.post(game.game_host, headers=headers, json=payload)

    text = json.loads(r.text)
    if not check_response(text):
        get_game();
    else:
        result = text["result"]

        game.start_at = datetime.datetime.fromtimestamp(result["startOfGame"]),

        map = session.query(Map).filter(Map.map_id == result["mapID"]).first()
        if map is None:
            map = Map();
            map.map_id = result["mapID"]
            map.slots = result["openSlots"] + result["numberOfPlayers"]
            session.add(map)
            session.commit()

        game.map_id = map.id;
        session.commit()

        return game


def check_response(response):
    print_json(response)
    if response["result"]["@c"] == "ultshared.rpc.UltSwitchServerException":
        game = session.query(Game).filter(Game.game_id == id).first()
        game.game_host = "http://" + response["result"]["newHostName"];
        session.commit()
        return False
    
    return True


def get_players(game_id):
    payload = payloadSample
    payload["gameID"] = game_id
    payload["stateType"] = 1

    game = session.query(Game).filter(Game.game_id == id).first()
    if game is None:
        game = get_game(game_id)

    r = requests.post(url, headers=headers, json=payload)

    text = json.loads(r.text)
    print_json(text["result"]["players"])


#get_game()
#write_results()
get_players(2100245)

print("\ndone!")
