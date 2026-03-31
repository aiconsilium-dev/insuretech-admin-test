import clsx from 'clsx';
import type { TimelineItemData } from '@/lib/types';

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function TimelineItem({
  title,
  time,
  status,
  stepNumber,
  isLast,
}: TimelineItemData & { isLast: boolean }) {
  return (
    <div className="flex gap-3 py-2 relative">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[11px] top-[27px] h-[calc(100%)] w-px bg-border" />
      )}
      {/* Dot */}
      <div
        className={clsx(
          'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-[1.5px] relative z-[1]',
          status === 'done' && 'bg-green border-green text-white',
          status === 'now' && 'bg-primary border-primary text-white',
          status === 'wait' && 'bg-border-light border-border text-secondary',
        )}
      >
        {status === 'done' ? (
          <CheckIcon />
        ) : (
          <span className="text-[11px] font-bold">{stepNumber}</span>
        )}
      </div>
      {/* Content */}
      <div>
        <div className="text-[13px] font-semibold mb-[1px]">{title}</div>
        <div className="text-[11px] text-secondary">{time}</div>
      </div>
    </div>
  );
}

interface TimelineProps {
  items: TimelineItemData[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, idx) => (
        <TimelineItem key={idx} {...item} isLast={idx === items.length - 1} />
      ))}
    </div>
  );
}
