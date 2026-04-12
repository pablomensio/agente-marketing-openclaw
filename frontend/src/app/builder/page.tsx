"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { useStore } from '@/store/useStore';

export default function Builder() {
  const router = useRouter();
  const { triggerRefresh, missingKeys } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    benefits: '',
    audience: '',
    daily_budget: 1000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (missingKeys.length > 0) {
      alert("No se puede generar la campaña. Faltan API Keys.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        daily_budget: formData.daily_budget
      };

      const res = await api.generateStrategy(payload);
      // Automatically deploy to Meta in PAUSED state (HITL requirement)
      await api.deployToMeta(res.campaign_id);

      triggerRefresh();
      router.push('/approvals');
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Constructor de Campañas</h1>
        <p className="text-gray-400 mt-2">Describe tu oferta y deja que el Agente diseñe la estrategia creativa y el copy óptimo.</p>
      </div>

      <Card className="bg-[#1E1E1E] border-[#2C2C2C]">
        <CardHeader>
          <CardTitle>Datos del Vehículo / Oferta</CardTitle>
          <CardDescription className="text-gray-400">Completa los datos para generar el prompt y copy.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Producto</Label>
              <Input
                placeholder="ej. Renault Kangoo 5 Asientos"
                value={formData.product_name}
                onChange={e => setFormData({...formData, product_name: e.target.value})}
                required
                className="bg-[#121212] border-[#2C2C2C]"
              />
            </div>

            <div className="space-y-2">
              <Label>Precio o Cuota Promedio ($)</Label>
              <Input
                type="number"
                placeholder="300000"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
                className="bg-[#121212] border-[#2C2C2C]"
              />
            </div>

            <div className="space-y-2">
              <Label>Beneficios y Promociones</Label>
              <Textarea
                placeholder="ej. GNC 5ta gen de regalo, bono de $3M, entrega inmediata..."
                value={formData.benefits}
                onChange={e => setFormData({...formData, benefits: e.target.value})}
                required
                className="bg-[#121212] border-[#2C2C2C] min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Perfil de Audiencia</Label>
              <Select onValueChange={(v) => setFormData({...formData, audience: v})} required>
                <SelectTrigger className="bg-[#121212] border-[#2C2C2C]">
                  <SelectValue placeholder="Selecciona la audiencia ideal" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-[#2C2C2C] text-white">
                  <SelectItem value="Comerciantes">Comerciantes (Trabajo)</SelectItem>
                  <SelectItem value="Familias">Familias (Seguridad y Espacio)</SelectItem>
                  <SelectItem value="Flotas">Flotas de Empresas</SelectItem>
                  <SelectItem value="Jovenes">Primer Auto (Jóvenes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Presupuesto Diario</Label>
                <span className="text-primary font-bold">${formData.daily_budget}</span>
              </div>
              <Slider
                min={1000}
                max={10000}
                step={500}
                value={[formData.daily_budget]}
                onValueChange={(val) => setFormData({...formData, daily_budget: val[0]})}
                className="py-4"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 text-lg"
              disabled={loading || missingKeys.length > 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Agente pensando...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-6 w-6" />
                  Generar Estrategia con Agente
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
