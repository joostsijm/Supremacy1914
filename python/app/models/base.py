from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

from .user import User
from .map import Map
from .game import Game
