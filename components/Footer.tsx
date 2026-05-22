import Link from 'next/link';
import { Linkedin, Youtube, Twitter } from 'lucide-react';

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
            { label: 'Contact', href: 'mailto:hello@PayrollInSol.com' },
            { label: 'Privacy', href: '/privacy' },
        ],
    },
];

const socials = [
   
];

const Footer = () => {
    return (
        <footer className="relative z-10 mt-auto border-t border-[#23232d] bg-[#08080b]">
            <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-[5px] bg-gradient-to-br from-[#7375f5] to-[#5b5ee8] flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                                <span className="text-[10px] font-bold text-white leading-none">D</span>
                            </div>
                            <span className="text-[13px] font-semibold tracking-tight text-white">PayrollInSol</span>
                        </div>
                        <p className="text-[13px] text-[#8b8b96] leading-[1.65] max-w-sm">
                            Conversational payroll infrastructure for teams building on Solana.
                        </p>
                        <div className="mt-5 flex gap-1">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-7 h-7 rounded-md flex items-center justify-center text-[#8b8b96] hover:text-white hover:bg-[#131319] transition-colors"
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-[10px] font-semibold text-[#c7c7cf] uppercase tracking-[0.08em] mb-4">
                                {section.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] text-[#8b8b96] hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-5 border-t border-[#23232d] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#5e5e6b]">
                    <span>© {new Date().getFullYear()} PayrollInSol</span>
                    <div className="flex items-center gap-2 font-mono">
                        <span className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#6366f1]" />
                            Devnet
                        </span>
                        <span>·</span>
                        <span>v0.1</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
