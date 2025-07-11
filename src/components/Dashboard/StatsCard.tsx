import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'gold' | 'green' | 'red';
}

export default function StatsCard({ title, value, icon: Icon, trend, color = 'default' }: StatsCardProps) {
  const colorClasses = {
    default: 'bg-elegant-black text-white',
    gold: 'bg-gold-500 text-white',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-elegant-black mt-1">
            {typeof value === 'number' && title.toLowerCase().includes('sales') || title.toLowerCase().includes('profit') 
              ? `KSh ${value.toLocaleString()}`
              : value
            }
          </p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}