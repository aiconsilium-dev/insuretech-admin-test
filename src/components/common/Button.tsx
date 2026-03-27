import clsx from 'clsx';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'green' | 'danger';
  size?: 'sm' | 'default';
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}

const variantStyles = {
  primary: 'bg-primary text-white border-transparent hover:bg-primary-hover',
  secondary: 'bg-bg text-txt border border-border hover:bg-border-light',
  green: 'bg-green text-white border-transparent hover:bg-green-hover',
  danger: 'bg-red-light text-red border border-red-border hover:bg-[#FEE2E2]',
};

const sizeStyles = {
  default: 'py-2 px-[14px] text-[12px]',
  sm: 'py-1 px-[10px] text-[11px]',
};

export default function Button({
  variant,
  size = 'default',
  children,
  onClick,
  className,
  fullWidth,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-[6px] rounded-btn font-semibold cursor-pointer transition-all tracking-[-0.1px] whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full justify-center',
        className,
      )}
    >
      {children}
    </button>
  );
}
