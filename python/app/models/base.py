from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

from .user import User
from .map import Map
from .game import Game
from .player import Player 
from .day import Day
from .relation import Relation 
from .coalition import Coalition
