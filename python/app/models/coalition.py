from sqlalchemy import Table, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Coalition(Base):
    # Table name
    __tablename__ = 'sp_coalitions'

    #
    # Columns
    # -------------

    id = Column(Integer, primary_key=True)
    coaliton_id = Column(Integer)
    name = Column(String)
    description = Column(String)

    #
    # Relationships
    # -------------

    days = relationship("sp_days", back_populates="game")

    game_id = Column(Integer, ForeignKey('sp_games.id'))
    game = relationship("sp_games", back_populates="coalitions")

    #
    # Representation
    # -------------

    def __repr__(self):
        return "<Coalition(%s)>" % (self.id)
