import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from './animated-number';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'gray' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  gray: 'bg-gray-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
};

export function KPICard({ title, value, icon: Icon, color = 'blue', trend, description }: KPICardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base md:text-lg font-semibold text-gray-700">{title}</CardTitle>
        {Icon && (
          <div className={cn('p-3 md:p-4 rounded-full text-white shadow-md', colorClasses[color])}>
            <Icon className="h-6 w-6 md:h-8 md:w-8" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
          {typeof value === 'number' ? (
            <AnimatedNumber 
              value={value} 
              duration={1500}
            />
          ) : typeof value === 'string' && /^\d+/.test(value) ? (
            (() => {
              const match = value.match(/^(\d+)(.*)$/);
              if (match) {
                const num = parseInt(match[1], 10);
                const suffix = match[2];
                return (
                  <>
                    <AnimatedNumber value={num} duration={1500} />
                    {suffix}
                  </>
                );
              }
              return value;
            })()
          ) : (
            value
          )}
        </div>
        {trend && (
          <p className={cn(
            "text-sm md:text-base mt-2 font-semibold",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
          </p>
        )}
        {description && (
          <p className="text-sm md:text-base text-gray-600 mt-2 font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

