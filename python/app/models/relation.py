from sqlalchemy import Table, Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Relation(Base):
    # Table name
    __tablename__ = 'sp_relations'

    #
    # Columns
    # -------------

    id = Column(Integer, primary_key=True)
    start_day = Column(Integer)
    relation = Column(Integer)

    #
    # Relationships
    # -------------

    game_id = Column(Integer, ForeignKey('sp_games.id'))
    game = relationship("Game", back_populates="relations")

    player_native_id = Column(Integer, ForeignKey('sp_players.id'))
    player_native = relationship("Player", foreign_keys="Relation.player_native_id", back_populates="native_relations")

    player_foreign_id = Column(Integer, ForeignKey('sp_players.id'))
    player_foreign = relationship("Player", foreign_keys="Relation.player_foreign_id", back_populates="foreign_relations")

    #
    # Representation
    # -------------

    def __repr__(self):
        return "<Relation(%s)>" % (self.id)
