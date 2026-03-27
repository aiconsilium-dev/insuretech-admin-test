import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  isSub?: boolean;
  end?: boolean;
}

function NavItem({ to, label, icon, isSub, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-[9px] py-2 px-4 text-[13px] font-medium cursor-pointer transition-all text-secondary border-l-2 border-transparent my-[1px]',
          isSub && 'pl-7 text-[12px]',
          isActive
            ? 'bg-primary-light text-primary border-l-primary font-semibold [&_svg]:opacity-100'
            : 'hover:bg-border-light hover:text-txt [&_svg]:opacity-70',
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

const DashboardIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const ClaimsIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.6" />
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const EstimationIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const ApproveIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const OpinionIcon = () => (
  <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M14 2v6h6M16 13H8M16 17H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default function Sidebar() {
  return (
    <aside className="w-sidebar bg-card border-r border-border flex flex-col shrink-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-[20px_20px_16px] border-b border-border">
        <div className="inline-block bg-primary-light text-primary text-[10px] font-bold px-2 py-[2px] rounded-badge tracking-[0.3px] mb-[6px]">
          AI 청구 관리
        </div>
        <div className="text-[13px] font-bold text-txt leading-[1.5] tracking-[-0.2px]">
          APT Insurance
        </div>
        <div className="text-[10px] text-secondary mt-[3px]">apt-insurance.ai</div>
      </div>

      {/* Navigation */}
      <div className="py-2">
        <div className="text-[10px] font-semibold text-secondary px-4 pt-2 pb-1 uppercase tracking-[0.6px]">
          Overview
        </div>
        <NavItem to="/" label="대시보드" icon={<DashboardIcon />} end />

        <div className="text-[10px] font-semibold text-secondary px-4 pt-2 pb-1 uppercase tracking-[0.6px]">
          청구 관리
        </div>
        <NavItem to="/claims" label="청구 목록" icon={<ClaimsIcon />} />
        <NavItem to="/type-a" label="TYPE A — 하자소송 이관" isSub />
        <NavItem to="/type-b" label="TYPE B — 면책" isSub />
        <NavItem to="/type-c" label="TYPE C — 지급" isSub />
        <NavItem to="/estimation" label="적산 결과 검토" icon={<EstimationIcon />} />
        <NavItem to="/approve" label="손해사정사 승인" icon={<ApproveIcon />} />
        <NavItem to="/opinion" label="법률 의견서" icon={<OpinionIcon />} />
      </div>

      {/* Footer */}
      <div className="mt-auto p-[14px_16px] border-t border-border text-[11px] text-secondary leading-[1.6]">
        APT Insurance
      </div>
    </aside>
  );
}
