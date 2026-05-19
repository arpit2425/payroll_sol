import { X, ChevronRight, Plus } from 'lucide-react';
import { PayrollSummary } from '@/utils/interface';

interface OrganizationsPanelProps {
    organizations: PayrollSummary[];
    selectedOrg: string | null;
    isOpen: boolean;
    onToggle: () => void;
    onSelectOrg: (id: string) => void;
    onViewDetails: (orgName: string) => void;
    formatLamports: (lamports: number) => string;
}

const OrganizationsPanel: React.FC<OrganizationsPanelProps> = ({
    organizations,
    selectedOrg,
    isOpen,
    onToggle,
    onSelectOrg,
    onViewDetails,
    formatLamports,
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Mobile overlay */}
            <div
                className="lg:hidden fixed inset-0 z-40 bg-black/70"
                onClick={onToggle}
            />

            <aside
                className="fixed lg:static bottom-0 inset-x-0 lg:inset-auto z-40 lg:z-auto
                    lg:col-span-1 flex flex-col
                    bg-[#131319] border border-[#23232d] rounded-t-xl lg:rounded-lg
                    max-h-[85vh] lg:max-h-none h-[85vh] lg:h-auto
                    overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#23232d] bg-[#0e0e13]">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-semibold text-white tracking-tight">
                            Organizations
                        </h3>
                        <span className="text-[10px] px-1.5 py-px rounded bg-[#1a1a22] border border-[#23232d] text-[#8b8b96] tabular-nums font-mono">
                            {organizations.length}
                        </span>
                    </div>
                    <button
                        onClick={onToggle}
                        className="p-1 rounded text-[#8b8b96] hover:text-white hover:bg-[#1a1a22] transition-colors lg:hidden"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {organizations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
                            <div className="w-10 h-10 rounded-lg bg-[#1a1a22] border border-[#23232d] flex items-center justify-center mb-3">
                                <Plus className="w-4 h-4 text-[#8b8b96]" strokeWidth={1.75} />
                            </div>
                            <h4 className="text-[13px] font-semibold text-white mb-1">
                                No organizations
                            </h4>
                            <p className="text-[12px] text-[#8b8b96] max-w-[220px] leading-relaxed">
                                Ask the assistant to create one to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="p-1.5">
                            {organizations.map((org) => {
                                const selected = selectedOrg === org.id;
                                return (
                                    <button
                                        key={org.id}
                                        onClick={() => onSelectOrg(org.id)}
                                        className={`w-full text-left px-3 py-2.5 rounded-md transition-colors group relative ${
                                            selected
                                                ? 'bg-[#1f1f29]'
                                                : 'hover:bg-[#1a1a22]'
                                        }`}
                                    >
                                        {selected && (
                                            <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-[#6366f1]" />
                                        )}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h4 className="text-[13px] font-semibold text-white truncate">
                                                {org.orgName}
                                            </h4>
                                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selected ? 'text-[#7c7ff5] translate-x-0.5' : 'text-[#3a3a48] group-hover:text-[#8b8b96]'}`} strokeWidth={2} />
                                        </div>

                                        <div className="flex items-center gap-3 text-[11px] text-[#8b8b96] mb-2.5">
                                            <span className="flex items-center gap-1 tabular-nums font-mono">
                                                <span className="w-1 h-1 rounded-full bg-[#3a3a48]" />
                                                {formatLamports(org.treasury)}
                                            </span>
                                            <span className="flex items-center gap-1 tabular-nums">
                                                <span className="w-1 h-1 rounded-full bg-[#3a3a48]" />
                                                {org.workers.length} {org.workers.length === 1 ? 'worker' : 'workers'}
                                            </span>
                                        </div>

                                        <span
                                            role="button"
                                            tabIndex={0}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewDetails(org.orgName);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.stopPropagation();
                                                    onViewDetails(org.orgName);
                                                }
                                            }}
                                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8b8b96] hover:text-[#7c7ff5] transition-colors cursor-pointer"
                                        >
                                            View details →
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-[#23232d] bg-[#0e0e13]">
                    <div className="flex items-center justify-between text-[10px] text-[#8b8b96]">
                        <div className="flex items-center gap-1.5 uppercase tracking-[0.08em] font-semibold">
                            <span className="w-1 h-1 rounded-full bg-[#6366f1] shadow-[0_0_6px_0_rgba(99,102,241,0.6)]" />
                            Devnet
                        </div>
                        <span className="font-mono text-[#5e5e6b]">v0.1</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default OrganizationsPanel;
