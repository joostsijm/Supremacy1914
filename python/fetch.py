#!/usr/bin/env python

import time
import json
import requests
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy import and_
from sqlalchemy.orm import sessionmaker

from app.models.base import Game
from app.models.base import Map
from app.models.base import Player
from app.models.base import User 
from app.models.base import Day 


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
id = 2100245 #internal game
#id = 2117045 #domination
#id = 2100250 #random game

engine = create_engine("postgresql://supindex@localhost/supindex")
Session = sessionmaker(bind=engine, autoflush=False)
session = Session()


def print_json(jsonText):
    print(json.dumps(jsonText, sort_keys=True, indent=4))


def get_day(game, id):
    payload = payloadSample
    payload["gameID"] = id
    payload["stateType"] = 12

    r = requests.post(game.game_host, headers=headers, json=payload)

    text = json.loads(r.text)
    print_json(text)
    if not check_response(text):
        get_day(game, id)
    else:
        response = json.loads(r.text)
        result = response["result"]
        return result["dayOfGame"]


def get_score(game, day):
    payload = payloadSample
    payload["gameID"] = id
    payload["stateType"] = 2
    payload["option"] = day

    r = requests.post(game.game_host, headers=headers, json=payload)

    text = json.loads(r.text)
    if not check_response(text):
        get_score(game, day)
    else:
        return text["result"]["ranking"]["ranking"]


def get_results(id):
    game = session.query(Game).filter(Game.game_id == id).first()
    if game is None:
        game = get_game(id)

    for day_index in range(0, get_day(game, id)):
        day_index += 1

        print("day: " + str(day_index))
        result = get_score(game, day_index)
        result.pop(0)

        player_id = 1 
        for score in result:
            player = game.players.filter(Player.player_id == player_id).first()
            day = player.days.filter(Day.day == day_index).first()

            if day is None:
                day = Day()
                day.day = day_index
                day.points = score
                day.game_id = game.id
                day.player_id = player.id
                session.add(day)

            player_id += 1

        session.commit()


def get_game(id):
    payload = payloadSample
    payload["gameID"] = id
    payload["stateType"] = 12

    game = session.query(Game).filter(Game.game_id == id).first()
    if game is None:
        game = Game()
        game.game_id = id,
        game.game_host = url,

        session.add(game)
        session.commit()

    r = requests.post(game.game_host, headers=headers, json=payload)

    text = json.loads(r.text)
    if not check_response(text):
        get_game()
    else:
        result = text["result"]

        game.start_at = datetime.fromtimestamp(result["startOfGame"]),

        map = session.query(Map).filter(Map.map_id == result["mapID"]).first()
        if map is None:
            map = Map()
            map.map_id = result["mapID"]
            map.slots = result["openSlots"] + result["numberOfPlayers"]
            session.add(map)
            session.commit()

        game.map_id = map.id
        session.commit()

        return game

def get_players():
    payload = payloadSample
    payload["gameID"] = id
    payload["stateType"] = 1

    game = session.query(Game).filter(Game.game_id == id).first()
    if game is None:
        get_game(id)

    r = requests.post(game.game_host, headers=headers, json=payload)

    text = json.loads(r.text)
    if not check_response(text):
        get_players()
    else:
        result = text["result"]["players"]
        for player_id in result:
            save_player(game, result[player_id])

def save_player(game, player_data):
    if "playerID" in player_data:
        player_id = int(player_data["playerID"])

        if player_id > 0:
            print("player_id: " + str(player_id))

            player = session.query(Player).filter(and_(Player.game_id == id,
                Player.player_id == player_id)).first()

            if player is None:
                player = Player()

                player.game_id = game.id
                player.player_id = player_id

                player.nation_name = player_data["nationName"]

                player.primary_color = player_data["primaryColor"]
                player.secondary_color = player_data["secondaryColor"]

                if "userName" in player_data:
                    user = session.query(User).filter(User.name == player_data["userName"]).first()

                    if user is None:
                        user = User()

                        user.site_id = player_data["siteUserID"]
                        user.name = player_data["userName"]

                        session.add(user)
                        session.commit()

                    player.user_id = user.id

                session.add(player)

            player.title = player_data["title"]
            player.name = player_data["name"]

            print(player.name)

            player.defeated = player_data["defeated"]
            if player_data["lastLogin"] == 0:
                player.last_login = None
            else:
                player.last_login = datetime.fromtimestamp(player_data["lastLogin"]/1000)

            session.commit()


def check_response(response):
    if response["result"]["@c"] == "ultshared.rpc.UltSwitchServerException":
        game = session.query(Game).filter(Game.game_id == id).first()
        game.game_host = "http://" + response["result"]["newHostName"]
        session.commit()
        return False
    return True


get_results(id)

print("\ndone!")
