from sqlalchemy import Table, Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Day(Base):
    # Table name
    __tablename__ = 'sp_days'

    #
    # Columns
    # -------------

    id = Column(Integer, primary_key=True)
    day = Column(Integer)
    points = Column(Integer)

    #
    # Relationships
    # -------------

    player_id = Column(Integer, ForeignKey('sp_players.id'))
    player = relationship("Player", back_populates="days")

    game_id = Column(Integer, ForeignKey('sp_games.id'))
    game = relationship("Game", back_populates="days")

    coalition_id = Column(Integer, ForeignKey('sp_coalitions.id'))
    coalition = relationship("Coalition", back_populates="days")

    #
    # Representation
    # -------------

    def __repr__(self):
        return "<Day(%s)>" % (self.id)
