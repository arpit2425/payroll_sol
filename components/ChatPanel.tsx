import { useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Key, Command } from 'lucide-react';
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
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#1a1a22] border border-[#23232d] w-fit">
        <span className="w-1 h-1 rounded-full bg-[#6366f1] animate-pulse" />
        <span className="text-[11px] text-[#8b8b96]">thinking…</span>
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
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-[1.65]">{children}</p>,
        h1: ({ children }) => (
            <h1 className="text-[13px] font-semibold mb-2 mt-3 first:mt-0 text-white tracking-tight">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-[13px] font-semibold mb-1.5 mt-3 first:mt-0 text-white tracking-tight">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-[10px] font-semibold mb-2 mt-3 first:mt-0 text-[#8b8b96] uppercase tracking-[0.08em]">{children}</h3>
        ),
        ul: ({ children }) => <ul className="list-disc list-outside pl-4 mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-outside pl-4 mb-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="marker:text-[#3a3a48]">{children}</li>,
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
                <code className="bg-[#23232d] px-1.5 py-[1px] rounded text-[#c7c7cf] font-mono text-[11px] break-all">
                    {children}
                </code>
            ) : (
                <code
                    className={`block bg-[#0e0e13] border border-[#23232d] p-3 rounded-md my-2 font-mono text-[11px] leading-[1.6] overflow-x-auto whitespace-pre break-all text-[#c7c7cf] ${className ?? ''}`}
                >
                    {children}
                </code>
            ),
        a: ({ href, children }) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7c7ff5] hover:text-[#9ea0f8] underline decoration-[#6366f1]/40 hover:decoration-[#6366f1]/80 underline-offset-2 break-all transition-colors"
            >
                {children}
            </a>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#6366f1]/40 pl-3 my-2 text-[#8b8b96]">
                {children}
            </blockquote>
        ),
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="border-[#23232d] my-3" />,
    };

    return (
        <div className="flex-1 flex flex-col bg-[#131319] border border-[#23232d] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#23232d] bg-[#0e0e13]">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#7c7ff5]" strokeWidth={2} />
                    <h2 className="text-[13px] font-semibold text-white tracking-tight">Assistant</h2>
                </div>
                <div className="flex items-center gap-1.5">
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            publicKey ? 'bg-[#6366f1] shadow-[0_0_8px_0_rgba(99,102,241,0.6)]' : 'bg-[#3a3a48]'
                        }`}
                    />
                    <span className="text-[11px] text-[#8b8b96] hidden sm:inline tabular-nums font-mono">
                        {publicKey ? `${publicKey.slice(0, 4)}…${publicKey.slice(-4)}` : 'no wallet'}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={chatRef}
                className="flex-1 overflow-y-auto scrollbar-thin px-4 py-5 space-y-3"
            >
                {messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={msg.id} className="group">
                            <div className="flex items-center gap-2 mb-1 px-0.5">
                                <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${isUser ? 'text-[#7c7ff5]' : 'text-[#8b8b96]'}`}>
                                    {isUser ? 'You' : 'Assistant'}
                                </span>
                                <span className="text-[10px] text-[#3a3a48] tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                                    {msg.timestamp?.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }) || ''}
                                </span>
                            </div>
                            <div className={`text-[13px] leading-[1.65] ${isUser ? 'text-white' : 'text-[#c7c7cf]'}`}>
                                {isUser ? (
                                    <p className="whitespace-pre-wrap break-words">
                                        {msg.content}
                                    </p>
                                ) : (
                                    <div className="break-words">
                                        <ReactMarkdown components={markdownComponents}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {isLoading && <TypingIndicator />}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#23232d] bg-[#0e0e13]">
                {!apiKeySet ? (
                    <form onSubmit={onApiKeySubmit} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#aeaeb8]">
                            <Key className="w-3 h-3 text-[#7c7ff5]" />
                            Gemini API key required
                        </div>
                        <div className="flex gap-1.5">
                            <input
                                type="password"
                                value={userApiKey}
                                onChange={(e) => onApiKeyChange(e.target.value)}
                                onKeyPress={handleApiKeyKeyPress}
                                placeholder="AIza..."
                                className="ring-focus flex-1 h-9 px-3 bg-[#1a1a22] border border-[#23232d] rounded-md text-[12px] text-white placeholder-[#5e5e6b] font-mono transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!userApiKey.trim()}
                                className="btn-primary"
                            >
                                Save
                            </button>
                        </div>
                        <p className="text-[10px] text-[#5e5e6b]">
                            Stored locally. Never sent to our servers.
                        </p>
                    </form>
                ) : (
                    <>
                        <div className="relative">
                            <input
                                value={input}
                                onChange={(e) => onInputChange(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask anything about payroll…"
                                disabled={isLoading}
                                className="ring-focus w-full h-10 pl-3 pr-12 bg-[#1a1a22] border border-[#23232d] rounded-md text-[13px] text-white placeholder-[#5e5e6b] transition-all disabled:opacity-50"
                            />
                            <button
                                onClick={() => onSubmit()}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-gradient-to-b from-[#7375f5] to-[#5b5ee8] hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)]"
                                aria-label="Send"
                            >
                                <ArrowUp className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#5e5e6b]">
                            <span className="flex items-center gap-1">
                                Press
                                <kbd className="px-1 py-px rounded bg-[#1a1a22] border border-[#23232d] text-[#aeaeb8] font-sans">↵</kbd>
                                to send
                            </span>
                            <span className="flex items-center gap-1">
                                <Command className="w-2.5 h-2.5" />K
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatPanel;
