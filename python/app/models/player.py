from sqlalchemy import Table, Column, Integer, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Player(Base):
    # Table name
    __tablename__ = 'sp_players'

    #
    # Columns
    # -------------

    id = Column(Integer, primary_key=True)
    player_id = Column(Integer)
    start_day = Column(Integer)
    Title = Column(String)
    Name = Column(String, nullable=False)
    nation_name = Column(String, nullable=False)
    primary_color = Column(String)
    secondary_color = Column(String)
    defeated = Column(Boolean, default=False)
    last_login = Column(DateTime)

    #
    # Relationships
    # -------------

    user_id = Column(Integer, ForeignKey('sp_users.id'))
    user = relationship("User", back_populates="players")

    game_id = Column(Integer, ForeignKey('sp_games.id'))
    game = relationship("Game", back_populates="players")

    days = relationship("Day", back_populates="player")

    native_relations = relationship("Relation", foreign_keys="Relation.player_native_id", back_populates="player_native")

    foreign_relations = relationship("Relation", foreign_keys="Relation.player_foreign_id", back_populates="player_foreign")

    #
    # Representation
    # -------------

    def __repr__(self):
        return "<Player(%s)>" % (self.id)
