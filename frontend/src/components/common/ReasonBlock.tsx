import clsx from 'clsx';

interface ReasonBlockProps {
  items: string[];
  dotColor?: 'primary' | 'red' | 'green' | 'amber';
}

const dotColorMap = {
  primary: 'bg-primary',
  red: 'bg-red',
  green: 'bg-green',
  amber: 'bg-amber',
};

export default function ReasonBlock({ items, dotColor = 'primary' }: ReasonBlockProps) {
  return (
    <div className="bg-border-light rounded-block py-[12px] px-[14px] text-[13px] leading-[1.7]">
      {items.map((item, idx) => (
        <div key={idx} className={clsx('flex gap-2 items-start', idx < items.length - 1 && 'mb-[5px]')}>
          <div className={clsx('w-1 h-1 rounded-full mt-2 shrink-0', dotColorMap[dotColor])} />
          <div>{item}</div>
        </div>
      ))}
    </div>
  );
}
