import clsx from 'clsx';

interface KVRowProps {
  label: string;
  value: string | React.ReactNode;
  valueColor?: 'green' | 'red' | 'amber' | 'primary';
  valueFontSize?: string;
  isLast?: boolean;
}

const colorMap = {
  green: 'text-green',
  red: 'text-red',
  amber: 'text-amber',
  primary: 'text-primary',
};

export default function KVRow({
  label,
  value,
  valueColor,
  valueFontSize,
  isLast,
}: KVRowProps) {
  return (
    <div
      className={clsx(
        'flex justify-between items-center py-2 text-[13px]',
        !isLast && 'border-b border-border',
      )}
    >
      <span className="text-secondary">{label}</span>
      <span
        className={clsx('font-semibold', valueColor && colorMap[valueColor])}
        style={valueFontSize ? { fontSize: valueFontSize } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
