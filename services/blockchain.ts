import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import type { PayrollProgram } from "@/payroll_program";
import idlJson from "@/payroll_program.json";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionSignature,
  Transaction,
  AccountMeta,
} from "@solana/web3.js";
import { Organization, Worker } from "@/utils/interface";
import { getClusterURL } from "@/utils/helper";

type RawOrganization = {
  authority: PublicKey;
  name: string;
  treasury: BN;
  workerCount: BN;
  createdAt: BN; // ← Anchor uses camelCase!
  bump: number;
};

type RawWorker = {
  org: PublicKey;
  workerPubkey: PublicKey;
  salary: BN;
  lastPaidAt: BN;
  createdAt: BN; // ← Anchor uses camelCase!
  bump: number;
};
const idl = idlJson as PayrollProgram;
const Program_id = new PublicKey(idlJson.address);
const cluster = process.env.NEXT_PUBLIC_CLUSTER || "devnet";
const RPC_URL = getClusterURL(cluster);
interface SignerWallet {
  publicKey: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
}
export const getProvider = (
  publicKey: PublicKey | null,
  signTransaction: (tx: Transaction) => Promise<Transaction>,
): Program<PayrollProgram> | null => {
  if (!publicKey || !signTransaction) {
    console.error("Wallet not connected or missing signTransaction");
    return null;
  }

  if (
    !RPC_URL ||
    (!RPC_URL.startsWith("http://") && !RPC_URL.startsWith("https://"))
  ) {
    console.error("Invalid RPC URL:", RPC_URL);
    throw new Error(
      `Invalid RPC endpoint: ${RPC_URL}. It must start with http: or https:. Check NEXT_PUBLIC_CLUSTER env var.`,
    );
  }

  const connection = new Connection(RPC_URL, "confirmed");

  const wallet: SignerWallet = {
    publicKey,
    signTransaction,
    signAllTransactions: async (txs: Transaction[]) => {
      const signed: Transaction[] = [];
      for (const tx of txs) {
        signed.push(await signTransaction(tx));
      }
      return signed;
    },
  };

  const provider = new AnchorProvider(connection, wallet as unknown as Wallet, {
    commitment: "processed",
  });

  return new Program(idl, provider);
};

export const getProviderReadonly = (): Program<PayrollProgram> => {
  if (
    !RPC_URL ||
    (!RPC_URL.startsWith("http://") && !RPC_URL.startsWith("https://"))
  ) {
    console.error("Invalid RPC URL:", RPC_URL);
    throw new Error(
      `Invalid RPC endpoint: ${RPC_URL}. It must start with http: or https:. Check NEXT_PUBLIC_CLUSTER env var.`,
    );
  }

  const connection = new Connection(RPC_URL, "confirmed");

  const wallet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
    signAllTransactions: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
  };

  const provider = new AnchorProvider(connection, wallet as unknown as Wallet, {
    commitment: "processed",
  });

  return new Program(idl, provider);
};

export const createOrganization = async (
  program: Program<PayrollProgram>,
  publicKey: PublicKey,
  name: string,
): Promise<TransactionSignature | null> => {
  try {
    const tx = await program.methods
      .createOrg(name)
      .accounts({ authority: publicKey })
      .rpc();
    return tx;
  } catch (err) {
    console.error("error", err);
    return null;
  }
};

export const addWorker = async (
  program: Program<PayrollProgram>,
  authorityPubKey: PublicKey,
  workerPubKey: PublicKey,
  salary: number,
  orgPda:string
): Promise<TransactionSignature | null> => {
  try {
    const salaryBn = new BN(Math.round(salary * 1_000_000_000));
    const tx = await program.methods
      .addWorker(salaryBn)
      .accountsPartial({authority: authorityPubKey, workerPubkey: workerPubKey, org:new PublicKey(orgPda) })
      .rpc();
    return tx;
  } catch (err) {
    console.error("error", err);
    return null;
  }
};

export const fundTreasury=async(program:Program<PayrollProgram>,orgPda:string,authority:PublicKey,amount:number):Promise<TransactionSignature | null>=>{
    try {
        const amountInLam=new BN(Math.round(amount * 1_000_000_000));
        const tx=await program.methods.fundTreasury(amountInLam).accountsPartial({authority,org:new PublicKey(orgPda)}).rpc();
        return tx;
        
    }catch (err) {
    console.error("error", err);
    return null;
  }
}

