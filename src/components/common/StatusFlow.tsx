import clsx from 'clsx';

interface StatusFlowProps {
  items: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function StatusFlow({ items, activeIndex, onChange }: StatusFlowProps) {
  return (
    <div className="flex gap-0 bg-border-light rounded-block p-1 mb-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onChange(idx)}
          className={clsx(
            'flex-1 py-[7px] px-[6px] text-center rounded-[6px] text-[11px] font-medium text-secondary cursor-pointer transition-all',
            idx === activeIndex && 'bg-card text-primary font-bold shadow-subtle',
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
