import type { BarItem } from '@/lib/types';

const colorMap = {
  amber: 'bg-amber',
  red: 'bg-red',
  green: 'bg-green',
};

interface BarChartProps {
  items: BarItem[];
}

export default function BarChart({ items }: BarChartProps) {
  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-[10px] mb-[9px]">
          <div className="text-[11px] font-medium text-secondary w-16 text-right shrink-0">
            {item.label}
          </div>
          <div className="flex-1 h-4 bg-border-light rounded-[3px] overflow-hidden">
            <div
              className={`h-full rounded-[3px] flex items-center justify-end pr-[5px] text-white text-[9px] font-bold ${colorMap[item.color]}`}
              style={{ width: `${item.value}%` }}
            >
              {item.value}%
            </div>
          </div>
          <div className="text-[11px] font-semibold w-9 text-right shrink-0 text-txt">
            {item.value}%
          </div>
        </div>
      ))}
    </div>
  );
}
