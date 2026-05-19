import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


const navLinks = [
    { label: 'Docs', href: '/documentation' },
    { label: 'Playground', href: '/playground' },
    { label: 'Features', href: '/features' },
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
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
                scrolled
                    ? 'bg-[#08080b]/85 border-b border-[#23232d] backdrop-blur-md'
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 lg:px-8 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-5 h-5 rounded-[5px] bg-gradient-to-br from-[#7375f5] to-[#5b5ee8] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                        <span className="text-[10px] font-bold text-white leading-none">D</span>
                    </div>
                    <span className="text-[13px] font-semibold tracking-tight text-white">
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
                                className={`relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                                    active
                                        ? 'text-white'
                                        : 'text-[#8b8b96] hover:text-white'
                                }`}
                            >
                                {link.label}
                                {active && (
                                    <span className="absolute left-3 right-3 -bottom-px h-px bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {connected ? (
                        <div className="hidden sm:flex items-center gap-2 pl-2.5 pr-1 py-1 rounded-md bg-[#131319] border border-[#23232d] hover:border-[#2e2e3a] transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] shadow-[0_0_6px_0_rgba(99,102,241,0.6)]" />
                            <span className="text-[11px] font-mono text-[#c7c7cf]">{address}</span>
                            <button
                                onClick={handleDisconnect}
                                title="Disconnect"
                                className="p-1 rounded text-[#8b8b96] hover:text-white hover:bg-[#1a1a22] transition-colors"
                            >
                                <LogOut className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden sm:block">
                            <WalletMultiButton />
                        </div>
                    )}

                    {/* Mobile connected chip */}
                    {connected && (
                        <div className="sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#131319] border border-[#23232d]">
                            <span className="w-1 h-1 rounded-full bg-[#6366f1]" />
                            <span className="text-[11px] font-mono text-[#c7c7cf]">{address}</span>
                        </div>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        aria-label="Toggle menu"
                        className="md:hidden p-1.5 rounded-md text-[#8b8b96] hover:text-white hover:bg-[#1a1a22] transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#23232d] bg-[#08080b]/95 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-5 py-2 flex flex-col">
                        {navLinks.map((link) => {
                            const active = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                                        active
                                            ? 'text-white bg-[#1a1a22]'
                                            : 'text-[#8b8b96] hover:text-white hover:bg-[#131319]'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        {!connected && (
                            <div className="pt-3 mt-2 border-t border-[#23232d]">
                                <WalletMultiButton />
                            </div>
                        )}
                        {connected && (
                            <button
                                onClick={handleDisconnect}
                                className="mt-1 flex items-center gap-2 px-3 py-2 text-[13px] text-[#8b8b96] hover:text-white rounded-md hover:bg-[#131319] transition-colors"
                            >
                                <LogOut className="w-3.5 h-3.5" />
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
