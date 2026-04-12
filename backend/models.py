from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text
from datetime import datetime
import enum
from database import Base

class CampaignStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"

class LogLevel(str, enum.Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    product_name = Column(String)
    daily_budget = Column(Float)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    meta_campaign_id = Column(String, nullable=True)
    copy_text = Column(Text, nullable=True)
    image_prompt = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(Enum(LogLevel), default=LogLevel.INFO)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
