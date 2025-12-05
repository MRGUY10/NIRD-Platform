"""
School Model
Represents educational institutions participating in NIRD
"""

from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.orm import relationship

from app.core.database import Base


class School(Base):
    __tablename__ = "schools"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    address = Column(Text)
    city = Column(String(100), index=True)
    region = Column(String(100), index=True)
    postal_code = Column(String(20))
    country = Column(String(100), default="France")
    
    # Contact information
    email = Column(String(255))
    phone = Column(String(50))
    website = Column(String(500))
    
    # Geolocation
    latitude = Column(Float)
    longitude = Column(Float)
    
    # NIRD specific
    description = Column(Text)
    logo_url = Column(String(500))
    
    # Relationships
    teams = relationship("Team", back_populates="school", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<School {self.name} - {self.city}>"
