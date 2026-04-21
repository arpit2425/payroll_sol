"use client";

import {
    Sparkles,
    Shield,
    Zap,
    Users,
    Award,
    Target,
    Heart,
    BookOpen,
    Code2,
    TrendingUp,
    ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const stats = [
    { value: '9+', label: 'Years experience' },
    { value: '500+', label: 'Developers trained' },
    { value: '50+', label: 'Projects shipped' },
    { value: '5K+', label: 'Community members' },
];

const offerings = [
    { icon: BookOpen, title: 'Education', body: 'Premium courses on Web3 and AI.' },
    { icon: Users, title: 'Mentorship', body: 'One-on-one guidance from engineers.' },
    { icon: Code2, title: 'Development', body: 'Smart contracts and full-stack dApps.' },
    { icon: TrendingUp, title: 'Innovation', body: 'Cutting-edge Web3 and AI solutions.' },
];

const values = [
    {
        icon: Heart,
        title: 'User-first',
        body: 'Every feature is designed with simplicity and accessibility in mind.',
    },
    {
        icon: Shield,
        title: 'Secure by default',
        body: 'Built on blockchain with cryptographic security and full transparency.',
    },
    {
        icon: Award,
        title: 'Continuous innovation',
        body: 'Pushing the boundaries of what’s possible with Web3 and AI.',
    },
];

export default function AboutPage() {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Header />

            <main className="relative z-10 flex-1">
                {/* Hero */}
                <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center animate-fade-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-white/70 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-[#14f195]" />
                            About DappPay & DappMentors
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
                            Empowering Web3 through{' '}
                            <span className="gradient-text">innovation & education.</span>
                        </h1>
                        <p className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
                            Built by Darlington Gospel, founder of DappMentors — a blockchain and
                            AI academy with 9+ years of experience. DappPay is our commitment to
                            making on-chain payroll simple and accessible.
                        </p>
                    </div>
                </section>

                {/* Who I am */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-5">
                            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                Who I am
                            </h2>
                            <p className="text-white/65 leading-relaxed">
                                I’m Darlington Gospel — a blockchain developer, AI engineer and
                                educator on a mission to democratize Web3.
                            </p>
                            <p className="text-white/65 leading-relaxed">
                                With over nine years in blockchain development, smart-contract
                                engineering and technical education, I’ve mentored hundreds of
                                developers through DappMentors and shipped products across multiple
                                ecosystems.
                            </p>
                            <ul className="pt-4 space-y-2.5">
                                {[
                                    'Smart contract development & auditing',
                                    'Full-stack dApp engineering',
                                    'Blockchain & AI education',
                                    'Web3 innovation & strategy',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 text-sm text-white/75"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#14f195]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="surface-card surface-card-hover rounded-xl p-6 text-center"
                                >
                                    <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                                        {s.value}
                                    </div>
                                    <p className="mt-1.5 text-xs text-white/55">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#14f195] flex items-center justify-center">
                                    <Target className="w-5 h-5 text-[#0a0a12]" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                    DappPay mission
                                </h2>
                            </div>
                            <p className="text-white/65 leading-relaxed mb-6">
                                DappPay transforms payroll management by combining Solana’s speed
                                with AI-powered natural language. Chat with your assistant to run
                                payroll — no complex dashboards required.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { icon: Zap, text: 'Instant payouts in seconds' },
                                    { icon: Sparkles, text: 'AI-driven natural language automation' },
                                    { icon: Shield, text: 'Blockchain-secured transparency' },
                                ].map((item) => (
                                    <div
                                        key={item.text}
                                        className="flex items-center gap-3 p-3.5 rounded-lg surface-card"
                                    >
                                        <div className="w-9 h-9 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-[#14f195]" />
                                        </div>
                                        <span className="text-sm text-white/80">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="surface-card rounded-2xl p-10 text-center relative overflow-hidden">
                            <div
                                className="absolute inset-0 pointer-events-none opacity-40"
                                style={{
                                    background:
                                        'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), transparent 55%), radial-gradient(circle at 70% 70%, rgba(20,241,149,0.12), transparent 55%)',
                                }}
                            />
                            <div className="relative">
                                <div className="text-sm text-white/50 mb-3 uppercase tracking-wider">
                                    DappPay
                                </div>
                                <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
                                    Revolutionizing payroll
                                </div>
                                <div className="gradient-text text-2xl sm:text-3xl font-semibold tracking-tight">
                                    on Solana
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Offerings */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-center mb-10">
                            Comprehensive offerings
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {offerings.map((o) => (
                                <div
                                    key={o.title}
                                    className="surface-card surface-card-hover rounded-xl p-6"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
                                        <o.icon className="w-5 h-5 text-[#14f195]" />
                                    </div>
                                    <h3 className="text-[15px] font-semibold text-white mb-1.5">
                                        {o.title}
                                    </h3>
                                    <p className="text-sm text-white/55 leading-relaxed">{o.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-center mb-10">
                            Core values
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {values.map((v) => (
                                <div
                                    key={v.title}
                                    className="surface-card surface-card-hover rounded-xl p-7 text-center"
                                >
                                    <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                                        <v.icon className="w-5 h-5 text-[#14f195]" />
                                    </div>
                                    <h3 className="text-[15px] font-semibold text-white mb-2">
                                        {v.title}
                                    </h3>
                                    <p className="text-sm text-white/55 leading-relaxed">{v.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
                            Ready to join the Web3 revolution?
                        </h2>
                        <p className="text-white/60 mb-8">
                            Run on-chain payroll with DappPay — or level up with DappMentors.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href="/dashboard" className="btn-primary group">
                                Start with DappPay
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                            <a
                                href="https://dappmentors.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                            >
                                Learn with DappMentors
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
