import clsx from 'clsx';

interface DetailCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function DetailCard({
  title,
  children,
  className,
  bodyClassName,
}: DetailCardProps) {
  return (
    <div className={clsx('bg-card rounded-card border border-border', className)}>
      <div className="px-[18px] pt-[14px] pb-3 text-[11px] font-bold text-secondary uppercase tracking-[0.5px] border-b border-border">
        {title}
      </div>
      <div className={clsx('py-[16px] px-[18px]', bodyClassName)}>{children}</div>
    </div>
  );
}
