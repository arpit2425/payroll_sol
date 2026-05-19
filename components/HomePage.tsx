import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
    ArrowRight,
    Shield,
    Zap,
    MessageSquareText,
    Sparkles,
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const features = [
    {
        icon: MessageSquareText,
        title: 'Natural language payroll',
        body: 'Create orgs, fund treasuries and pay workers by chatting with an AI assistant — no forms to fill in.',
    },
    {
        icon: Shield,
        title: 'Non-custodial by design',
        body: 'Transactions are signed in your wallet. Your keys never leave the browser and funds stay under your control.',
    },
    {
        icon: Zap,
        title: 'Solana-fast settlement',
        body: 'Sub-second confirmations and negligible fees, whether you pay one contractor or a thousand.',
    },
];

const stats = [
    { value: '<1s', label: 'Avg. settlement' },
    { value: '99.9%', label: 'Network uptime' },
    { value: '100%', label: 'Self-custodial' },
];

const HomePage = () => {
    const { setVisible } = useWalletModal();
    const { connected, publicKey } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (connected && publicKey) {
            router.push('/dashboard');
        }
    }, [connected, publicKey, router]);

    const handleLaunchDashboard = useCallback(async () => {
        if (connected) {
            router.push('/dashboard');
            return;
        }
        setVisible(true);
    }, [connected, setVisible, router]);

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Subtle accent halo behind hero */}
            <div
                className="pointer-events-none absolute top-0 inset-x-0 h-[600px] z-0 opacity-50"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99, 102, 241, 0.18), transparent 70%)',
                }}
            />

            <Header />

            <main className="relative z-10 flex-1 pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-5 lg:px-8">
                    {/* Hero */}
                    <div className="max-w-3xl mx-auto text-center animate-fade-up">
                        <a
                            href="/features"
                            className="inline-flex items-center gap-1.5 pl-2 pr-3 py-1 rounded-full bg-[#131319] border border-[#23232d] hover:border-[#2e2e3a] text-[11px] font-medium text-[#c7c7cf] transition-colors"
                        >
                            <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-[#6366f1]/15 text-[#7c7ff5] text-[10px] font-semibold uppercase tracking-wider">
                                <Sparkles className="w-2.5 h-2.5" />
                                New
                            </span>
                            AI-powered payroll on Solana
                            <ArrowRight className="w-3 h-3 text-[#8b8b96]" />
                        </a>

                        <h1 className="mt-7 text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] leading-[0.95] text-white">
                            Payroll, reduced
                            <br />
                            to{' '}
                            <span className="bg-gradient-to-br from-[#a5a7f8] via-[#7c7ff5] to-[#6366f1] bg-clip-text text-transparent">
                                a conversation
                            </span>
                            .
                        </h1>

                        <p className="mt-7 text-[15px] sm:text-base text-[#aeaeb8] leading-[1.65] max-w-xl mx-auto">
                            Manage decentralized payroll through natural language. Create organizations,
                            fund treasuries, and settle payouts on-chain — all by chatting.
                        </p>

                        <div className="mt-9 flex flex-col sm:flex-row gap-2 justify-center">
                            <button
                                onClick={handleLaunchDashboard}
                                className="btn-primary group"
                            >
                                {connected ? 'Open dashboard' : 'Connect wallet'}
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                            </button>
                            <a href="/features" className="btn-secondary">
                                Learn more
                            </a>
                        </div>
                    </div>

                    {/* Product preview */}
                    <div className="mt-24 max-w-3xl mx-auto animate-fade-up">
                        <div className="relative">
                            {/* Subtle glow behind preview */}
                            <div
                                className="absolute -inset-px rounded-xl opacity-60 blur-2xl"
                                style={{
                                    background:
                                        'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(99, 102, 241, 0.3), transparent 70%)',
                                }}
                            />
                            <div className="relative bg-[#131319] border border-[#23232d] rounded-xl overflow-hidden">
                                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#23232d] bg-[#0e0e13]">
                                    <span className="w-2 h-2 rounded-full bg-[#23232d]" />
                                    <span className="w-2 h-2 rounded-full bg-[#23232d]" />
                                    <span className="w-2 h-2 rounded-full bg-[#23232d]" />
                                    <span className="ml-3 text-[11px] font-mono text-[#5e5e6b]">
                                        dapppay.sol — assistant
                                    </span>
                                </div>
                                <div className="p-7 space-y-5 text-[13px]">
                                    <div>
                                        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c7ff5] mb-1">You</div>
                                        <p className="text-white leading-[1.65]">Pay all workers in Acme this cycle.</p>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8b8b96] mb-1">Assistant</div>
                                        <p className="text-[#c7c7cf] leading-[1.65]">
                                            Distributed <span className="font-mono text-white">312.5 SOL</span> to{' '}
                                            <span className="font-mono text-white">8 workers</span> in Acme. Transaction confirmed in <span className="font-mono text-white">412ms</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-32">
                        <div className="text-center mb-12">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7c7ff5] mb-3">
                                Why DappPay
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                                Built for the way teams actually work.
                            </h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#23232d] border border-[#23232d] rounded-xl overflow-hidden">
                            {features.map((f) => (
                                <div
                                    key={f.title}
                                    className="bg-[#08080b] p-7 hover:bg-[#0e0e13] transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-md bg-[#131319] border border-[#23232d] flex items-center justify-center mb-5">
                                        <f.icon className="w-3.5 h-3.5 text-[#7c7ff5]" strokeWidth={2} />
                                    </div>
                                    <h3 className="text-[14px] font-semibold text-white mb-2 tracking-tight">
                                        {f.title}
                                    </h3>
                                    <p className="text-[13px] text-[#8b8b96] leading-[1.65]">{f.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 max-w-2xl mx-auto grid grid-cols-3 divide-x divide-[#23232d] border-y border-[#23232d]">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="text-center px-4 py-6"
                            >
                                <div className="text-3xl font-semibold tracking-tight text-white tabular-nums">
                                    {s.value}
                                </div>
                                <div className="mt-1 text-[11px] text-[#8b8b96] uppercase tracking-[0.08em] font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
