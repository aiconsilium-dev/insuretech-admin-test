import Button from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function Modal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = '확인',
  cancelLabel = '취소',
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(15,23,42,0.4)] z-[500] flex items-center justify-center"
      onClick={onCancel}
    >
      <div
        className="bg-card rounded-modal p-[28px_28px_24px] max-w-[380px] w-[90%] border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[16px] font-bold tracking-[-0.3px] mb-[6px]">{title}</div>
        <div className="text-[13px] text-secondary leading-[1.6] mb-5 whitespace-pre-line">
          {description}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
