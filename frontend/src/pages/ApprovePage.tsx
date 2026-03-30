import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DetailCard,
  RadioOption,
  Timeline,
  Button,
  Modal,
  Toast,
} from '@/components/common';
import { typeCDetail, approveTimeline } from '@/lib/data';

export default function ApprovePage() {
  const navigate = useNavigate();
  const est = typeCDetail.estimationResult;
  const [selectedOption, setSelectedOption] = useState(0);
  const [comment, setComment] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const radioOptions = [
    'AI 산출액 그대로 승인 (607,850원)',
    '금액 수정 후 승인',
    '재분류 요청 (AI 재심사)',
  ];

  const handleApprove = () => {
    setModalOpen(false);
    setToastVisible(true);
    setTimeout(() => navigate('/claims'), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-[18px]">
        <div className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">손해사정사 최종 검토</div>
        <div className="text-[13px] text-secondary">CLM-2026-0247 / 헬리오시티 102동 1204호</div>
      </div>

      {/* 2-column */}
      <div className="grid grid-cols-2 gap-[14px]">
        {/* Left */}
        <div className="flex flex-col gap-[14px]">
          {/* AI Result */}
          <DetailCard title="AI 산출 결과 최종 확인" bodyClassName="text-center py-5 px-[18px]">
            <div className="text-[38px] font-bold text-txt tracking-[-1px]">
              {est.totalAmount.toLocaleString()}원
            </div>
            <div className="text-[12px] text-secondary mt-1">
              업체 견적 대비 -{est.savingsPercent}% / 산출 {est.calculationTime}
            </div>
          </DetailCard>

          {/* Options */}
          <DetailCard title="처리 옵션">
            {radioOptions.map((label, idx) => (
              <RadioOption
                key={idx}
                label={label}
                selected={selectedOption === idx}
                onChange={() => setSelectedOption(idx)}
              />
            ))}
            <div className="mt-3">
              <div className="text-[12px] font-semibold text-secondary mb-[6px]">검토 의견 (선택)</div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="AI 산출 결과에 대한 검토 의견을 입력하세요..."
                className="w-full border border-border rounded-btn py-[9px] px-[11px] text-[13px] font-sans resize-y min-h-[72px] text-txt outline-none bg-card transition-colors focus:border-primary"
              />
            </div>
          </DetailCard>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-[14px]">
          {/* Legal Opinion */}
          <DetailCard title="법률 의견서 첨부" bodyClassName="px-[18px] py-3">
            <div className="bg-primary-light border border-[#c7d2fe] rounded-btn py-[11px] px-[13px] flex gap-[10px] items-start">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-[1px]">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#4F46E5" strokeWidth="1.6" />
                <path d="M14 2v6h6M16 13H8M16 17H8" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div>
                <div className="font-semibold text-[13px] text-primary">보험업법 제185조 기반 손해사정 의견서</div>
                <div className="text-[11px] text-secondary mt-[2px]">APT Insurance 법무팀 첨부 완료 — 2026-03-14 09:45</div>
              </div>
            </div>
          </DetailCard>

          {/* Timeline */}
          <DetailCard title="처리 이력" bodyClassName="px-[18px] py-3">
            <Timeline items={approveTimeline} />
          </DetailCard>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="green"
              fullWidth
              className="py-[11px] text-[13px] justify-center"
              onClick={() => setModalOpen(true)}
            >
              최종 승인 및 지급 처리
            </Button>
            <Button
              variant="danger"
              onClick={() => setModalOpen(true)}
            >
              반려
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        title="지급 확정 완료"
        description={`607,850원 지급이 확정되었습니다. 청구인에게 SMS 알림이 발송되며 영업일 3일 이내 입금됩니다.\n\n총 처리 시간: 22분`}
        confirmLabel="확인"
        cancelLabel="취소"
        onConfirm={handleApprove}
        onCancel={() => setModalOpen(false)}
      />

      <Toast
        message="최종 승인이 완료되었습니다"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
