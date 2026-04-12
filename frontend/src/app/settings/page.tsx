"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';
import { api } from '@/services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    meta_api_key_masked: '',
    gemini_api_key_masked: '',
    whatsapp_api_key_masked: ''
  });

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración y Seguridad</h1>
        <p className="text-gray-400 mt-2">Política Zero Trust: Las API keys reales solo viven en el entorno del backend. Aquí puedes verificar su estado.</p>
      </div>

      <Card className="bg-[#1E1E1E] border-[#2C2C2C]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Integraciones Activas
          </CardTitle>
          <CardDescription className="text-gray-400">
            Mostrando solo los últimos 4 caracteres por seguridad.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Meta Graph API Key v25.0</Label>
            <Input
              readOnly
              value={settings.meta_api_key_masked}
              className="bg-[#121212] border-[#2C2C2C] text-gray-400 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Google Gemini API Key (Agente Creativo)</Label>
            <Input
              readOnly
              value={settings.gemini_api_key_masked}
              className="bg-[#121212] border-[#2C2C2C] text-gray-400 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Business API Key (Futuro bot de ventas)</Label>
            <Input
              readOnly
              value={settings.whatsapp_api_key_masked}
              className="bg-[#121212] border-[#2C2C2C] text-gray-400 font-mono"
            />
          </div>

          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-500">
            <strong>Nota de seguridad:</strong> Para actualizar una clave, debes editar el archivo <code>.env</code> en el servidor y reiniciar el contenedor del backend.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
