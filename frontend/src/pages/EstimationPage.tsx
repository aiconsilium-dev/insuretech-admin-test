import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  CheckboxRow,
  Button,
  Toast,
} from '@/components/common';
import { estimationRows, estimationDeductions, typeCDetail } from '@/lib/data';

export default function EstimationPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(estimationRows);
  const [toastVisible, setToastVisible] = useState(false);

  const toggleRow = (id: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)),
    );
  };

  const checkedSubtotal = rows.filter((r) => r.checked).reduce((sum, r) => sum + r.subtotal, 0);
  const indirect = Math.round(checkedSubtotal * estimationDeductions.indirectRate);
  const subtotalWithIndirect = checkedSubtotal + indirect;
  const depreciation = estimationDeductions.depreciation;
  const deductible = estimationDeductions.deductible;
  const finalAmount = subtotalWithIndirect - depreciation - deductible;

  const vendorEstimate = typeCDetail.estimationResult.vendorEstimate;
  const savingsPercent = (((vendorEstimate - finalAmount) / vendorEstimate) * 100).toFixed(1);

  return (
    <div>
      {/* Header */}
      <div className="mb-[18px]">
        <div className="text-[18px] font-bold tracking-[-0.4px] mb-[3px]">수량 내역서 — CLM-2026-0247</div>
        <div className="text-[13px] text-secondary">2026년 1분기 건설물가정보지 단가 적용</div>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-card border border-border overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border w-[36px]">&nbsp;</th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-left">공종명</th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-left">수량 / 단위</th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-left">단가 기준</th>
              <th className="bg-border-light text-[11px] font-semibold text-secondary uppercase tracking-[0.4px] py-[9px] px-4 border-b border-border text-right">소계</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border"
              >
                <td className="py-[11px] px-4">
                  <CheckboxRow checked={row.checked} onChange={() => toggleRow(row.id)} />
                </td>
                <td className="py-[11px] px-4">
                  <div className={clsx('font-semibold', !row.checked && 'line-through text-muted')}>{row.name}</div>
                  <div className={clsx('text-[11px]', row.checked ? 'text-secondary' : 'text-muted')}>{row.description}</div>
                </td>
                <td className={clsx('py-[11px] px-4 text-[13px]', !row.checked && 'line-through text-muted')}>
                  {row.quantity} {row.unit}
                </td>
                <td className="py-[11px] px-4">
                  {row.checked && row.standardLabel ? (
                    <span className={clsx(
                      'text-[10px] font-semibold py-[2px] px-[7px] rounded-badge',
                      row.standardVariant === 'green' ? 'bg-green-light text-green' : 'bg-primary-light text-primary',
                    )}>
                      {row.standardLabel}
                    </span>
                  ) : !row.checked ? '—' : null}
                </td>
                <td className={clsx('py-[11px] px-4 text-[13px] font-semibold text-right', !row.checked && 'line-through text-muted')}>
                  {row.subtotal.toLocaleString()}원
                </td>
              </tr>
            ))}

            {/* Subtotal */}
            <tr className="bg-border-light">
              <td colSpan={4} className="py-[10px] px-4 text-[13px] font-semibold">
                소계 ({rows.filter(r => r.checked).length}개 공종) + 간접비 {(estimationDeductions.indirectRate * 100).toFixed(1)}%
              </td>
              <td className="py-[10px] px-4 text-[13px] font-bold text-right">
                {subtotalWithIndirect.toLocaleString()}원
              </td>
            </tr>

            {/* Depreciation */}
            <tr>
              <td colSpan={4} className="py-[9px] px-4 text-[13px] text-red">
                감가상각 (건축 9.2년 / 내용연수 40년)
              </td>
              <td className="py-[9px] px-4 text-[13px] font-semibold text-right text-red">
                -{depreciation.toLocaleString()}원
              </td>
            </tr>

            {/* Deductible */}
            <tr>
              <td colSpan={4} className="py-[9px] px-4 text-[13px] text-red">
                자기부담금 (약관 기준)
              </td>
              <td className="py-[9px] px-4 text-[13px] font-semibold text-right text-red">
                -{deductible.toLocaleString()}원
              </td>
            </tr>

            {/* Final */}
            <tr className="bg-primary-light">
              <td colSpan={4} className="py-3 px-4 text-[14px] font-bold">
                최종 지급 보험금
              </td>
              <td className="py-3 px-4 text-[14px] font-bold text-right text-green">
                {finalAmount.toLocaleString()}원
              </td>
            </tr>
          </tbody>
        </table>

        {/* Savings Footer */}
        <div className="px-[18px] py-[11px] bg-amber-light flex justify-between text-[13px] border-t border-amber-border">
          <span>업체 제출 견적: {vendorEstimate.toLocaleString()}원 / AI 산출 대비</span>
          <strong className="text-amber">-{(vendorEstimate - finalAmount).toLocaleString()}원 절감 (-{savingsPercent}%)</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-[14px]">
        <Button
          variant="green"
          onClick={() => {
            setToastVisible(true);
            setTimeout(() => navigate('/approve'), 1500);
          }}
        >
          손해사정사 승인 요청
        </Button>
        <Button variant="secondary" onClick={() => setToastVisible(true)}>
          항목 수정 후 재산출
        </Button>
        <Button variant="secondary" onClick={() => navigate('/type-c')}>
          적산 요약으로 돌아가기
        </Button>
      </div>

      <Toast
        message="승인 요청이 전송되었습니다"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </div>
  );
}
