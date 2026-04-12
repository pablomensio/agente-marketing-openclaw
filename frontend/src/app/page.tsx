"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { DollarSign, Users, Target } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const { refreshKey } = useStore();

  useEffect(() => {
    api.getCampaigns().then(data => setCampaigns(data.slice(0, 5))).catch(err => console.error(err));
  }, [refreshKey]);

  const hasPending = campaigns.some(c => c.status === 'PENDING_APPROVAL');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Activa</Badge>;
      case 'PENDING_APPROVAL': return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Pendiente Aprob.</Badge>;
      case 'DRAFT': return <Badge variant="outline" className="text-gray-400">Borrador</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Rechazada</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1E1E1E] rounded-full border border-[#2C2C2C]">
          <div className={`w-3 h-3 rounded-full ${hasPending ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-sm font-medium">
            {hasPending ? '🟡 Esperando Aprobación' : '🟢 Agente en Línea'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#1E1E1E] border-[#2C2C2C]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Gasto Total (Mock)</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-green-500">+15% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E1E] border-[#2C2C2C]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Leads Generados (Mock)</CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-green-500">+8% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1E1E1E] border-[#2C2C2C]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">CPL Promedio (Mock)</CardTitle>
            <Target className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$36.40</div>
            <p className="text-xs text-red-500">+2% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1E1E1E] border-[#2C2C2C]">
        <CardHeader>
          <CardTitle>Últimas Campañas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#2C2C2C]">
                <TableHead>Campaña</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Presupuesto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow className="border-[#2C2C2C] hover:bg-[#2C2C2C]/50">
                  <TableCell colSpan={4} className="text-center text-gray-500 py-6">No hay campañas registradas</TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c.id} className="border-[#2C2C2C] hover:bg-[#2C2C2C]/50">
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell>{c.product_name}</TableCell>
                    <TableCell>${c.daily_budget}/día</TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
