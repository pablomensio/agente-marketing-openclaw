"use client";
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { api } from '@/services/api';

export default function HealthBanner() {
  const { missingKeys, setMissingKeys } = useStore();

  useEffect(() => {
    api.getHealth().then(res => {
      if (res.status === 'error') {
        setMissingKeys(res.missing_keys);
      } else {
        setMissingKeys([]);
      }
    }).catch(err => console.error("Health check error", err));
  }, [setMissingKeys]);

  if (missingKeys.length === 0) return null;

  return (
    <div className="bg-destructive/90 text-destructive-foreground p-3 flex items-center justify-center gap-2 text-sm font-medium z-50">
      <AlertTriangle className="w-5 h-5" />
      <span>Atención: Faltan las siguientes API Keys en el backend ({missingKeys.join(', ')}). Las funciones de generación pueden fallar.</span>
    </div>
  );
}
