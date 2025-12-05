"""
Mission Category Model
Categories for organizing NIRD missions
"""

from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    icon = Column(String(100))  # Icon name or emoji
    color = Column(String(7))  # Hex color code
    
    # Relationships
    missions = relationship("Mission", back_populates="category", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Category {self.name}>"
