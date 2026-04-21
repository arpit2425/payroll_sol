import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
    ArrowRight,
    Sparkles,
    Shield,
    Zap,
    MessageSquareText,
    Wallet,
    TrendingUp,
    Clock,
    Lock,
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
    { icon: Clock, value: '<1s', label: 'Avg. settlement' },
    { icon: TrendingUp, value: '99.9%', label: 'Network uptime' },
    { icon: Lock, value: '100%', label: 'Self-custodial' },
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
        <div className="relative min-h-screen flex flex-col overflow-hidden">
            <Header />

            <main className="relative z-10 flex-1 pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero */}
                    <div className="max-w-3xl mx-auto text-center animate-fade-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/70">
                            <Sparkles className="w-3.5 h-3.5 text-[#14f195]" />
                            AI-powered payroll on Solana
                        </div>

                        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
                            Payroll, reduced to{' '}
                            <span className="gradient-text">a conversation.</span>
                        </h1>

                        <p className="mt-6 text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
                            Manage decentralized payroll through natural language. Create
                            organizations, fund treasuries, and settle payouts on-chain — all by
                            chatting with your assistant.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleLaunchDashboard}
                                className="btn-primary group"
                            >
                                {connected ? 'Open dashboard' : 'Connect wallet'}
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </button>
                            <a href="/features" className="btn-secondary">
                                Explore features
                            </a>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
                            <Wallet className="w-3.5 h-3.5" />
                            Supports Phantom · Devnet
                        </div>
                    </div>

                    {/* Product preview card */}
                    <div className="mt-20 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '120ms' }}>
                        <div className="surface-card rounded-2xl p-2 shadow-[0_30px_80px_-30px_rgba(153,69,255,0.35)]">
                            <div className="rounded-xl bg-[#0a0a14] border border-white/[0.06] overflow-hidden">
                                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    <span className="ml-3 text-xs font-mono text-white/40">
                                        dapppay.sol / assistant
                                    </span>
                                </div>
                                <div className="p-6 sm:p-8 space-y-4 text-sm">
                                    <div className="flex justify-end">
                                        <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-[#14f195] text-[#0a0a12] font-medium">
                                            Pay all workers in Acme this cycle
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] text-white/80">
                                            <div className="text-xs text-[#14f195] font-medium mb-1">
                                                Payroll processed
                                            </div>
                                            Distributed <span className="font-mono text-white">312.5 SOL</span> to{' '}
                                            <span className="font-mono text-white">8 workers</span> in Acme. Signature ready
                                            for review.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <div
                                key={f.title}
                                className="surface-card surface-card-hover rounded-xl p-6 animate-fade-up"
                                style={{ animationDelay: `${180 + i * 80}ms` }}
                            >
                                <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
                                    <f.icon className="w-5 h-5 text-[#14f195]" strokeWidth={2} />
                                </div>
                                <h3 className="text-[15px] font-semibold text-white mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-white/60 leading-relaxed">{f.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-3 max-w-3xl mx-auto rounded-xl surface-card overflow-hidden">
                        {stats.map((s, i) => (
                            <div
                                key={s.label}
                                className={`p-6 text-center ${
                                    i !== stats.length - 1 ? 'border-r border-white/[0.06]' : ''
                                }`}
                            >
                                <s.icon className="w-4 h-4 text-white/40 mx-auto mb-2" />
                                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                    {s.value}
                                </div>
                                <div className="mt-1 text-xs text-white/50">{s.label}</div>
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
