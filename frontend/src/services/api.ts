const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  getHealth: async () => {
    const res = await fetch(`${API_URL}/api/health`, { cache: 'no-store' });
    return res.json();
  },
  getSettings: async () => {
    const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' });
    return res.json();
  },
  getCampaigns: async () => {
    const res = await fetch(`${API_URL}/api/campaigns`, { cache: 'no-store' });
    return res.json();
  },
  generateStrategy: async (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const res = await fetch(`${API_URL}/api/agent/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Error generating strategy');
    }
    return res.json();
  },
  deployToMeta: async (campaignId: number) => {
    const res = await fetch(`${API_URL}/api/meta/deploy/${campaignId}`, { method: 'POST' });
    return res.json();
  },
  activateMeta: async (campaignId: number) => {
    const res = await fetch(`${API_URL}/api/meta/activate/${campaignId}`, { method: 'POST' });
    return res.json();
  },
  rejectCampaign: async (campaignId: number) => {
    const res = await fetch(`${API_URL}/api/campaigns/${campaignId}/reject`, { method: 'POST' });
    return res.json();
  }
};
