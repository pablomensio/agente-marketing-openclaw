"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wand2, CheckSquare, Settings, Car } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/builder', label: 'Constructor', icon: Wand2 },
  { href: '/approvals', label: 'Aprobaciones', icon: CheckSquare },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1E1E1E] border-r border-[#2C2C2C] flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-[#2C2C2C]">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Car className="w-6 h-6" />
        </div>
        <h1 className="font-bold text-lg leading-tight">Auto<br/>Marketing</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-[#2C2C2C] text-primary font-medium' : 'text-gray-400 hover:text-white hover:bg-[#2C2C2C]/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#2C2C2C]">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Sistema Operativo
        </div>
      </div>
    </aside>
  );
}
