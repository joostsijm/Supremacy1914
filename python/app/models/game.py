from sqlalchemy import Table, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Game(Base):
    # Table name
    __tablename__ = 'sp_games'

    #
    # Columns
    # -------------

    id = Column(Integer, primary_key=True)
    game_id= Column(Integer)
    start_at = Column(DateTime)
    end_at = Column(DateTime)

    #
    # Relationships
    # -------------

    map_id = Column(Integer, ForeignKey('sp_maps.id'))
    map = relationship("sp_maps", back_populates="games")

    #
    # Representation
    # -------------

    def __repr__(self):
        return "<Game(%s)>" % (self.id)
