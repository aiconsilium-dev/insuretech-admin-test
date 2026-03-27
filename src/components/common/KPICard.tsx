import clsx from 'clsx';

interface KPICardProps {
  label: string;
  value: string | number;
  description?: string;
  chipLabel?: string;
  variant: 'total' | 'type-a' | 'type-b' | 'type-c';
  onClick?: () => void;
}

const valueColorMap = {
  total: 'text-txt',
  'type-a': 'text-amber',
  'type-b': 'text-red',
  'type-c': 'text-green',
};

const chipStyleMap = {
  total: '',
  'type-a': 'bg-amber-light text-amber',
  'type-b': 'bg-red-light text-red',
  'type-c': 'bg-green-light text-green',
};

export default function KPICard({
  label,
  value,
  description,
  chipLabel,
  variant,
  onClick,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-card p-[16px_18px] border border-border cursor-pointer transition-all hover:border-primary hover:shadow-ring-primary"
    >
      <div className="text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] mb-2">
        {label}
      </div>
      <div className={clsx('text-[28px] font-bold tracking-[-0.5px]', valueColorMap[variant])}>
        {value}
      </div>
      {description && (
        <div className="text-[11px] text-secondary mt-1">{description}</div>
      )}
      {chipLabel && (
        <div
          className={clsx(
            'inline-block text-[10px] font-semibold py-[2px] px-[7px] rounded-badge mt-[6px]',
            chipStyleMap[variant],
          )}
        >
          {chipLabel}
        </div>
      )}
    </div>
  );
}
