from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Map(Base):
    # Table name
    __tablename__ = 'sp_maps'

    #
    # Columns
    # -------------

    id = Column(Integer, primary_key=True)
    name = Column(String)
    image = Column(String)
    slots = Column(Integer)

    #
    # Relationships
    # -------------

    games = relationship("Game", back_populates="map")

    #
    # Representation
    # -------------

    def __repr__(self):
        return "<Map(%s)>" % (self.id)
