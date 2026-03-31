import clsx from 'clsx';

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onChange: () => void;
}

export default function RadioOption({ label, selected, onChange }: RadioOptionProps) {
  return (
    <div
      onClick={onChange}
      className={clsx(
        'flex items-center gap-[10px] py-[11px] px-[13px] border-[1.5px] rounded-block cursor-pointer mb-[7px] text-[13px] font-medium transition-all',
        selected
          ? 'border-primary bg-primary-light'
          : 'border-border hover:border-primary',
      )}
    >
      <div
        className={clsx(
          'w-[17px] h-[17px] rounded-full border-[1.5px] shrink-0 flex items-center justify-center transition-all',
          selected ? 'border-primary bg-primary' : 'border-border',
        )}
      >
        {selected && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
      </div>
      {label}
    </div>
  );
}
