"""
Seed Data Script for NIRD Platform
Populates database with initial categories, badges, and sample missions
"""

import asyncio
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.category import Category
from app.models.badge import Badge
from app.models.mission import Mission, MissionDifficulty


def seed_categories(db: Session):
    """Seed initial categories"""
    print("🌱 Seeding categories...")
    
    categories = [
        {
            "name": "E-Waste Recycling",
            "slug": "e-waste-recycling",
            "description": "Properly dispose and recycle electronic devices",
            "icon": "♻️"
        },
        {
            "name": "Device Repair",
            "slug": "device-repair",
            "description": "Learn to repair and extend device lifespan",
            "icon": "🔧"
        },
        {
            "name": "Energy Efficiency",
            "slug": "energy-efficiency",
            "description": "Reduce energy consumption of electronic devices",
            "icon": "⚡"
        },
        {
            "name": "Sustainable Computing",
            "slug": "sustainable-computing",
            "description": "Practice eco-friendly computing habits",
            "icon": "💻"
        },
        {
            "name": "Awareness & Education",
            "slug": "awareness-education",
            "description": "Spread awareness about electronic waste impact",
            "icon": "📚"
        },
        {
            "name": "Green Technology",
            "slug": "green-technology",
            "description": "Explore and promote green tech solutions",
            "icon": "🌿"
        }
    ]
    
    for cat_data in categories:
        existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if not existing:
            category = Category(**cat_data)
            db.add(category)
            print(f"  ✓ Created category: {cat_data['name']}")
        else:
            print(f"  ⊙ Category already exists: {cat_data['name']}")
    
    db.commit()
    print("✅ Categories seeded")


def seed_badges(db: Session):
    """Seed initial badge definitions"""
    print("\n🏆 Seeding badges...")
    
    badges = [
        {
            "name": "First Mission",
            "description": "Complete your first mission",
            "criteria_description": "Complete 1 mission",
            "rarity": "common"
        },
        {
            "name": "5 Missions",
            "description": "Complete 5 missions",
            "criteria_description": "Complete 5 missions",
            "rarity": "common"
        },
        {
            "name": "10 Missions",
            "description": "Complete 10 missions",
            "criteria_description": "Complete 10 missions",
            "rarity": "rare"
        },
        {
            "name": "100 Points",
            "description": "Earn 100 points",
            "criteria_description": "Accumulate 100 total points",
            "rarity": "rare"
        },
        {
            "name": "500 Points",
            "description": "Earn 500 points",
            "criteria_description": "Accumulate 500 total points",
            "rarity": "epic"
        },
        {
            "name": "Weekly Streak",
            "description": "Complete missions for 7 consecutive days",
            "criteria_description": "Maintain a 7-day mission completion streak",
            "rarity": "rare"
        },
        {
            "name": "Team Top 3",
            "description": "Help your team reach top 3",
            "criteria_description": "Team ranks in top 3 on leaderboard",
            "rarity": "epic"
        },
        {
            "name": "Resource Reader",
            "description": "Access 10 educational resources",
            "criteria_description": "View 10 different resources",
            "rarity": "common"
        },
        {
            "name": "Forum Contributor",
            "description": "Make 20 forum contributions",
            "criteria_description": "Post 20 times in the forum",
            "rarity": "rare"
        },
        {
            "name": "Level 5",
            "description": "Reach level 5",
            "criteria_description": "Achieve user level 5",
            "rarity": "legendary"
        }
    ]
    
    for badge_data in badges:
        existing = db.query(Badge).filter(Badge.name == badge_data["name"]).first()
        if not existing:
            badge = Badge(**badge_data)
            db.add(badge)
            print(f"  ✓ Created badge: {badge_data['name']}")
        else:
            print(f"  ⊙ Badge already exists: {badge_data['name']}")
    
    db.commit()
    print("✅ Badges seeded")


