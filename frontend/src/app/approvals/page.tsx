"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Megaphone } from 'lucide-react';
import { api } from '@/services/api';
import { useStore } from '@/store/useStore';

export default function Approvals() {
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const { refreshKey, triggerRefresh } = useStore();
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  useEffect(() => {
    fetchPending();
  }, [refreshKey]);

  const fetchPending = async () => {
    try {
      const all = await api.getCampaigns();
      setPendingCampaigns(all.filter((c: any) => c.status === 'PENDING_APPROVAL' || c.status === 'DRAFT')); // eslint-disable-line @typescript-eslint/no-explicit-any
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setLoadingAction(id);
    try {
      if (action === 'approve') {
        await api.activateMeta(id);
      } else {
        await api.rejectCampaign(id);
      }
      triggerRefresh();
      await fetchPending();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      alert("Error: " + err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (pendingCampaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <div className="p-4 bg-[#1E1E1E] rounded-full">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold">Todo al día</h2>
        <p className="text-gray-400">No hay campañas pendientes de aprobación.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Centro de Aprobaciones</h1>
        <p className="text-gray-400 mt-2">Revisa las estrategias creadas por el agente antes de enviarlas a Meta Ads.</p>
      </div>

      <div className="space-y-8">
        {pendingCampaigns.map(campaign => (
          <Card key={campaign.id} className="bg-[#1E1E1E] border-[#2C2C2C] overflow-hidden">
            <CardHeader className="bg-[#2C2C2C]/30 border-b border-[#2C2C2C]">
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                {campaign.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Presupuesto Propuesto</h3>
                  <p className="text-lg font-bold">${campaign.daily_budget} / día</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Copy Generado (Texto del Anuncio)</h3>
                  <div className="p-4 bg-[#121212] rounded-md text-sm leading-relaxed border border-[#2C2C2C]">
                    {campaign.copy_text}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Prompt de Imagen sugerido</h3>
                  <p className="text-xs text-gray-500 italic bg-[#121212] p-2 rounded border border-[#2C2C2C]">
                    {campaign.image_prompt}
                  </p>
                </div>
              </div>

              {/* Fake Facebook Post Preview */}
              <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="p-3 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Auto Marketing Hub</p>
                    <p className="text-xs text-gray-500">Patrocinado</p>
                  </div>
                </div>
                <div className="px-3 pb-3 text-sm">
                  {campaign.copy_text}
                </div>
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">
                    [ Imagen Generada por IA aquí ]
                  </span>
                </div>
                <div className="p-3 bg-gray-50 flex justify-between items-center border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">OFERTA EXCLUSIVA</p>
                    <p className="font-bold text-sm">{campaign.product_name}</p>
                  </div>
                  <Button variant="secondary" size="sm" className="bg-gray-200 text-black hover:bg-gray-300">
                    Más información
                  </Button>
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-[#2C2C2C]/30 border-t border-[#2C2C2C] p-4 flex gap-4">
              <Button
                onClick={() => handleAction(campaign.id, 'approve')}
                disabled={loadingAction === campaign.id}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              >
                <Check className="mr-2 h-5 w-5" />
                Aprobar y Activar (Lanzar a Meta)
              </Button>
              <Button
                onClick={() => handleAction(campaign.id, 'reject')}
                disabled={loadingAction === campaign.id}
                variant="destructive"
                className="flex-1 py-6 text-lg"
              >
                <X className="mr-2 h-5 w-5" />
                Rechazar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
