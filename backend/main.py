from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import asyncio
import os
import uuid
from dotenv import load_dotenv

from database import engine, Base, get_db
import models
import schemas

# Create tables
Base.metadata.create_all(bind=engine)

# Load env variables (useful when running outside docker for testing, docker-compose uses env_file)
load_dotenv()

app = FastAPI(title="Centro de Control de Marketing Autónomo")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def mask_key(key: str | None) -> str:
    if not key:
        return "No configurada"
    if len(key) <= 4:
        return "****"
    return "****" + key[-4:]

def check_keys():
    keys = ["META_API_KEY", "GEMINI_API_KEY", "WHATSAPP_API_KEY"]
    missing = [k for k in keys if not os.getenv(k)]
    return missing

@app.get("/api/health", response_model=schemas.HealthResponse)
def health_check():
    missing = check_keys()
    if missing:
        return {"status": "error", "missing_keys": missing}
    return {"status": "ok", "missing_keys": []}

@app.get("/api/settings", response_model=schemas.SettingsResponse)
def get_settings():
    return {
        "meta_api_key_masked": mask_key(os.getenv("META_API_KEY")),
        "gemini_api_key_masked": mask_key(os.getenv("GEMINI_API_KEY")),
        "whatsapp_api_key_masked": mask_key(os.getenv("WHATSAPP_API_KEY")),
    }

@app.get("/api/campaigns", response_model=list[schemas.CampaignResponse])
def get_campaigns(db: Session = Depends(get_db)):
    return db.query(models.Campaign).order_by(models.Campaign.created_at.desc()).all()

@app.post("/api/agent/generate", response_model=schemas.AgentGenerateResponse)
async def generate_campaign(req: schemas.AgentGenerateRequest, db: Session = Depends(get_db)):
    missing = check_keys()
    if missing:
        raise HTTPException(status_code=400, detail=f"Faltan API Keys: {', '.join(missing)}")

    # Simulate Gemini call
    await asyncio.sleep(3)

    copy_text = f"¡Lleva tu {req.product_name} hoy! Especial para {req.audience}. Beneficios exclusivos: {req.benefits}. Precio: ${req.price}. ¡No te lo pierdas!"
    image_prompt = f"Un {req.product_name} brillante en un entorno atractivo para {req.audience}, alta resolución, iluminación cinematográfica."
    estimated_cpl = 15.50

    # Save as DRAFT
    new_campaign = models.Campaign(
        title=f"Campaña {req.product_name} - {req.audience}",
        product_name=req.product_name,
        daily_budget=req.daily_budget,
        status=models.CampaignStatus.DRAFT,
        copy_text=copy_text,
        image_prompt=image_prompt
    )
    db.add(new_campaign)

    # Log action
    log = models.AgentLog(level=models.LogLevel.INFO, message=f"Generada estrategia para {req.product_name}")
    db.add(log)

    db.commit()
    db.refresh(new_campaign)

    return {
        "copy_text": copy_text,
        "image_prompt": image_prompt,
        "estimated_cpl": estimated_cpl,
        "campaign_id": new_campaign.id
    }

@app.post("/api/meta/deploy/{campaign_id}", response_model=schemas.MetaDeployResponse)
async def deploy_to_meta(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaña no encontrada")

    if campaign.status != models.CampaignStatus.DRAFT:
        raise HTTPException(status_code=400, detail="La campaña debe estar en DRAFT")

    # Simulate Meta Graph API deploy (status=PAUSED for HITL requirement)
    await asyncio.sleep(1.5)

    campaign.status = models.CampaignStatus.PENDING_APPROVAL
    db.commit()

    return {
        "status": "success",
        "message": "Campaña enviada a Meta en estado PAUSED. Esperando aprobación.",
        "campaign_id": campaign.id
    }

@app.post("/api/meta/activate/{campaign_id}", response_model=schemas.MetaActivateResponse)
async def activate_meta_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaña no encontrada")

    if campaign.status != models.CampaignStatus.PENDING_APPROVAL:
        raise HTTPException(status_code=400, detail="La campaña debe estar PENDING_APPROVAL")

    # Simulate Meta Graph API activation
    await asyncio.sleep(1.5)

    fake_meta_id = f"act_{uuid.uuid4().hex[:10]}"
    campaign.status = models.CampaignStatus.ACTIVE
    campaign.meta_campaign_id = fake_meta_id

    # Log action
    log = models.AgentLog(level=models.LogLevel.INFO, message=f"Campaña {campaign.id} activada en Meta con ID {fake_meta_id}")
    db.add(log)

    db.commit()

    return {
        "status": "success",
        "message": "Campaña activada en Meta Ads.",
        "campaign_id": campaign.id,
        "meta_campaign_id": fake_meta_id
    }

@app.post("/api/campaigns/{campaign_id}/reject", response_model=schemas.CampaignResponse)
async def reject_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaña no encontrada")

    campaign.status = models.CampaignStatus.REJECTED

    log = models.AgentLog(level=models.LogLevel.INFO, message=f"Campaña {campaign.id} rechazada")
    db.add(log)

    db.commit()
    db.refresh(campaign)
    return campaign
