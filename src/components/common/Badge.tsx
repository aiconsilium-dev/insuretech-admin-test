import clsx from 'clsx';

interface BadgeProps {
  variant: 'ba' | 'bb' | 'bc';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  ba: 'bg-amber-light text-amber',
  bb: 'bg-red-light text-red',
  bc: 'bg-green-light text-green',
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'text-[10px] font-semibold px-2 py-[2px] rounded-badge tracking-[0.2px] inline-block',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
