import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Zap, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


const navLinks = [
    { label: 'Documentation', href: '/documentation' },
    { label: 'Playground', href: '/playground' },
    { label: 'Features', href: '/features' },
    { label: 'About', href: '/about' },
];

const Header = () => {
    const { connected, publicKey, disconnect } = useWallet();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDisconnect = async () => {
        if (disconnect) await disconnect();
    };

    const address = publicKey
        ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
        : '';

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#070711]/80 backdrop-blur-xl border-b border-white/[0.06]'
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-[#14f195] flex items-center justify-center shadow-[0_4px_16px_-6px_rgba(20,241,149,0.45)]">
                        <Zap className="w-4 h-4 text-[#0a0a12]" strokeWidth={2.5} />
                    </div>
                    <span className="text-[15px] font-semibold tracking-tight text-white">
                        DappPay
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                                    active
                                        ? 'text-white'
                                        : 'text-white/60 hover:text-white'
                                }`}
                            >
                                {link.label}
                                {active && (
                                    <span className="absolute left-3 right-3 -bottom-[1px] h-px bg-[#14f195]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {connected ? (
                        <div className="hidden sm:flex items-center gap-2 pl-3 pr-1 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#14f195]" />
                            <span className="text-xs font-mono text-white/80">{address}</span>
                            <button
                                onClick={handleDisconnect}
                                title="Disconnect"
                                className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden sm:block">
                            <WalletMultiButton />
                        </div>
                    )}

                    {/* Mobile connected chip */}
                    {connected && (
                        <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#14f195]" />
                            <span className="text-[11px] font-mono text-white/80">{address}</span>
                        </div>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                        className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/[0.06] bg-[#070711]/95 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col">
                        {navLinks.map((link) => {
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                        active
                                            ? 'text-white bg-white/[0.04]'
                                            : 'text-white/70 hover:text-white hover:bg-white/[0.03]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        {!connected && (
                            <div className="pt-3 mt-2 border-t border-white/[0.06]">
                                <WalletMultiButton />
                            </div>
                        )}
                        {connected && (
                            <button
                                onClick={handleDisconnect}
                                className="mt-2 flex items-center gap-2 px-3 py-2.5 text-sm text-white/70 hover:text-white rounded-md hover:bg-white/[0.03] transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Disconnect wallet
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
