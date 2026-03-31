import clsx from 'clsx';

interface StatusPillProps {
  variant: 'done' | 'sent' | 'wait' | 'transfer';
  children: React.ReactNode;
}

const variantStyles = {
  done: 'bg-green-light text-green',
  sent: 'bg-primary-light text-primary',
  wait: 'bg-amber-light text-amber',
  transfer: 'bg-transfer-light text-transfer',
};

export default function StatusPill({ variant, children }: StatusPillProps) {
  return (
    <span
      className={clsx(
        'text-[11px] font-semibold px-[9px] py-[2px] rounded-badge inline-block',
        variantStyles[variant],
      )}
    >
      {children}
    </span>
  );
}
