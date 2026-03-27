import clsx from 'clsx';

interface PhotoBadge {
  text: string;
  color: string;
  position: 'top-right' | 'bottom-left' | 'bottom-right';
}

interface PhotoPlaceholderProps {
  label: string;
  aspectRatio?: string;
  span?: number;
  badges?: PhotoBadge[];
  borderStyle?: 'dashed-primary' | 'dashed-amber' | 'none';
  bgColor?: string;
}

const positionMap = {
  'top-right': 'top-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-2 right-2',
};

export default function PhotoPlaceholder({
  label,
  aspectRatio = '4/3',
  span,
  badges = [],
  borderStyle = 'none',
  bgColor = '#d8e4ed',
}: PhotoPlaceholderProps) {
  return (
    <div
      className={clsx(
        'bg-border-light rounded-block flex items-center justify-center relative overflow-hidden',
        borderStyle === 'dashed-primary' && 'border-[1.5px] border-dashed border-primary',
        borderStyle === 'dashed-amber' && 'border-[1.5px] border-dashed border-amber',
      )}
      style={{
        aspectRatio,
        gridColumn: span ? `span ${span}` : undefined,
        backgroundColor: bgColor,
      }}
    >
      <div className="flex flex-col items-center gap-[6px] text-secondary">
        <svg width={span === 2 ? 28 : 22} height={span === 2 ? 28 : 22} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" stroke="#64748B" strokeWidth="1.5" />
        </svg>
        <span className="text-[11px] text-secondary">{label}</span>
      </div>
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className={clsx(
            'absolute text-[10px] font-semibold px-2 py-[3px] rounded-badge text-white',
            positionMap[badge.position],
          )}
          style={{ backgroundColor: badge.color }}
        >
          {badge.text}
        </div>
      ))}
    </div>
  );
}
