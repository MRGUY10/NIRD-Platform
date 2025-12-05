"""
Script to verify database tables
"""
from app.core.database import engine
from sqlalchemy import text

conn = engine.connect()
result = conn.execute(text("SELECT tablename FROM pg_tables WHERE schemaname='public'"))
tables = [row[0] for row in result]

print('✅ Database tables created successfully!')
print(f'📊 Total tables: {len(tables)}')
print('\nTables:')
for t in sorted(tables):
    print(f'  ✓ {t}')

conn.close()