export const processPayroll = async (
    program: Program<PayrollProgram>,
    publicKey: PublicKey,
    orgPda: string,
    cycleTimestamp?: number
): Promise<TransactionSignature> => {
    const timestamp = cycleTimestamp || Math.floor(Date.now() / 1000)

    // Fetch all workers for this organization
    const allWorkers = (await program.account.worker.all()) as {
        publicKey: PublicKey
        account: RawWorker
    }[]
    const orgWorkers = allWorkers.filter(
        (w) => w.account.org.toBase58() === orgPda
    )

    // Build remaining accounts array (alternating worker PDA and worker wallet)
    const remainingAccounts: AccountMeta[] = orgWorkers.flatMap((w) => [
        { pubkey: w.publicKey, isSigner: false, isWritable: true },
        { pubkey: w.account.workerPubkey, isSigner: false, isWritable: true },
    ])

    const tx = await program.methods
        .processPayroll(new BN(timestamp))
        .accountsPartial({
            org: new PublicKey(orgPda),
            authority: publicKey,
            systemProgram: SystemProgram.programId,
        })
        .remainingAccounts(remainingAccounts)
        .rpc()

    return tx
}

/**
 * Withdraw funds from organization treasury
 */
export const withdrawFromTreasury = async (
    program: Program<PayrollProgram>,
    publicKey: PublicKey,
    orgPda: string,
    amountInSol: number
): Promise<TransactionSignature> => {
    const amountLamports = new BN(Math.round(amountInSol * 1_000_000_000))

    const tx = await program.methods
        .withdraw(amountLamports)
        .accountsPartial({
            org: new PublicKey(orgPda),
            authority: publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc()

    return tx
}

/**
 * Fetch all organizations created by a specific authority
 */
export const fetchUserOrganizations = async (
    program: Program<PayrollProgram>,
    publicKey: PublicKey
): Promise<Organization[]> => {
    const organizations = (await program.account.organization.all()) as {
        publicKey: PublicKey
        account: RawOrganization
    }[]
    const userOrgs = organizations.filter(
        (org) => org.account.authority.toBase58() === publicKey.toBase58()
    )
    return serializeOrganizations(userOrgs)
}

/**
 * Fetch all active organizations
 */
export const fetchAllOrganizations = async (
    program: Program<PayrollProgram>
): Promise<Organization[]> => {
    const organizations = (await program.account.organization.all()) as {
        publicKey: PublicKey
        account: RawOrganization
    }[]
    return serializeOrganizations(organizations)
}

/**
 * Fetch organization details by PDA
 */
export const fetchOrganizationDetails = async (
    program: Program<PayrollProgram>,
    orgPda: string
): Promise<Organization> => {
    const org = (await program.account.organization.fetch(new PublicKey(orgPda))) as RawOrganization

    const serialized: Organization = {
        publicKey: orgPda,
        authority: org.authority.toBase58(),
        name: org.name,
        treasury: org.treasury.toNumber() / 1e9,
        workersCount: org.workerCount.toNumber(),
        createdAt: Number(org.createdAt || 0),
        bump: org.bump,
    }

    return serialized
}

/**
 * Fetch all workers for a specific organization
 */
export const fetchOrganizationWorkers = async (
    program: Program<PayrollProgram>,
    orgPda: string
): Promise<Worker[]> => {
    const allWorkers = (await program.account.worker.all()) as {
        publicKey: PublicKey
        account: RawWorker
    }[]
    const orgWorkers = allWorkers.filter(
        (w) => w.account.org.toBase58() === orgPda
    )

    return serializeWorkers(orgWorkers)
}

/**
 * Fetch worker details by PDA
 */
export const fetchWorkerDetails = async (
    program: Program<PayrollProgram>,
    workerPda: string
): Promise<Worker> => {
    const worker = (await program.account.worker.fetch(new PublicKey(workerPda))) as RawWorker

    return {
        publicKey: workerPda,
        org: worker.org.toBase58(),
        workerPubkey: worker.workerPubkey.toBase58(),
        salary: worker.salary.toNumber() / 1e9,
        lastPaidCycle: worker.lastPaidAt.toNumber() * 1000, // Convert to milliseconds
        createdAt: Number(worker.createdAt || 0),
        bump: worker.bump,
    }
}

/**
 * Fetch all workers for a specific wallet address
 */
export const fetchWorkersByWallet = async (
    program: Program<PayrollProgram>,
    walletPublicKey: PublicKey
): Promise<Worker[]> => {
    const allWorkers = (await program.account.worker.all()) as {
        publicKey: PublicKey
        account: RawWorker
    }[]
    const userWorkers = allWorkers.filter(
        (w) => w.account.workerPubkey.toBase58() === walletPublicKey.toBase58()
    )

    return serializeWorkers(userWorkers)
}


const serializeOrganizations = (organizations: { publicKey: PublicKey; account: RawOrganization }[]): Organization[] => {
    return organizations.map((org) => ({
        publicKey: org.publicKey.toBase58(),
        authority: org.account.authority.toBase58(),
        name: org.account.name,
        treasury: org.account.treasury.toNumber() / 1e9,
        workersCount: org.account.workerCount.toNumber(),
        createdAt: Number(org.account.createdAt || 0),
        bump: org.account.bump,
    }))
        .sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * Serialize worker accounts
 */
const serializeWorkers = (workers: { publicKey: PublicKey; account: RawWorker }[]): Worker[] => {
    return workers.map((w) => ({
        publicKey: w.publicKey.toBase58(),
        org: w.account.org.toBase58(),
        workerPubkey: w.account.workerPubkey.toBase58(),
        salary: w.account.salary.toNumber() / 1e9,
        lastPaidCycle: w.account.lastPaidAt.toNumber() * 1000, // Convert to milliseconds
        createdAt: Number(w.account.createdAt || 0),
        bump: w.account.bump,
    }))
        .sort((a, b) => b.createdAt - a.createdAt)
}

export const calculateNextPayrollDate = (
    lastPaidCycle: number,
    cycleType: 'weekly' | 'bi-weekly' | 'monthly' = 'monthly'
): Date => {
    const lastPaid = new Date(lastPaidCycle)
    const next = new Date(lastPaid)

    switch (cycleType) {
        case 'weekly':
            next.setDate(next.getDate() + 7)
            break
        case 'bi-weekly':
            next.setDate(next.getDate() + 14)
            break
        case 'monthly':
            next.setMonth(next.getMonth() + 1)
            break
    }

    return next
}

/**
 * Check if workers are due for payment
 */
export const checkPayrollDue = async (
    program: Program<PayrollProgram>,
    orgPda: string,
    cycleType: 'weekly' | 'bi-weekly' | 'monthly' = 'monthly'
): Promise<{ due: boolean; workers: Worker[] }> => {
    const workers = await fetchOrganizationWorkers(program, orgPda)
    const now = Date.now()
    const cycleMs = {
        weekly: 7 * 24 * 60 * 60 * 1000,
        'bi-weekly': 14 * 24 * 60 * 60 * 1000,
        monthly: 30 * 24 * 60 * 60 * 1000,
    }

    const dueWorkers = workers.filter((w) => {
        const timeSinceLastPaid = now - w.lastPaidCycle
        return timeSinceLastPaid >= cycleMs[cycleType]
    })

    return {
        due: dueWorkers.length > 0,
        workers: dueWorkers,
    }
}

/**
 * Get organization treasury balance in SOL
 */
export const getOrganizationBalance = async (
    program: Program<PayrollProgram>,
    orgPda: string
): Promise<number> => {
    const org = (await program.account.organization.fetch(new PublicKey(orgPda))) as RawOrganization
    return org.treasury.toNumber() / 1e9
}

/**
 * Calculate total monthly payroll cost
 */
export const calculateTotalPayrollCost = async (
    program: Program<PayrollProgram>,
    orgPda: string
): Promise<number> => {
    const workers = await fetchOrganizationWorkers(program, orgPda)
    return workers.reduce((total, worker) => total + worker.salary, 0)
}

/**
 * Derive Organization PDA from authority and name
 */
export const deriveOrganizationPDA = (
    authority: PublicKey,
    name: string
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('org'), authority.toBuffer(), Buffer.from(name)],
        Program_id
    )
}

/**
 * Derive Worker PDA from organization and worker pubkey
 */
export const deriveWorkerPDA = (
    orgPda: PublicKey,
    workerPubkey: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('worker'), orgPda.toBuffer(), workerPubkey.toBuffer()],
        Program_id
    )
}