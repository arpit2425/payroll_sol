import { useRef, useEffect } from 'react';
import { Send, Bot, User, Key } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

type Message = {
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
};

type ChatMessage = Message & {
    id: string;
};

interface ChatPanelProps {
    messages: ChatMessage[];
    input: string;
    isLoading: boolean;
    isPayrollOpen: boolean;
    publicKey?: string | null;
    onInputChange: (value: string) => void;
    onSubmit: (e?: React.FormEvent) => void;
    apiKeySet: boolean;
    userApiKey: string;
    onApiKeyChange: (value: string) => void;
    onApiKeySubmit: (e: React.FormEvent) => void;
}

const TypingIndicator = () => (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white/[0.04] border border-white/[0.06] w-fit">
        <Bot className="w-4 h-4 text-[#14f195]" />
        <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '120ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '240ms' }} />
        </div>
    </div>
);

const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    input,
    isLoading,
    publicKey,
    onInputChange,
    onSubmit,
    apiKeySet,
    userApiKey,
    onApiKeyChange,
    onApiKeySubmit,
}) => {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    const handleApiKeyKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onApiKeySubmit(e as unknown as React.FormEvent);
        }
    };

    const markdownComponents: Components = {
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        h1: ({ children }) => (
            <h1 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-white">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-white">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-sm font-medium mb-1.5 mt-2 first:mt-0 text-[#14f195]">{children}</h3>
        ),
        ul: ({ children }) => <ul className="list-disc list-outside pl-4 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside pl-4 mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="marker:text-white/30">{children}</li>,
        code: ({
            inline,
            children,
            className,
        }: {
            inline?: boolean;
            children?: React.ReactNode;
            className?: string;
        }) =>
            inline ? (
                <code className="bg-white/[0.06] border border-white/[0.06] px-1.5 py-0.5 rounded text-[#14f195] font-mono text-[11px] break-all">
                    {children}
                </code>
            ) : (
                <code
                    className={`block bg-black/40 border border-white/[0.06] p-3 rounded-lg my-2 font-mono text-[11px] overflow-x-auto whitespace-pre break-all ${className ?? ''}`}
                >
                    {children}
                </code>
            ),
        a: ({ href, children }) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#14f195] hover:text-white underline underline-offset-2 break-all transition-colors"
            >
                {children}
            </a>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-white/20 pl-3 italic my-2 text-white/70">
                {children}
            </blockquote>
        ),
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="border-white/10 my-3" />,
    };

    return (
        <div className="flex-1 flex flex-col surface-card rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#14f195] flex items-center justify-center shadow-[0_4px_16px_-6px_rgba(20,241,149,0.5)]">
                        <Bot className="w-4.5 h-4.5 text-[#0a0a12]" strokeWidth={2.25} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white leading-tight">Payroll assistant</h2>
                        <p className="text-xs text-white/50 leading-tight mt-0.5">
                            Natural-language commands · on-chain actions
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            publicKey ? 'bg-[#14f195]' : 'bg-amber-400'
                        }`}
                    />
                    <span className="text-[11px] font-medium text-white/60 hidden sm:inline">
                        {publicKey ? 'Wallet connected' : 'Wallet disconnected'}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={chatRef}
                className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-5 py-5 space-y-4"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                    >
                        <div className="flex items-start gap-2 max-w-[88%] sm:max-w-[78%]">
                            {msg.role === 'bot' && (
                                <div className="mt-0.5 w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <Bot className="w-3.5 h-3.5 text-[#14f195]" />
                                </div>
                            )}
                            <div
                                className={`${
                                    msg.role === 'user'
                                        ? 'bg-[#14f195] text-[#0a0a12] rounded-2xl rounded-tr-sm'
                                        : 'bg-white/[0.04] border border-white/[0.06] text-white/90 rounded-2xl rounded-tl-sm'
                                } px-3.5 py-2.5 text-[13px] sm:text-sm leading-relaxed`}
                            >
                                {msg.role === 'user' ? (
                                    <p className="whitespace-pre-wrap break-words font-medium">
                                        {msg.content}
                                    </p>
                                ) : (
                                    <div className="break-words">
                                        <ReactMarkdown components={markdownComponents}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                                <p
                                    className={`text-[10px] mt-1.5 ${
                                        msg.role === 'user' ? 'text-black/50' : 'text-white/40'
                                    }`}
                                >
                                    {msg.timestamp?.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }) || ''}
                                </p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="mt-0.5 w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                                    <User className="w-3.5 h-3.5 text-white/70" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <TypingIndicator />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="px-4 sm:px-5 py-4 border-t border-white/[0.06] bg-black/20">
                {!apiKeySet ? (
                    <form onSubmit={onApiKeySubmit} className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <Key className="w-3.5 h-3.5 text-[#14f195]" />
                            Provide an OpenAI API key to enable the assistant
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={userApiKey}
                                onChange={(e) => onApiKeyChange(e.target.value)}
                                onKeyPress={handleApiKeyKeyPress}
                                placeholder="sk-..."
                                className="flex-1 h-10 px-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 font-mono focus:outline-none focus:border-[#14f195]/50 focus:bg-white/[0.05] transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!userApiKey.trim()}
                                className="btn-primary h-10"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Save</span>
                            </button>
                        </div>
                        <p className="text-[11px] text-white/40">
                            Stored locally in your browser — never sent to our servers.
                        </p>
                    </form>
                ) : (
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => onInputChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask to create an org, add workers, process payroll…"
                            disabled={isLoading}
                            className="flex-1 h-10 px-3.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#14f195]/50 focus:bg-white/[0.05] transition-colors disabled:opacity-50"
                        />
                        <button
                            onClick={() => onSubmit()}
                            disabled={isLoading || !input.trim()}
                            className="btn-primary h-10"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </div>
                )}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-white/40">
                    <span>
                        Wallet:{' '}
                        {publicKey ? (
                            <span className="text-white/70 font-mono">
                                {publicKey.slice(0, 6)}…
                            </span>
                        ) : (
                            <span className="text-amber-400/80">Not connected</span>
                        )}
                    </span>
                    <span>Press Enter to send</span>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
