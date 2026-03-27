import clsx from 'clsx';

interface CheckboxRowProps {
  checked: boolean;
  onChange: () => void;
}

export default function CheckboxRow({ checked, onChange }: CheckboxRowProps) {
  return (
    <div
      onClick={onChange}
      className={clsx(
        'w-[15px] h-[15px] rounded-badge border-[1.5px] cursor-pointer inline-flex items-center justify-center text-[9px] transition-all align-middle shrink-0',
        checked ? 'bg-primary border-primary text-white' : 'border-border',
      )}
    >
      {checked ? '✓' : ''}
    </div>
  );
}
