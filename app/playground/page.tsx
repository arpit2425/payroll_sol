'use client';

import { useState, useEffect } from 'react';
import { Play, Zap, Shuffle, Trash2, Copy, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWallet } from '@solana/wallet-adapter-react';
import { addWorker, calculateTotalPayrollCost, checkPayrollDue, createOrganization, deriveOrganizationPDA, deriveWorkerPDA, fetchAllOrganizations, fetchOrganizationDetails, fetchOrganizationWorkers, fetchUserOrganizations, fetchWorkerDetails, fundTreasury, getOrganizationBalance, getProvider, getProviderReadonly, processPayroll, withdrawFromTreasury } from '@/services/blockchain';
import { set } from 'zod';
import { PublicKey } from '@solana/web3.js';

interface TestData {
    orgName: string;
    workerAddress: string;
    salary: string;
    fundAmount: string;
    withdrawAmount: string;
    selectedOrgPda: string;
    selectedWorkerPda: string;
}

interface Log {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
    timestamp: Date;
}

const Page: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const { publicKey, signTransaction } = useWallet();
    const [testData, setTestData] = useState<TestData>({
        orgName: 'TechCorp',
        workerAddress: '',
        salary: '0.5',
        fundAmount: '10',
        withdrawAmount: '2',
        selectedOrgPda: '',
        selectedWorkerPda: '',
    });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        const timestamp = new Date();
        setLogs(prev => [{
            id: Date.now() + Math.random(),
            message,
            type,
            timestamp
        }, ...prev].slice(0, 100));
    };

    const handleError = (error: unknown, context: string) => {
        const message = error instanceof Error ? error.message : String(error);
        addLog(`${context}: ${message}`, 'error');
        console.error(context, error);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const generateRandomData = () => {
        const randomOrg = `Org_${Math.random().toString(36).substring(7)}`;
        const randomSalary = (Math.random() * 2 + 0.5).toFixed(2);
        const randomFund = (Math.random() * 20 + 5).toFixed(2);
        setTestData(prev => ({
            ...prev,
            orgName: randomOrg,
            salary: randomSalary,
            fundAmount: randomFund,
        }));
        addLog('Generated random test data', 'info');
    };

    const testCreateOrganization = async () => {
        if (!publicKey || !signTransaction) {
            addLog('Wallet not connected', 'error');
            return;
        }
        setLoading('createOrg');
        try {
            const program =await getProvider(publicKey, signTransaction);
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            addLog(`Creating organization: ${testData.orgName}`, 'info');
            const tx=await createOrganization(program,publicKey, testData.orgName);
            const [orgPda]= await deriveOrganizationPDA(publicKey, testData.orgName);
            setTestData(prev => ({ ...prev, selectedOrgPda: orgPda.toBase58() }));
            addLog(`Organization created! TX: ${tx}`, 'success');
            addLog(`Org PDA: ${orgPda}`, 'info');
        } catch (error) {
            handleError(error, 'Create Organization');
        } finally {
            setLoading(null);
        }
    };

    const testAddWorker = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please create an organization first or enter Org PDA', 'error');
            return;
        }
         if (!publicKey || !signTransaction) {
            addLog('Wallet not connected', 'error');
            return;
        }

        setLoading('addWorker');
        try {
              const program =await getProvider(publicKey, signTransaction);
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            let workerAddress = testData.workerAddress? new PublicKey(testData.workerAddress) : PublicKey.unique();
            const tx=await addWorker(program,publicKey, workerAddress,parseFloat(testData.salary), testData.selectedOrgPda );
          
            addLog(`Adding worker with salary ${testData.salary} SOL`, 'info');
            const [workerPda]= await deriveWorkerPDA(workerAddress, new PublicKey(testData.selectedOrgPda));
            // Dummy worker PDA

            setTestData(prev => ({ ...prev, selectedWorkerPda: workerPda.toBase58() }));

            addLog(`Worker added! TX: ${tx}`, 'success');
            addLog(`Worker PDA: ${workerPda.toBase58()}`, 'info');
        } catch (error) {
            handleError(error, 'Add Worker');
        } finally {
            setLoading(null);
        }
    };

    const testFundTreasury = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please create an organization first or enter Org PDA', 'error');
            return;
        }
         if (!publicKey || !signTransaction) {
            addLog('Wallet not connected', 'error');
            return;
        }

        setLoading('fundTreasury');
        try {
                const program =await getProvider(publicKey, signTransaction);
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const tx=await fundTreasury(program,testData.selectedOrgPda, publicKey,parseFloat(testData.fundAmount));
            console.log('Fund Treasury TX:', tx);
            addLog(`Funding treasury with ${testData.fundAmount} SOL`, 'info');

            addLog(`Treasury funded! TX: ${tx}`, 'success');
        } catch (error) {
            console.error('Error funding treasury:', error);
            handleError(error, 'Fund Treasury');
        } finally {
            setLoading(null);
        }
    };

    const testProcessPayroll = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please create an organization first or enter Org PDA', 'error');
            return;
        }
            if (!publicKey || !signTransaction) {
            addLog('Wallet not connected', 'error');
            return;
        }

        setLoading('processPayroll');
        try {
            const program =await getProvider(publicKey, signTransaction);
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const tx=await processPayroll(program, publicKey, testData.selectedOrgPda);

            addLog('Processing payroll for all workers...', 'info');

            addLog(`Payroll processed! TX: ${tx}`, 'success');
        } catch (error) {
            handleError(error, 'Process Payroll');
        } finally {
            setLoading(null);
        }
    };

    const testWithdraw = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please create an organization first or enter Org PDA', 'error');
            return;
        }
        if (!publicKey || !signTransaction) {
            addLog('Wallet not connected', 'error');
            return;
        }

        setLoading('withdraw');
        try {
            const program =await getProvider(publicKey, signTransaction);
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const tx=await withdrawFromTreasury(program, publicKey, testData.selectedOrgPda, parseFloat(testData.withdrawAmount));
            addLog(`Withdrawing ${testData.withdrawAmount} SOL from treasury`, 'info');

            addLog(`Withdrawal successful! TX: ${tx}`, 'success');
        } catch (error) {
            handleError(error, 'Withdraw from Treasury');
        } finally {
            setLoading(null);
        }
    };

    const testFetchUserOrgs = async () => {
        if (!publicKey) {
            addLog('Wallet not connected', 'error');
            return;
        }
        setLoading('fetchUserOrgs');
        try {
             const program =await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            addLog('Fetching your organizations...', 'info');
            let orgs= await fetchUserOrganizations(program, publicKey);
            // Dummy data
        

            addLog(`Found ${orgs.length} organization(s)`, 'success');
            orgs.forEach((org, i) => {
                addLog(`${i + 1}. ${org.name} - Treasury: ${org.treasury} SOL - Workers: ${org.workersCount}`, 'info');
            });
        } catch (error) {
            handleError(error, 'Fetch User Organizations');
        } finally {
            setLoading(null);
        }
    };

    const testFetchAllOrgs = async () => {
        setLoading('fetchAllOrgs');
        try {
            addLog('Fetching all organizations...', 'info');
             const program =await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const orgs = await fetchAllOrganizations(program);
            addLog(`Found ${orgs.length} total organization(s)`, 'success');
            orgs.forEach((org, i) => {
                addLog(`${i + 1}. ${org.name} - Treasury: ${org.treasury} SOL`, 'info');
            });
        } catch (error) {
            handleError(error, 'Fetch All Organizations');
        } finally {
            setLoading(null);
        }
    };

    const testFetchOrgDetails = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please enter an Org PDA', 'error');
            return;
        }

        setLoading('fetchOrgDetails');
        try {
            addLog(`Fetching details for org...`, 'info');
             const program =await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const org = await fetchOrganizationDetails(program, testData.selectedOrgPda);
            if (!org) {
                addLog('Failed to fetch organization details', 'error');
                return;
            }
          

            addLog(`Organization: ${org.name}`, 'success');
            addLog(`Treasury: ${org.treasury} SOL`, 'info');
            addLog(`Workers Count: ${org.workersCount}`, 'info');
        } catch (error) {
            handleError(error, 'Fetch Organization Details');
        } finally {
            setLoading(null);
        }
    };

    const testFetchOrgWorkers = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please enter an Org PDA', 'error');
            return;
        }

        setLoading('fetchOrgWorkers');
        try {
            addLog(`Fetching workers...`, 'info');
             const program =await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const workers = await fetchOrganizationWorkers(program, testData.selectedOrgPda);
            addLog(`Found ${workers.length} worker(s)`, 'success');
            workers.forEach((worker, i) => {
                addLog(`${i + 1}. Salary: ${worker.salary} SOL`, 'info');
            });
        } catch (error) {
            handleError(error, 'Fetch Organization Workers');
        } finally {
            setLoading(null);
        }
    };

    const testFetchWorkerDetails = async () => {
        if (!testData.selectedWorkerPda) {
            addLog('Please enter a Worker PDA', 'error');
            return;
        }

        setLoading('fetchWorkerDetails');
        try {
            addLog(`Fetching worker details...`, 'info');
             const program =await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const worker = await fetchWorkerDetails(program, testData.selectedWorkerPda);
            if (!worker) {
                addLog('Failed to fetch worker details', 'error');
                return;
            }

            addLog(`Salary: ${worker.salary} SOL`, 'success');
            addLog(`Last Paid: ${new Date(worker.lastPaidCycle * 1000).toLocaleString()}`, 'info');
        } catch (error) {
            handleError(error, 'Fetch Worker Details');
        } finally {
            setLoading(null);
        }
    };


          
    const testFetchWorkersByWallet = async () => {
        setLoading('fetchWorkersByWallet');
        try {
            addLog(`Fetching your worker records...`, 'info');
            const program = await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const dummyWorkers = [
                { salary: 50 },
                { salary: 60 },
            ];

            addLog(`Found ${dummyWorkers.length} worker record(s)`, 'success');
            dummyWorkers.forEach((worker, i) => {
                addLog(`${i + 1}. Salary: ${worker.salary} SOL`, 'info');
            });
        } catch (error) {
            handleError(error, 'Fetch Workers by Wallet');
        } finally {
            setLoading(null);
        }
    };

    const testCheckPayrollDue = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please enter an Org PDA', 'error');
            return;
        }

        setLoading('checkPayrollDue');
        try {
            addLog('Checking if payroll is due...', 'info');
                const program = await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const result = await checkPayrollDue(program, testData.selectedOrgPda);
            if (!result) {  
                addLog('Failed to check payroll status', 'error');
                return;
            }

            if (result.due) {
                addLog(`Payroll is DUE! ${result.workers.length} worker(s) need payment`, 'success');
            } else {
                addLog('Payroll is not due yet', 'info');
            }
        } catch (error) {
            handleError(error, 'Check Payroll Due');
        } finally {
            setLoading(null);
        }
    };

    const testGetOrgBalance = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please enter an Org PDA', 'error');
            return;
        }

        setLoading('getOrgBalance');
        try {
            addLog('Fetching organization balance...', 'info');
            const program = await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const balance = await getOrganizationBalance(program, testData.selectedOrgPda);
            if (balance === null) {
                addLog('Failed to fetch organization balance', 'error');
                return;
            }

            addLog(`Treasury Balance: ${balance} SOL`, 'success');
        } catch (error) {
            handleError(error, 'Get Organization Balance');
        } finally {
            setLoading(null);
        }
    };

    const testCalculatePayrollCost = async () => {
        if (!testData.selectedOrgPda) {
            addLog('Please enter an Org PDA', 'error');
            return;
        }

        setLoading('calculatePayrollCost');
        try {
            addLog('Calculating total payroll cost...', 'info');
            const program = await getProviderReadonly();
            if (!program) {
                addLog('Failed to get program instance', 'error');
                return;
            }
            const cost = await calculateTotalPayrollCost(program, testData.selectedOrgPda);
            if (cost === null) {
                addLog('Failed to calculate payroll cost', 'error');
                return;
            }

            addLog(`Total Monthly Payroll Cost: ${cost} SOL`, 'success');
        } catch (error) {
            handleError(error, 'Calculate Payroll Cost');
        } finally {
            setLoading(null);
        }
    };

    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3 text-[#8b8b96] text-[13px]">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#23232d] border-t-[#7c7ff5] animate-spin" />
                    Loading playground…
                </div>
            </div>
        );
    }

    const TestButton = ({ onClick, loading: isLoading, disabled, variant, label }: {
        onClick: () => void;
        loading: boolean;
        disabled?: boolean;
        variant: 'write' | 'read' | 'secondary';
        label: string;
    }) => {
        const variants = {
            write: 'text-white border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] bg-gradient-to-b from-[#7375f5] to-[#5b5ee8] hover:brightness-110',
            read: 'bg-[#1a1a22] hover:bg-[#1f1f29] text-[#c7c7cf] border border-[#23232d] hover:border-[#2e2e3a]',
            secondary: 'bg-[#1a1a22] hover:bg-[#1f1f29] text-[#c7c7cf] border border-[#23232d]',
        };

        return (
            <button
                onClick={onClick}
                disabled={disabled || isLoading}
                className={`w-full h-9 px-3 rounded-md font-medium text-[12px] transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 ${variants[variant]}`}
            >
                <Play className="w-3 h-3" strokeWidth={2.25} />
                <span>{isLoading ? 'Processing…' : label}</span>
            </button>
        );
    };

    return (
        <div className="relative min-h-screen flex flex-col pt-20">
            <Header />

            <div className="max-w-6xl mx-auto pb-20 px-5 lg:px-8 pt-28">
                {/* Header */}
                <div className="mb-10">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7c7ff5] mb-1.5">
                        Developer tools
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white mb-1.5">
                        Playground
                    </h1>
                    <p className="text-[13px] text-[#8b8b96]">
                        Interactive blockchain function testing environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Test Data Panel */}
                        <div className="bg-[#131319] border border-[#23232d] rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#23232d] bg-[#0e0e13]">
                                <h2 className="text-[13px] font-semibold text-white tracking-tight flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5 text-[#7c7ff5]" strokeWidth={2} />
                                    Test configuration
                                </h2>
                                <button
                                    onClick={generateRandomData}
                                    className="p-1.5 rounded-md transition-colors text-[#8b8b96] hover:text-white hover:bg-[#1a1a22]"
                                    title="Randomize"
                                >
                                    <Shuffle className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 p-5">
                                {[
                                    { label: 'Organization Name', key: 'orgName', type: 'text' },
                                    { label: 'Worker Address (optional)', key: 'workerAddress', type: 'text', placeholder: 'Leave empty for random' },
                                    { label: 'Salary (SOL)', key: 'salary', type: 'number', step: '0.1' },
                                    { label: 'Fund Amount (SOL)', key: 'fundAmount', type: 'number', step: '0.1' },
                                    { label: 'Withdraw Amount (SOL)', key: 'withdrawAmount', type: 'number', step: '0.1' },
                                    { label: 'Organization PDA', key: 'selectedOrgPda', type: 'text', placeholder: 'Auto-filled', disabled: true },
                                    { label: 'Worker PDA', key: 'selectedWorkerPda', type: 'text', placeholder: 'Auto-filled', disabled: true },
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-[10px] font-semibold text-[#aeaeb8] mb-1.5 uppercase tracking-[0.06em]">{field.label}</label>
                                        <div className="relative">
                                            <input
                                                type={field.type || 'text'}
                                                step={field.step}
                                                disabled={field.disabled}
                                                value={testData[field.key as keyof TestData]}
                                                onChange={(e) => setTestData({ ...testData, [field.key]: e.target.value })}
                                                placeholder={field.placeholder}
                                                className="ring-focus w-full bg-[#0e0e13] border border-[#23232d] rounded-md px-2.5 py-1.5 text-[12px] text-white placeholder-[#5e5e6b] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                                            />
                                            {(field.key === 'selectedOrgPda' || field.key === 'selectedWorkerPda') && testData[field.key as keyof TestData] && (
                                                <button
                                                    onClick={() => copyToClipboard(testData[field.key as keyof TestData], field.key)}
                                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-[#8b8b96] hover:text-white transition-colors"
                                                >
                                                    {copied === field.key ? (
                                                        <Check className="w-3.5 h-3.5 text-[#7c7ff5]" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Write Functions */}
                        <div className="bg-[#131319] border border-[#23232d] rounded-lg overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#23232d] bg-[#0e0e13] flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-[#6366f1]" />
                                <h3 className="text-[10px] font-semibold text-[#aeaeb8] uppercase tracking-[0.08em]">Write · requires wallet</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-5">
                                <TestButton onClick={testCreateOrganization} loading={loading === 'createOrg'} variant="write" label="Create Org" />
                                <TestButton onClick={testAddWorker} loading={loading === 'addWorker'} variant="write" label="Add Worker" />
                                <TestButton onClick={testFundTreasury} loading={loading === 'fundTreasury'} variant="write" label="Fund Treasury" />
                                <TestButton onClick={testProcessPayroll} loading={loading === 'processPayroll'} variant="write" label="Process Payroll" />
                                <TestButton onClick={testWithdraw} loading={loading === 'withdraw'} variant="write" label="Withdraw Funds" />
                            </div>
                        </div>

                        {/* Read Functions */}
                        <div className="bg-[#131319] border border-[#23232d] rounded-lg overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#23232d] bg-[#0e0e13] flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-[#8b8b96]" />
                                <h3 className="text-[10px] font-semibold text-[#aeaeb8] uppercase tracking-[0.08em]">Read · read-only</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-5">
                                <TestButton onClick={testFetchUserOrgs} loading={loading === 'fetchUserOrgs'} variant="read" label="My Orgs" />
                                <TestButton onClick={testFetchAllOrgs} loading={loading === 'fetchAllOrgs'} variant="read" label="All Orgs" />
                                <TestButton onClick={testFetchOrgDetails} loading={loading === 'fetchOrgDetails'} variant="read" label="Org Details" />
                                <TestButton onClick={testFetchOrgWorkers} loading={loading === 'fetchOrgWorkers'} variant="read" label="Org Workers" />
                                <TestButton onClick={testFetchWorkerDetails} loading={loading === 'fetchWorkerDetails'} variant="read" label="Worker Details" />
                                <TestButton onClick={testFetchWorkersByWallet} loading={loading === 'fetchWorkersByWallet'} variant="read" label="My Workers" />
                                <TestButton onClick={testCheckPayrollDue} loading={loading === 'checkPayrollDue'} variant="read" label="Payroll Due?" />
                                <TestButton onClick={testGetOrgBalance} loading={loading === 'getOrgBalance'} variant="read" label="Org Balance" />
                                <TestButton onClick={testCalculatePayrollCost} loading={loading === 'calculatePayrollCost'} variant="read" label="Payroll Cost" />
                            </div>
                        </div>
                    </div>

                    {/* Logs Panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-[#131319] border border-[#23232d] rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#23232d] bg-[#0e0e13]">
                                <h3 className="text-[10px] font-semibold text-[#aeaeb8] uppercase tracking-[0.08em]">Activity log</h3>
                                <button
                                    onClick={() => setLogs([])}
                                    className="p-1 text-[#8b8b96] hover:text-white hover:bg-[#1a1a22] rounded-md transition-colors"
                                    title="Clear logs"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="bg-[#0e0e13] p-3 h-[600px] overflow-y-auto font-mono text-[11px] scrollbar-thin">
                                {logs.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-[#5e5e6b]">
                                        <p>No activity yet. Start testing…</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {logs.map((log) => (
                                            <div
                                                key={log.id}
                                                className={`py-1 pl-2.5 pr-2 rounded ${log.type === 'success'
                                                    ? 'text-white border-l-2 border-[#6366f1]'
                                                    : log.type === 'error'
                                                        ? 'text-[#c7c7cf] border-l-2 border-amber-400/70'
                                                        : 'text-[#8b8b96] border-l-2 border-[#23232d]'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className="break-all flex-1">
                                                        {log.message}
                                                    </span>
                                                    <span className="text-[10px] text-[#5e5e6b] shrink-0 ml-2 tabular-nums">
                                                        {log.timestamp.toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Page;