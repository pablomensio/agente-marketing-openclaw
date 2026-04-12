from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from models import CampaignStatus, LogLevel

class CampaignBase(BaseModel):
    product_name: str
    daily_budget: float

class CampaignCreate(CampaignBase):
    pass

class CampaignResponse(CampaignBase):
    id: int
    title: str
    status: CampaignStatus
    meta_campaign_id: Optional[str]
    copy_text: Optional[str]
    image_prompt: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class AgentGenerateRequest(BaseModel):
    product_name: str
    price: float
    benefits: str
    audience: str
    daily_budget: float

class AgentGenerateResponse(BaseModel):
    copy_text: str
    image_prompt: str
    estimated_cpl: float
    campaign_id: int

class MetaDeployResponse(BaseModel):
    status: str
    message: str
    campaign_id: int

class MetaActivateResponse(BaseModel):
    status: str
    message: str
    campaign_id: int
    meta_campaign_id: str

class SettingsResponse(BaseModel):
    meta_api_key_masked: str
    gemini_api_key_masked: str
    whatsapp_api_key_masked: str

class HealthResponse(BaseModel):
    status: str
    missing_keys: list[str]
