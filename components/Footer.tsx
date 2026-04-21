import Link from 'next/link';
import { Linkedin, Youtube, Twitter, Zap } from 'lucide-react';

const footerLinks = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '/features' },
            { label: 'Playground', href: '/playground' },
            { label: 'Documentation', href: '/documentation' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: 'mailto:hello@dapppay.com' },
            { label: 'Privacy', href: '/privacy' },
        ],
    },
];

const socials = [
    { Icon: Youtube, href: 'https://youtube.com/@dappmentors?sub_confirmation=1', label: 'YouTube' },
    { Icon: Linkedin, href: 'https://linkedin.com/company/dappmentors', label: 'LinkedIn' },
    { Icon: Twitter, href: 'https://twitter.com/iDaltonic', label: 'Twitter' },
];

const Footer = () => {
    return (
        <footer className="relative z-10 mt-auto border-t border-white/[0.06] bg-[#070711]/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#14f195] flex items-center justify-center">
                                <Zap className="w-4 h-4 text-[#0a0a12]" strokeWidth={2.5} />
                            </div>
                            <span className="text-[15px] font-semibold text-white">DappPay</span>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                            Conversational payroll infrastructure for teams building on Solana.
                        </p>
                        <div className="mt-5 flex gap-2">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/60 hover:text-white hover:border-white/[0.14] hover:bg-white/[0.06] transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-4">
                                {section.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-white/55 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
                    <span>© {new Date().getFullYear()} DappPay. Built by DappMentors.</span>
                    <span className="font-mono">v0.1 · Devnet</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