def seed_sample_missions(db: Session):
    """Seed sample missions for testing"""
    print("\n📋 Seeding sample missions...")
    
    # Get category IDs
    ewaste_cat = db.query(Category).filter(Category.slug == "e-waste-recycling").first()
    repair_cat = db.query(Category).filter(Category.slug == "device-repair").first()
    energy_cat = db.query(Category).filter(Category.slug == "energy-efficiency").first()
    awareness_cat = db.query(Category).filter(Category.slug == "awareness-education").first()
    
    if not all([ewaste_cat, repair_cat, energy_cat, awareness_cat]):
        print("  ⚠️  Categories not found. Skipping sample missions.")
        return
    
    missions = [
        {
            "title": "Recycle Your Old Phone",
            "description": "Find a local e-waste recycling center and properly dispose of an old phone. Take a photo of the recycling process.",
            "category_id": ewaste_cat.id,
            "difficulty": MissionDifficulty.EASY,
            "points": 10,
            "requires_photo": True,
            "requires_file": False,
            "is_active": True
        },
        {
            "title": "Battery Disposal Guide",
            "description": "Research and create a guide on how to properly dispose of batteries in your area. Share it with your community.",
            "category_id": ewaste_cat.id,
            "difficulty": MissionDifficulty.MEDIUM,
            "points": 20,
            "requires_photo": False,
            "requires_file": True,
            "is_active": True
        },
        {
            "title": "Fix a Broken Device",
            "description": "Attempt to repair a broken electronic device. Document the repair process with photos and a description of what you fixed.",
            "category_id": repair_cat.id,
            "difficulty": MissionDifficulty.HARD,
            "points": 30,
            "requires_photo": True,
            "requires_file": False,
            "is_active": True
        },
        {
            "title": "Power Audit Challenge",
            "description": "Measure the power consumption of 5 devices in your home. Create a report with recommendations for reducing energy use.",
            "category_id": energy_cat.id,
            "difficulty": MissionDifficulty.MEDIUM,
            "points": 20,
            "requires_photo": True,
            "requires_file": True,
            "is_active": True
        },
        {
            "title": "E-Waste Awareness Campaign",
            "description": "Create and share a social media post or poster about the impact of electronic waste. Must reach at least 50 people.",
            "category_id": awareness_cat.id,
            "difficulty": MissionDifficulty.EASY,
            "points": 15,
            "requires_photo": True,
            "requires_file": False,
            "is_active": True
        },
        {
            "title": "School E-Waste Drive",
            "description": "Organize a small e-waste collection drive at your school. Collect at least 10 items and document the process.",
            "category_id": ewaste_cat.id,
            "difficulty": MissionDifficulty.HARD,
            "points": 40,
            "requires_photo": True,
            "requires_file": True,
            "is_active": True
        },
        {
            "title": "Unplug Challenge",
            "description": "Unplug all devices when not in use for one week. Track your energy savings and report the results.",
            "category_id": energy_cat.id,
            "difficulty": MissionDifficulty.MEDIUM,
            "points": 25,
            "requires_photo": False,
            "requires_file": True,
            "is_active": True
        },
        {
            "title": "Donate Old Electronics",
            "description": "Donate working but unused electronics to a charity or school. Take a photo with the donation receipt.",
            "category_id": ewaste_cat.id,
            "difficulty": MissionDifficulty.EASY,
            "points": 10,
            "requires_photo": True,
            "requires_file": False,
            "is_active": True
        }
    ]
    
    for mission_data in missions:
        existing = db.query(Mission).filter(Mission.title == mission_data["title"]).first()
        if not existing:
            mission = Mission(**mission_data)
            db.add(mission)
            print(f"  ✓ Created mission: {mission_data['title']}")
        else:
            print(f"  ⊙ Mission already exists: {mission_data['title']}")
    
    db.commit()
    print("✅ Sample missions seeded")


def main():
    """Main seed function"""
    print("🚀 Starting database seeding...\n")
    
    db = SessionLocal()
    try:
        seed_categories(db)
        seed_badges(db)
        seed_sample_missions(db)
        
        print("\n✨ Database seeding completed successfully!")
        
        # Print summary
        categories_count = db.query(Category).count()
        badges_count = db.query(Badge).count()
        missions_count = db.query(Mission).count()
        
        print(f"\n📊 Summary:")
        print(f"  Categories: {categories_count}")
        print(f"  Badges: {badges_count}")
        print(f"  Missions: {missions_count}")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
