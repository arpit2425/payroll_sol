"use client";

import {
    Brain,
    Lock,
    Clock,
    MessageCircle,
    Sparkles,
    Bolt,
    Shield,
    Key,
    Zap,
    Database,
    TrendingUp,
    Globe,
    ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

const primaryFeatures = [
    {
        icon: Brain,
        title: 'AI-powered commands',
        description:
            'Talk to the assistant the way you would to a teammate. "Pay all contractors" or "add a new worker at 2 SOL/month" just works.',
        accent: '#14f195',
        items: [
            { icon: MessageCircle, text: 'Intuitive conversations' },
            { icon: Sparkles, text: 'Multi-step automation' },
            { icon: Bolt, text: 'Instant tool execution' },
        ],
    },
    {
        icon: Lock,
        title: 'Self-custodial security',
        description:
            'Every on-chain action is signed in your wallet. Funds never leave your control, and every transaction is auditable on Solana.',
        accent: '#14f195',
        items: [
            { icon: Shield, text: 'Non-custodial by default' },
            { icon: Key, text: 'Wallet-based access' },
            { icon: Zap, text: 'Full audit trails' },
        ],
    },
    {
        icon: Clock,
        title: 'Built for speed',
        description:
            'Solana’s throughput means sub-second settlement and negligible fees — suitable for one contractor or a full team.',
        accent: '#14f195',
        items: [
            { icon: Bolt, text: 'Sub-second confirmations' },
            { icon: Zap, text: 'Minimal transaction fees' },
            { icon: Sparkles, text: 'Scales with your team' },
        ],
    },
];

const additional = [
    {
        title: 'Multi-organization support',
        desc: 'Manage multiple companies or teams from a single workspace with fast switching.',
        icon: Database,
    },
    {
        title: 'Real-time analytics',
        desc: 'Track payroll trends, expenses and treasury flow with interactive reports.',
        icon: TrendingUp,
    },
    {
        title: 'Compliance tooling',
        desc: 'Built-in checks and records designed for global, distributed teams.',
        icon: Shield,
    },
    {
        title: 'Open integrations',
        desc: 'Connect with your HR, accounting and crypto tooling for a unified workflow.',
        icon: Globe,
    },
];

export default function FeaturesPage() {
    const router = useRouter();

    return (
        <div className="relative min-h-screen flex flex-col">
            <Header />

            <main className="relative z-10 flex-1">
                <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center animate-fade-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/70 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-[#14f195]" />
                            Features
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
                            Powerful tools for{' '}
                            <span className="gradient-text">modern payroll.</span>
                        </h1>
                        <p className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
                            DappPay combines AI intelligence, Solana speed and self-custodial
                            security to make decentralized payroll feel effortless.
                        </p>
                    </div>
                </section>

                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
                        {primaryFeatures.map((f, i) => (
                            <div
                                key={f.title}
                                className="surface-card surface-card-hover rounded-2xl p-7 animate-fade-up"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <div
                                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-5 border border-white/[0.08]"
                                    style={{ background: `${f.accent}14` }}
                                >
                                    <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-white/55 leading-relaxed mb-6">
                                    {f.description}
                                </p>
                                <ul className="space-y-2.5">
                                    {f.items.map((item) => (
                                        <li
                                            key={item.text}
                                            className="flex items-center gap-2.5 text-sm text-white/70"
                                        >
                                            <item.icon className="w-4 h-4 text-[#14f195]/80" />
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                Everything else you need
                            </h2>
                            <p className="mt-2 text-sm text-white/55">
                                A complete toolkit for running payroll on-chain.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {additional.map((f, i) => (
                                <div
                                    key={f.title}
                                    className="surface-card surface-card-hover rounded-xl p-6 flex items-start gap-4 animate-fade-up"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                                        <f.icon className="w-5 h-5 text-[#14f195]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-white mb-1">
                                            {f.title}
                                        </h4>
                                        <p className="text-sm text-white/55 leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="surface-card rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden">
                            <div
                                className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 60%)' }}
                            />
                            <div
                                className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(20,241,149,0.2), transparent 60%)' }}
                            />
                            <div className="relative">
                                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
                                    Ready to transform your payroll?
                                </h2>
                                <p className="text-white/60 mb-8 max-w-lg mx-auto">
                                    Connect a wallet and run your first on-chain payroll in minutes.
                                </p>
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="btn-primary group"
                                >
                                    Get started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
