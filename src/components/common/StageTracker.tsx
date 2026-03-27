import clsx from 'clsx';
import type { StageData } from '@/lib/types';

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

interface StageTrackerProps {
  title: string;
  stages: StageData[];
}

export default function StageTracker({ title, stages }: StageTrackerProps) {
  return (
    <div className="bg-card rounded-card border border-border p-[16px_20px] mb-[14px]">
      <div className="text-[11px] font-bold text-secondary uppercase tracking-[0.5px] mb-[14px]">
        {title}
      </div>
      <div className="flex items-center gap-0">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {idx < stages.length - 1 && (
              <div className="absolute top-[14px] left-1/2 w-full h-[2px] bg-border z-0" />
            )}
            {/* Dot */}
            <div
              className={clsx(
                'w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold z-[1] relative transition-all',
                stage.status === 'done' && 'bg-green border-green text-white',
                stage.status === 'now' &&
                  'bg-primary border-primary text-white shadow-ring-primary-lg',
                stage.status === 'pending' && 'bg-card border-border text-secondary',
              )}
            >
              {stage.status === 'done' ? (
                <CheckIcon />
              ) : (
                <span className="text-[12px] font-bold">
                  {stage.stepNumber ?? idx + 1}
                </span>
              )}
            </div>
            {/* Label */}
            <div
              className={clsx(
                'text-[10px] text-secondary mt-[6px] text-center leading-[1.4] tracking-[-0.1px] whitespace-pre-line',
                stage.status === 'done' && 'text-green font-semibold',
                stage.status === 'now' && 'text-primary font-bold',
              )}
            >
              {stage.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
