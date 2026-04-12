import requests
import time

BASE_URL = "http://localhost:8000"

def test():
    print("Testing Backend API Flow...")

    # 1. Settings (Masked)
    res = requests.get(f"{BASE_URL}/api/settings")
    print("\n[Settings API]")
    print(res.json())

    # 2. Generate
    print("\n[Generate Campaign API]")
    payload = {
        "product_name": "Tesla Model 3",
        "price": 35000,
        "benefits": "Auto-pilot, Electric",
        "audience": "Tech Enthusiasts",
        "daily_budget": 5000
    }
    res = requests.post(f"{BASE_URL}/api/agent/generate", json=payload)
    data = res.json()
    print("Agent Response:", data)
    camp_id = data.get("campaign_id")

    # 3. Deploy
    print(f"\n[Deploy Campaign {camp_id} to Meta]")
    res = requests.post(f"{BASE_URL}/api/meta/deploy/{camp_id}")
    print("Deploy Status:", res.json())

    # 4. Check Status (Should be PENDING_APPROVAL)
    res = requests.get(f"{BASE_URL}/api/campaigns")
    camps = res.json()
    status = next((c["status"] for c in camps if c["id"] == camp_id), None)
    print(f"Current Status in DB: {status}")

    # 5. Activate
    print(f"\n[Approve and Activate {camp_id}]")
    res = requests.post(f"{BASE_URL}/api/meta/activate/{camp_id}")
    print("Activation:", res.json())

    # 6. Check Final Status (Should be ACTIVE)
    res = requests.get(f"{BASE_URL}/api/campaigns")
    camps = res.json()
    status = next((c["status"] for c in camps if c["id"] == camp_id), None)
    print(f"Final Status in DB: {status}")

if __name__ == "__main__":
    test()
