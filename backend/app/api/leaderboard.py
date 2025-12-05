"""
Leaderboard API
Real-time leaderboard with ranking calculation and SSE updates
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional, AsyncGenerator
from datetime import datetime, timedelta
import json
import asyncio

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.team import Team
from app.models.school import School
from app.models.mission import MissionSubmission, MissionStatus
from app.models.leaderboard import LeaderboardSnapshot
from app.schemas.leaderboard import (
    LeaderboardEntry, LeaderboardResponse, TeamRankHistory, 
    RankSnapshot, LeaderboardStats, UserLeaderboardEntry, UserLeaderboardResponse
)

router = APIRouter(tags=["Leaderboard"])

# In-memory cache for leaderboard (refreshed periodically)
_leaderboard_cache = {
    "data": None,
    "timestamp": None,
    "ttl": 60  # Cache TTL in seconds
}

# SSE clients for real-time updates
_sse_clients = []


def calculate_leaderboard(
    db: Session,
    school_id: Optional[int] = None,
    category_id: Optional[int] = None,
    days: Optional[int] = None
) -> List[LeaderboardEntry]:
    """
    Calculate leaderboard rankings with optional filters.
    
    Args:
        db: Database session
        school_id: Filter by school
        category_id: Filter by mission category
        days: Filter by time period (e.g., last 30 days)
    
    Returns:
        List of LeaderboardEntry objects sorted by total_points
    """
    # Import Mission model
    from app.models.mission import Mission
    
    # Base query: aggregate approved submissions by team
    query = db.query(
        Team.id.label('team_id'),
        Team.name.label('team_name'),
        School.name.label('school_name'),
        func.coalesce(func.sum(Mission.points), 0).label('total_points'),
        func.count(MissionSubmission.id).label('missions_completed'),
        func.count(MissionSubmission.id).label('approved_submissions')
    ).join(
        MissionSubmission, Team.id == MissionSubmission.team_id
    ).join(
        Mission, MissionSubmission.mission_id == Mission.id
    ).outerjoin(
        School, Team.school_id == School.id
    ).filter(
        MissionSubmission.status == MissionStatus.APPROVED
    ).group_by(
        Team.id, Team.name, School.name
    )
    
    # Apply filters
    if school_id:
        query = query.filter(Team.school_id == school_id)
    
    if days:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        query = query.filter(MissionSubmission.submitted_at >= cutoff_date)
    
    # Execute query and get results
    results = query.order_by(desc('total_points')).all()
    
    # Convert to leaderboard entries with rankings
    entries = []
    for rank, row in enumerate(results, start=1):
        avg_score = row.total_points / row.missions_completed if row.missions_completed > 0 else 0.0
        
        entries.append(LeaderboardEntry(
            rank=rank,
            team_id=row.team_id,
            team_name=row.team_name,
            school_name=row.school_name,
            total_points=row.total_points,
            missions_completed=row.missions_completed,
            approved_submissions=row.approved_submissions,
            average_score=round(avg_score, 2),
            rank_change=0  # Calculate from historical data if available
        ))
    
    return entries


@router.get("", response_model=LeaderboardResponse)
async def get_leaderboard(
    skip: int = Query(0, ge=0, description="Number of entries to skip"),
    limit: int = Query(50, ge=1, le=100, description="Number of entries to return"),
    school_id: Optional[int] = Query(None, description="Filter by school ID"),
    category_id: Optional[int] = Query(None, description="Filter by mission category"),
    days: Optional[int] = Query(None, ge=1, description="Filter by days (e.g., 30 for last 30 days)"),
    db: Session = Depends(get_db)
):
    """
    Get current leaderboard rankings with optional filters.
    
    - **skip**: Pagination offset
    - **limit**: Number of entries per page
    - **school_id**: Filter by specific school
    - **category_id**: Filter by mission category
    - **days**: Filter by time period (last N days)
    
    Uses caching for better performance.
    """
    # Check cache (only for unfiltered requests)
    cache_key = f"leaderboard_{school_id}_{category_id}_{days}"
    now = datetime.utcnow()
    
    if not school_id and not category_id and not days:
        if (_leaderboard_cache["data"] and _leaderboard_cache["timestamp"] and
            (now - _leaderboard_cache["timestamp"]).seconds < _leaderboard_cache["ttl"]):
            cached_data = _leaderboard_cache["data"]
            return LeaderboardResponse(
                entries=cached_data[skip:skip + limit],
                total_teams=len(cached_data),
                last_updated=_leaderboard_cache["timestamp"],
                filters=None
            )
    
    # Calculate fresh leaderboard
    entries = calculate_leaderboard(db, school_id, category_id, days)
    
    # Update cache if no filters
    if not school_id and not category_id and not days:
        _leaderboard_cache["data"] = entries
        _leaderboard_cache["timestamp"] = now
    
    # Build filters dict
    filters = {}
    if school_id:
        filters["school_id"] = school_id
    if category_id:
        filters["category_id"] = category_id
    if days:
        filters["days"] = days
    
    return LeaderboardResponse(
        entries=entries[skip:skip + limit],
        total_teams=len(entries),
        last_updated=now,
        filters=filters if filters else None
    )


@router.get("/team/{team_id}/history", response_model=TeamRankHistory)
async def get_team_rank_history(
    team_id: int,
    days: int = Query(30, ge=1, le=365, description="Number of days of history"),
    db: Session = Depends(get_db)
):
    """
    Get historical ranking data for a specific team.
    
    - **team_id**: Team ID
    - **days**: Number of days of history to retrieve (default: 30)
    
    Returns ranking snapshots over time.
    """
    # Verify team exists
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Get historical snapshots
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    snapshots = db.query(LeaderboardSnapshot).filter(
        LeaderboardSnapshot.team_id == team_id,
        LeaderboardSnapshot.snapshot_at >= cutoff_date
    ).order_by(LeaderboardSnapshot.snapshot_at.desc()).all()
    
    # Get current ranking (for context, even if no historical data)
    try:
        current_leaderboard = calculate_leaderboard(db)
        current_entry = next((e for e in current_leaderboard if e.team_id == team_id), None)
    except Exception:
        # If calculation fails, continue with empty data
        current_entry = None
    
    # Convert snapshots to schema
    history = [
        RankSnapshot(
            rank=snap.rank,
            points=snap.points,
            missions_completed=snap.missions_completed,
            snapshot_at=snap.snapshot_at,
            period_type=snap.period_type or "daily"
        )
        for snap in snapshots
    ]
    
    # If no historical snapshots, create one from current state for reference
    if not history and current_entry:
        history.append(
            RankSnapshot(
                rank=current_entry.rank,
                points=current_entry.total_points,
                missions_completed=current_entry.missions_completed,
                snapshot_at=datetime.utcnow(),
                period_type="current"
            )
        )
    
    return TeamRankHistory(
        team_id=team_id,
        team_name=team.name,
        history=history
    )


@router.get("/stats", response_model=LeaderboardStats)
async def get_leaderboard_stats(
    db: Session = Depends(get_db)
):
    """
    Get global leaderboard statistics.
    
    Returns:
        - Total teams
        - Total points awarded
        - Total missions completed
        - Average team score
        - Top team info
        - Most active and improved teams
    """
    # Import Mission model
    from app.models.mission import Mission
    
    # Calculate statistics
    total_teams = db.query(func.count(func.distinct(Team.id))).scalar() or 0
    
    # Total points from approved submissions
    total_points = db.query(
        func.sum(Mission.points)
    ).join(
        MissionSubmission, Mission.id == MissionSubmission.mission_id
    ).filter(
        MissionSubmission.status == MissionStatus.APPROVED
    ).scalar() or 0
    
    total_missions = db.query(func.count(MissionSubmission.id)).filter(
        MissionSubmission.status == MissionStatus.APPROVED
    ).scalar() or 0
    
    # Active schools
    active_schools = db.query(
        func.count(func.distinct(Team.school_id))
    ).join(
        MissionSubmission, Team.id == MissionSubmission.team_id
    ).filter(
        MissionSubmission.status == MissionStatus.APPROVED
    ).scalar() or 0
    
    # Average team score
    avg_score = total_points / total_teams if total_teams > 0 else 0.0
    
    # Get leaderboard for top team
    leaderboard = calculate_leaderboard(db)
    top_team_points = leaderboard[0].total_points if leaderboard else 0
    most_active_team = leaderboard[0].team_name if leaderboard else None
    
    return LeaderboardStats(
        total_teams=total_teams,
        total_points_awarded=total_points,
        total_missions_completed=total_missions,
        active_schools=active_schools,
        average_team_score=round(avg_score, 2),
        top_team_points=top_team_points,
        most_active_team=most_active_team,
        most_improved_team=None,  # Would need historical data
        last_updated=datetime.utcnow()
    )


async def leaderboard_event_generator(db: Session) -> AsyncGenerator[str, None]:
    """
    Server-Sent Events generator for real-time leaderboard updates.
    
    Sends updated leaderboard data every 10 seconds or when triggered.
    """
    client_id = id(asyncio.current_task())
    _sse_clients.append(client_id)
    
    try:
        while True:
            # Calculate current leaderboard
            entries = calculate_leaderboard(db)
            
            # Format as SSE event
            data = {
                "entries": [entry.model_dump() for entry in entries[:10]],  # Top 10
                "timestamp": datetime.utcnow().isoformat(),
                "total_teams": len(entries)
            }
            
            yield f"data: {json.dumps(data)}\n\n"
            
            # Wait before next update
            await asyncio.sleep(10)
            
    except asyncio.CancelledError:
        # Client disconnected
        if client_id in _sse_clients:
            _sse_clients.remove(client_id)
    finally:
        if client_id in _sse_clients:
            _sse_clients.remove(client_id)


@router.get("/stream")
async def stream_leaderboard(db: Session = Depends(get_db)):
    """
    Server-Sent Events endpoint for real-time leaderboard updates.
    
    Streams leaderboard updates every 10 seconds.
    Connect using EventSource in JavaScript:
    ```javascript
    const eventSource = new EventSource('/api/leaderboard/stream');
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Leaderboard update:', data);
    };
    ```
    """
    return StreamingResponse(
        leaderboard_event_generator(db),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable nginx buffering
        }
    )


async def broadcast_leaderboard_update(db: Session):
    """
    Trigger a leaderboard update broadcast to all SSE clients.
    
    Call this function when a mission submission is approved to immediately
    update all connected clients.
    """
    if not _sse_clients:
        return
    
    # Calculate updated leaderboard
    entries = calculate_leaderboard(db)
    
    # Invalidate cache
    _leaderboard_cache["data"] = entries
    _leaderboard_cache["timestamp"] = datetime.utcnow()
    
    # Note: Actual broadcast would require storing client queues
    # For simplicity, clients poll every 10 seconds via the stream endpoint


@router.get("/users", response_model=UserLeaderboardResponse)
async def get_user_leaderboard(
    skip: int = Query(0, ge=0, description="Number of entries to skip"),
    limit: int = Query(100, ge=1, le=200, description="Number of entries to return"),
    school_id: Optional[int] = Query(None, description="Filter by school ID"),
    role: Optional[str] = Query(None, description="Filter by role (student, teacher)"),
    db: Session = Depends(get_db)
):
    """
    Get user leaderboard rankings based on individual points.
    
    - **skip**: Pagination offset
    - **limit**: Number of entries per page
    - **school_id**: Filter by specific school
    - **role**: Filter by user role
    
    Shows individual users ranked by their total points from completed missions.
    """
    from app.models.mission import Mission
    from app.models.team import TeamMember
    from app.models.badge import UserBadge
    
    # Base query: aggregate approved submissions by user
    query = db.query(
        User.id.label('user_id'),
        User.username,
        User.full_name,
        User.avatar_url,
        User.role,
        func.coalesce(func.sum(Mission.points), 0).label('total_points'),
        func.count(MissionSubmission.id).label('missions_completed')
    ).outerjoin(
        MissionSubmission, User.id == MissionSubmission.submitted_by
    ).outerjoin(
        Mission, MissionSubmission.mission_id == Mission.id
    ).filter(
        (MissionSubmission.status == MissionStatus.APPROVED) | (MissionSubmission.id == None)
    ).group_by(
        User.id, User.username, User.full_name, User.avatar_url, User.role
    )
    
    # Apply filters
    if school_id:
        query = query.filter(User.school_id == school_id)
    
    if role:
        from app.models.user import UserRole
        try:
            user_role = UserRole(role.lower())
            query = query.filter(User.role == user_role)
        except ValueError:
            pass  # Invalid role, ignore filter
    
    # Execute query and get results ordered by points
    results = query.order_by(desc('total_points')).all()
    
    # Get team and school info for each user
    entries = []
    for rank, row in enumerate(results, start=1):
        # Get user's team
        team_member = db.query(TeamMember).filter(
            TeamMember.user_id == row.user_id
        ).first()
        
        team_name = None
        school_name = None
        
        if team_member:
            team = db.query(Team).filter(Team.id == team_member.team_id).first()
            if team:
                team_name = team.name
                if team.school_id:
                    school = db.query(School).filter(School.id == team.school_id).first()
                    if school:
                        school_name = school.name
        
        # Get badges earned
        badges_earned = db.query(func.count(UserBadge.id)).filter(
            UserBadge.user_id == row.user_id
        ).scalar() or 0
        
        entries.append(UserLeaderboardEntry(
            rank=rank,
            user_id=row.user_id,
            username=row.username,
            full_name=row.full_name,
            avatar_url=row.avatar_url,
            role=row.role.value,
            total_points=int(row.total_points),
            missions_completed=row.missions_completed,
            badges_earned=badges_earned,
            team_name=team_name,
            school_name=school_name
        ))
    
    # Apply pagination
    paginated_entries = entries[skip:skip + limit]
    
    # Build filters dict
    filters = {}
    if school_id:
        filters["school_id"] = school_id
    if role:
        filters["role"] = role
    
    return UserLeaderboardResponse(
        entries=paginated_entries,
        total_users=len(entries),
        last_updated=datetime.utcnow(),
        filters=filters if filters else None
    )
