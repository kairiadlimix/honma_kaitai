'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  Droplet, 
  DollarSign,
  Settings
} from 'lucide-react';

const menuItems = [
  { href: '/', label: '全社サマリー', icon: LayoutDashboard },
  { href: '/machines', label: '重機一覧', icon: Wrench },
  { href: '/rankings', label: '稼働ランキング', icon: TrendingUp },
  { href: '/consumables', label: '消耗品管理', icon: Droplet },
  { href: '/cost-analysis', label: 'コスト分析', icon: DollarSign },
  { href: '/risk-analysis', label: '故障リスク分析', icon: AlertTriangle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-50 border-r min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">重機稼働予測</h1>
        <p className="text-xs text-gray-500 mt-1">ダッシュボード</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

