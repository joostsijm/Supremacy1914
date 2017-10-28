from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    # Table name
    __tablename__ = 'sp_users'

    #
    # Columns
    # -------------

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    site_id = Column(Integer, unique=True, nullable=False)
    score_military = Column(Integer)
    score_economic = Column(Integer)

    #
    # Relationships
    # -------------

    players = relationship("Player", back_populates="user")

    #
    # Representation
    # -------------

    def __repr__(self):
        return "<User(%s)>" % (self.id)