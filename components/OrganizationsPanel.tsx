import { X, Building2, ArrowUpRight, Wallet, Users } from 'lucide-react';
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
                className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={onToggle}
            />

            <aside
                className="fixed lg:static bottom-0 inset-x-0 lg:inset-auto z-40 lg:z-auto
                    lg:col-span-1 flex flex-col
                    surface-card rounded-t-2xl lg:rounded-xl
                    max-h-[85vh] lg:max-h-none h-[85vh] lg:h-auto
                    overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white/70" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white leading-tight">
                                Organizations
                            </h3>
                            <p className="text-[11px] text-white/50 mt-0.5">
                                {organizations.length}{' '}
                                {organizations.length === 1 ? 'organization' : 'organizations'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors lg:hidden"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-4 space-y-2.5">
                    {organizations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-3">
                                <Building2 className="w-5 h-5 text-white/40" />
                            </div>
                            <h4 className="text-sm font-medium text-white mb-1">
                                No organizations yet
                            </h4>
                            <p className="text-xs text-white/50 max-w-[220px]">
                                Ask the assistant to create your first organization to get started.
                            </p>
                        </div>
                    ) : (
                        organizations.map((org) => {
                            const selected = selectedOrg === org.id;
                            return (
                                <button
                                    key={org.id}
                                    onClick={() => onSelectOrg(org.id)}
                                    className={`w-full text-left rounded-xl border transition-all duration-200 group ${
                                        selected
                                            ? 'bg-white/[0.06] border-white/[0.18]'
                                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                                    }`}
                                >
                                    <div className="px-4 py-3.5">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <h4 className="text-sm font-semibold text-white truncate">
                                                {org.orgName}
                                            </h4>
                                            <span
                                                className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${
                                                    selected ? 'bg-[#14f195]' : 'bg-white/30'
                                                }`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="rounded-lg bg-black/20 border border-white/[0.05] px-2.5 py-2">
                                                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wide mb-1">
                                                    <Wallet className="w-3 h-3" />
                                                    Treasury
                                                </div>
                                                <div className="text-sm font-semibold text-white tabular-nums">
                                                    {formatLamports(org.treasury)}
                                                </div>
                                            </div>
                                            <div className="rounded-lg bg-black/20 border border-white/[0.05] px-2.5 py-2">
                                                <div className="flex items-center gap-1.5 text-[10px] text-white/50 uppercase tracking-wide mb-1">
                                                    <Users className="w-3 h-3" />
                                                    Workers
                                                </div>
                                                <div className="text-sm font-semibold text-white tabular-nums">
                                                    {org.workers.length}
                                                </div>
                                            </div>
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
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#14f195] hover:text-white transition-colors cursor-pointer"
                                        >
                                            View details
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-5 py-3 border-t border-white/[0.06] bg-black/20 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#14f195]" />
                        Live on Solana Devnet
                    </div>
                </div>
            </aside>
        </>
    );
};

export default OrganizationsPanel;
