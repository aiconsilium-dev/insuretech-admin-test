import clsx from 'clsx';

interface CaseItemProps {
  caseNumber: string;
  description: string;
  numberColor?: 'primary' | 'red';
}

const colorMap = {
  primary: 'text-primary',
  red: 'text-red',
};

export default function CaseItem({
  caseNumber,
  description,
  numberColor = 'primary',
}: CaseItemProps) {
  return (
    <div className="flex gap-2 py-[7px] border-b border-border text-[12px] items-start last:border-b-0">
      <span
        className={clsx(
          'text-[10px] font-semibold whitespace-nowrap min-w-[130px] pt-[1px]',
          colorMap[numberColor],
        )}
      >
        {caseNumber}
      </span>
      <span>{description}</span>
    </div>
  );
}
