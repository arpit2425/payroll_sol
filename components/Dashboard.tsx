// app/components/Dashboard.tsx
"use client";
import { useState, useEffect } from "react";
import Header from "./Header";
import ChatPanel from "./ChatPanel";
import OrganizationsPanel from "./OrganizationsPanel";
import { Menu } from "lucide-react";
import { Message, PayrollSummary, WorkerSummary } from "@/utils/interface";
import Footer from "./Footer";
import { useWallet, WalletContext, WalletContextState } from "@solana/wallet-adapter-react";
import {
  addWorker,
  createOrganization,
  deriveOrganizationPDA,
  fetchOrganizationDetails,
  fetchUserOrganizations,
  fundTreasury,
  getProvider,
  processPayroll,
  withdrawFromTreasury,
} from "@/services/blockchain";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

type ChatMessage = Message & {
  id: string;
};

type GeminiFunctionCall = {
  name: string;
  args: Record<string, unknown>;
};

type GeminiPart =
  | { text: string }
  | { functionCall: GeminiFunctionCall }
  | { functionResponse: { name: string; response: Record<string, unknown> } };

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

type GeminiResponse = {
  candidates?: Array<{
    content: {
      parts: GeminiPart[];
      role: "model";
    };
    finishReason: string;
  }>;
  error?: { message: string };
};

interface JsonSchemaProperty {
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  enum?: string[];
}

type WalletContext = {
  toolCallId: string;
  messages: unknown[];
  publicKey?: string;
  signTransaction?: <T extends Transaction | VersionedTransaction>(
    transaction: T,
  ) => Promise<T>;
};
// Dummy tools for teaching - replace real blockchain calls with static data
/* eslint-disable @typescript-eslint/no-unused-vars */
const dummyBlockchainMcpTools = {
  fetch_user_organizations: {
    description: "Fetch user organizations",
    execute: async (_args: Record<string, unknown>, context: WalletContext) => {
      console.log("Context:", context);
      const { publicKey, signTransaction } = context;
      if (!publicKey || !signTransaction) {
        return {
          success: false,
          organizations: [],
        };
      }
      const program = await getProvider(
        new PublicKey(publicKey),
        signTransaction,
      );
      if (!program) {
        return {
          success: false,
          organizations: [],
        };
      }
      const org = await fetchUserOrganizations(
        program,
        new PublicKey(publicKey),
      );
      if (!org) {
        return {
          success: false,
          organizations: [],
        };
      }
      return {
        success: true,
        organizations: org,
      };
    },
  },
  fetch_organization_details: {
    description: "Fetch organization details",
    execute: async (args: { orgPda?: string }, context: WalletContext) => {
      console.log("Context:", context);
      const { publicKey, signTransaction } = context;
      if (!publicKey || !signTransaction) {
        return {
          success: false,
          organizations: [],
        };
      }
      const program = await getProvider(
        new PublicKey(publicKey),
        signTransaction,
      );
      if (!program) {
        return {
          success: false,
          organizations: [],
        };
      }
      console.log("Fetching details for orgPda:", args.orgPda);
      if (!args.orgPda) {
        return {
          success: false,
          message: "Organization PDA is required",
          organization: null,
        };
      }
      const orgDetails = await fetchOrganizationDetails(program, args.orgPda);

      return {
        success: true,
        organization: orgDetails,
      };
    },
  },
  create_organization: {
    description: "Create organization",
    execute: async (args: { name: string }, context: WalletContext) => {
      console.log("Context:", context);
      const { publicKey, signTransaction } = context;
      if (!publicKey || !signTransaction) {
        return {
          success: false,
          organizations: [],
        };
      }
      const program = await getProvider(
        new PublicKey(publicKey),
        signTransaction,
      );
      if (!program) {
        return {
          success: false,
          organizations: [],
        };
      }
      const newOrg = await createOrganization(
        program,
        new PublicKey(publicKey),
        args.name,
      );
      const [organizationPda] = await deriveOrganizationPDA(new PublicKey(publicKey), args.name);

      return {
        success: true,
        message: `Organization ${args.name} created`,
        orgPda: organizationPda.toString(),
      };
    },
  },
  // Add dummies for other tools similarly...
  add_worker: {
    description: "Add worker",
    execute: async (
      args: { orgPda?: string; workerPublicKey?: string; salaryInSol?: number },
      context: WalletContext,
    ) => {
      console.log("args:", args);
      const { publicKey, signTransaction } = context;
      if (!publicKey || !signTransaction) {
        return {
          success: false,
          message: "Wallet not connected",
        };
      }
      const program = await getProvider(
        new PublicKey(publicKey),
        signTransaction,
      );
      if (!program) {
        return {
          success: false,
          message: "Failed to get program",
        };
      }
      if (!args.orgPda || !args.workerPublicKey || args.salaryInSol === undefined ) {
        return {
          success: false,
          message: "Missing required fields",
        };
      }
      const result = await addWorker(program, new PublicKey(publicKey), new PublicKey(args.workerPublicKey), args.salaryInSol, args.orgPda);
      if (!result) {
        return {
          success: false,
          message: "Failed to add worker",
        };
      }
      return { success: true, message: "Worker added successfully" };
    },
  },
  fund_treasury: {
    description: "Fund treasury",
    execute: async (
      args: { orgPda?: string; amountInSol?: number },
      context: WalletContext,
    ) => {
      console.log("args:", args);
      const { publicKey, signTransaction } = context;
      if (!publicKey || !signTransaction) {
        return {
          success: false,
          message: "Wallet not connected",
        };
      }
      const program = await getProvider(
        new PublicKey(publicKey),
        signTransaction,
      );
      if (!program) {
        return {
          success: false,
          message: "Failed to get program",
        };
      }
        if (!args.orgPda || args.amountInSol === undefined) {
        return {
          success: false,
          message: "Missing required fields",
        };
      }
      const org= await fetchOrganizationDetails(program, args.orgPda);
      if (!org) {
        return {
          success: false,
          message: "Failed to fetch organization details",
        };
      }
      if(org.authority.toString() !== publicKey) {
        return {
          success: false,
          message: "Only organization authority can fund treasury",
        };
      }
    
      const result = await fundTreasury(program, args.orgPda, new PublicKey(publicKey), args.amountInSol);
      if (!result) {
        return {
          success: false,
          message: "Failed to fund treasury",
        };
      }
      return { success: true, message: "Treasury funded successfully" };
    },
  },
  process_payroll: {
    description: "Process payroll",
    execute: async (
      args: { orgPda?: string },
      context: WalletContext,
    ) => {
      console.log("args:", args);
      const { publicKey, signTransaction } = context;
      if (!publicKey || !signTransaction) {
        return {
          success: false,
          message: "Wallet not connected",
        };
      }
      const program = await getProvider(
        new PublicKey(publicKey),
        signTransaction,
      );
      if (!program) {
        return {
          success: false,
          message: "Failed to get program",
        };
      }
      if (!args.orgPda) {
        return {
          success: false,
          message: "Missing required fields",
        };
      }
      const result = await processPayroll(program, new PublicKey(publicKey), args.orgPda);
      if (!result) {
        return {
          success: false,
          message: "Failed to process payroll",
        };
      }
      return { success: true, message: "Payroll processed successfully" };
    },
  },
  withdraw_from_treasury: {
    description: "Withdraw from treasury",
    execute: async (
      args: { orgPda?: string; amountInSol?: number },
      context: WalletContext,
    ) => {
      const { publicKey, signTransaction } = context;
      if (!publicKey || !signTransaction) {
        return {
          success: false,
          message: "Wallet not connected",
        };
      }
      const program = await getProvider(
        new PublicKey(publicKey),
        signTransaction,
      );
      if (!program) {
        return {
          success: false,
          message: "Failed to get program",
        };
      }
      if (!args.orgPda || args.amountInSol === undefined) {
        return {
          success: false,
          message: "Missing required fields",
        };
      }
      const org = await fetchOrganizationDetails(program, args.orgPda);
      if (!org) {
        return {
          success: false,
          message: "Failed to fetch organization details",
        };
      }
      if (org.authority.toString() !== publicKey) {
        return {
          success: false,
          message: "Only organization authority can fund treasury",
        };
      }

      const result = await withdrawFromTreasury(program, new PublicKey(publicKey), args.orgPda, args.amountInSol);
      if (!result) {
        return {
          success: false,
          message: "Failed to withdraw from treasury",
        };
      }
      return { success: true, message: "Withdrawn from treasury successfully" };
    },
  },

};
/* eslint-enable @typescript-eslint/no-unused-vars */

const getGeminiTools = () => {
  return {
    functionDeclarations: Object.entries(dummyBlockchainMcpTools).map(
      ([name, tool]) => {
        const properties: Record<string, JsonSchemaProperty> = {};
        const required: string[] = [];

        if (name === "create_organization") {
          properties["name"] = {
            type: "string",
            description: "Organization name",
          };
          required.push("name");
        }

        return {
          name,
          description: tool.description || "No description provided.",
          parameters: {
            type: "object",
            properties,
            required,
          },
        };
      },
    ),
  };
};

const formatToolResponse = (
  toolName: string,
  toolArgs: Record<string, unknown>,
  toolOutput: unknown,
): string => {
  const lines: string[] = [];

  let outputData: Record<string, unknown> = {};
  if (typeof toolOutput === "string") {
    try {
      outputData = JSON.parse(toolOutput);
    } catch {
      outputData = { result: toolOutput };
    }
  } else if (typeof toolOutput === "object" && toolOutput !== null) {
    outputData = toolOutput as Record<string, unknown>;
  }

  if ("error" in outputData) {
    lines.push("");
    lines.push(`### ❌ Error`);
    lines.push("");
    lines.push(`${outputData.error}`);
    lines.push("");
    return lines.join("\n");
  }

  if ("success" in outputData && !outputData.success) {
    lines.push("");
    lines.push(`### ⚠️ Operation Failed`);
    lines.push("");
    if ("message" in outputData) {
      lines.push(`${outputData.message}`);
    }
    lines.push("");
    return lines.join("\n");
  }

  lines.push("");
  lines.push("### ✅ Operation Successful");
  lines.push("");

  if ("message" in outputData && outputData.message) {
    lines.push(`📝 ${outputData.message}`);
    lines.push("");
  }

  if (
    "signature" in outputData ||
    "workerPda" in outputData ||
    "orgPda" in outputData
  ) {
    lines.push("");
  }

  if (
    "organizations" in outputData &&
    Array.isArray(outputData.organizations)
  ) {
    lines.push("### 📋 Your Organizations");
    lines.push("");
    outputData.organizations.forEach((org: unknown, index: number) => {
      const orgData = org as Record<string, unknown>;
      lines.push(`**${index + 1}. ${orgData.name || "Unknown"}**`);
      lines.push(
        `- Treasury: **${Number(orgData.treasury || 0).toFixed(2)} SOL**`,
      );
      lines.push(`- Workers: ${orgData.workersCount || 0}`);
      if (orgData.publicKey) {
        lines.push(`- Address: \`${orgData.publicKey}\``);
      }
      lines.push("");
    });
  }

  if (
    "organization" in outputData &&
    typeof outputData.organization === "object"
  ) {
    const org = outputData.organization as Record<string, unknown>;
    lines.push("### 🏢 Organization Details");
    lines.push("");
    lines.push(`**Name**: ${org.name || "Unknown"}`);
    lines.push(
      `**Treasury Balance**: ${Number(org.treasury || 0).toFixed(2)} SOL`,
    );
    lines.push(`**Total Workers**: ${org.workerCount || 0}`);

    if (org.workers && Array.isArray(org.workers) && org.workers.length > 0) {
      lines.push("");
      lines.push("#### 👥 Workers");
      lines.push("");
      org.workers.forEach((worker: unknown, index: number) => {
        const w = worker as Record<string, unknown>;
        lines.push(`**${index + 1}.** \`${w.publicKey || "N/A"}\``);
        lines.push(`- Salary: **${Number(w.salary || 0).toFixed(2)} SOL**`);
        lines.push(
          `- Last Paid: ${w.lastPaid ? new Date(Number(w.lastPaid) * 1000).toLocaleDateString() : "Never"}`,
        );
        lines.push("");
      });
    }
  }

  if ("results" in outputData && Array.isArray(outputData.results)) {
    lines.push("### 💰 Payroll Processing Results");
    lines.push("");
    outputData.results.forEach((result: unknown) => {
      const r = result as Record<string, unknown>;
      const status = r.success ? "✅" : "❌";
      lines.push(
        `${status} Worker \`${r.workerPublicKey || "Unknown"}\`: ${r.message || "No details"}`,
      );
    });
    lines.push("");
  }

  const displayedKeys = [
    "success",
    "message",
    "signature",
    "workerPda",
    "orgPda",
    "organizations",
    "organization",
    "results",
    "error",
  ];
  const remainingKeys = Object.keys(outputData).filter(
    (key) => !displayedKeys.includes(key),
  );

  if (remainingKeys.length > 0) {
    lines.push("### 📊 Additional Details");
    lines.push("");
    remainingKeys.forEach((key) => {
      const value = outputData[key];
      if (typeof value === "object") {
        lines.push(`- **${key}**: \`${JSON.stringify(value)}\``);
      } else {
        lines.push(`- **${key}**: ${value}`);
      }
    });
    lines.push("");
  }

  return lines.join("\n");
};

const Dashboard = () => {
  const [isPayrollOpen, setIsPayrollOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<PayrollSummary[]>([]);
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [apiKeySet, setApiKeySet] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, signTransaction } = useWallet();

  // Initialize messages with API key requirement check
  useEffect(() => {
    const hasEnvKey = !!process.env.NEXT_GEMINI_API_KEY;

    if (hasEnvKey) {
      setMessages([
        {
          id: "initial",
          role: "bot" as const,
          content:
            "Hi! I can help manage your payroll organizations. Ask me to create orgs, add workers, process payroll, or fetch details.",
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: "initial",
          role: "bot" as const,
          content:
            "Welcome! To get started, I need your Gemini API key. Please enter it below to enable chat functionality.",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);
  const getActiveApiKey = () => {
    return userApiKey.trim() || process.env.NEXT_GEMINI_API_KEY || "";
  };
  useEffect(() => {
    const handleResize = () => {
      setIsPayrollOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadOrganizations = async () => {
      if (!publicKey || !signTransaction) return;

      try {
        console.log(
          "Fetching organizations for public key:",
          publicKey.toBase58(),
        );
        const program = await getProvider(publicKey, signTransaction);
        if (!program) {
          console.error("Failed to get program instance");
          return;
        }
        const orgs = await fetchUserOrganizations(program, publicKey);
        if (!orgs) {
          console.error("Failed to fetch organizations");
          return;
        }
        const mappedOrgs: PayrollSummary[] = orgs.map((org: unknown) => {
          const orgData = org as Record<string, unknown>;
          const workerCount = Number(orgData.workersCount || 0);
          return {
            id: String(orgData.publicKey || orgData.name || ""),
            orgName: String(orgData.name || "Unknown"),
            treasury: Number(orgData.treasury || 0),
            createdAt: Number(orgData.createdAt || 0),
            workers: Array.from({ length: workerCount }, () => ({} as WorkerSummary)),
          };
        });
        setOrganizations(mappedOrgs);

        // const result = await fetchUserOrganizations(publicKey);
        // if (typeof result === 'object' && result !== null && 'success' in result) {
        //   if (result.success && Array.isArray(result.organizations)) {
        //     const mappedOrgs: PayrollSummary[] = result.organizations.map((org: unknown) => {
        //       const orgData = org as Record<string, unknown>;
        //       const workerCount = Number(orgData.workersCount || 0);
        //       return {
        //         id: String(orgData.publicKey || orgData.name || ''),
        //         orgName: String(orgData.name || 'Unknown'),
        //         treasury: Number(orgData.treasury || 0),
        //         createdAt: Number(orgData.createdAt || 0),
        //         workers: Array.from({ length: workerCount }, () => ({}) as WorkerSummary),
        //       };
        //     });
        //     setOrganizations(mappedOrgs);
        //   }
        // }
      } catch (error) {
        console.error("Failed to load organizations:", error);
      }
    };

    loadOrganizations();
  }, [publicKey, messages]);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userApiKey.trim()) {
      setApiKeySet(true);
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "bot" as const,
        content:
          "Great! API key configured. Now I can help manage your payroll organizations. Ask me to create orgs, add workers, process payroll, or fetch details.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
  };

  const generateResponse = async (userInput: string) => {
    setIsLoading(true);

    try {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user" as const,
        content: userInput,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const systemInstructionText = `You are a helpful payroll management assistant on Solana blockchain.

        Your available organizations:
        ${organizations.map((org) => `- ${org.orgName} (ID: ${org.id})`).join("\n")}

        When users ask to:
        - "Show organizations" or "list my orgs" → use fetch_user_organizations (no parameters needed)
        - "Show details for [ORG_NAME]" → use fetch_organization_details with orgPda from the list above
        - "Create organization [NAME]" → use create_organization with the name parameter
        - "Add worker" → use add_worker with orgPda, workerPublicKey, and salaryInSol
        - "Fund treasury" → use fund_treasury with orgPda and amountInSol
        - "Process payroll" → use process_payroll with orgPda
        - "Withdraw [AMOUNT] from [ORG_NAME]" → use withdraw_from_treasury with orgPda and amountInSol

        CRITICAL RULES:
        1. When a user mentions an organization by name (like "TESLA"), look it up in the list above to get its orgPda/ID
        2. Always extract ALL required parameters from user requests
        3. For fetch_organization_details, you MUST provide the orgPda parameter - use the ID from the organizations list
        4. If a parameter is missing, ask the user for it
        5. Be conversational and friendly in your responses
        6. After tools execute, provide a brief, natural summary - the tool results are already formatted nicely

        Available tools: ${Object.keys(dummyBlockchainMcpTools).join(", ")}`;

      const contents: GeminiContent[] = [
        ...messages.map(
          (m): GeminiContent => ({
            role: m.role === "bot" ? "model" : "user",
            parts: [{ text: m.content }],
          }),
        ),
        {
          role: "user",
          parts: [{ text: userInput }],
        },
      ];

      let fullResponse = "";
      let iterations = 0;
      const maxIterations = 5;
      const activeKey = getActiveApiKey();

      while (iterations < maxIterations) {
        iterations++;

        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": activeKey,
            },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemInstructionText }] },
              tools: [getGeminiTools()],
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch AI response, ${response.status}: ${response.statusText}`,
          );
        }

        const data: GeminiResponse = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        const candidate = data.candidates?.[0];

        if (!candidate || !candidate.content) {
          throw new Error("Invalid AI response structure");
        }

        const modelParts = candidate.content.parts || [];

        contents.push({
          role: "model",
          parts: modelParts,
        });

        const textParts = modelParts.filter(
          (p): p is { text: string } => "text" in p,
        );
        const functionCalls = modelParts.filter(
          (p): p is { functionCall: GeminiFunctionCall } => "functionCall" in p,
        );

        const modelText = textParts.map((p) => p.text).join("");
        if (modelText) {
          fullResponse += modelText + "\n";
        }

        if (functionCalls.length > 0) {
          const functionResponseParts: GeminiPart[] = [];

          for (const fnCall of functionCalls) {
            const toolName = fnCall.functionCall.name;
            const toolArgs = fnCall.functionCall.args || {};

            let toolOutput: unknown;
            try {
              const tool =
                dummyBlockchainMcpTools[
                  toolName as keyof typeof dummyBlockchainMcpTools
                ];
              if (!tool || !tool.execute) {
                throw new Error(`Unknown tool: ${toolName}`);
              }

              toolOutput = await (
                tool.execute as (
                  args: Record<string, unknown>,
                  ctx: WalletContext,
                ) => Promise<unknown>
              )(toolArgs, {
                toolCallId: toolName,
                messages: [],
                publicKey: publicKey?.toBase58(),
                signTransaction,
              });
            } catch (error) {
              console.error(`Tool execution error for ${toolName}:`, error);
              toolOutput = { error: (error as Error).message };
            }

            const formattedOutput = formatToolResponse(
              toolName,
              toolArgs,
              toolOutput,
            );
            fullResponse += formattedOutput;

            const responseObject: Record<string, unknown> =
              typeof toolOutput === "object" && toolOutput !== null
                ? (toolOutput as Record<string, unknown>)
                : { result: toolOutput };

            functionResponseParts.push({
              functionResponse: {
                name: toolName,
                response: responseObject,
              },
            });
          }

          contents.push({
            role: "user",
            parts: functionResponseParts,
          });

          continue;
        }

        if (
          candidate.finishReason === "STOP" ||
          candidate.finishReason === "MAX_TOKENS"
        ) {
          break;
        }

        break;
      }

      if (!fullResponse.trim()) {
        fullResponse =
          "I received your message but couldn't generate a response. Please try again.";
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "bot" as const,
        content: fullResponse.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const tool = dummyBlockchainMcpTools.fetch_user_organizations;
      const result = await tool.execute(
        {},
        { toolCallId: "refresh", messages: [] },
      );
      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        result.success
      ) {
        const mappedOrgs: PayrollSummary[] = (
          result.organizations as unknown[]
        ).map((org: unknown) => {
          const orgData = org as Record<string, unknown>;
          const workerCount = Number(orgData.workersCount || 0);
          return {
            id: String(orgData.publicKey || orgData.name || ""),
            orgName: String(orgData.name || "Unknown"),
            treasury: Number(orgData.treasury || 0),
            workers: Array.from(
              { length: workerCount },
              () => ({}) as WorkerSummary,
            ),
            createdAt: Number(orgData.createdAt || 0),
          };
        });
        setOrganizations(mappedOrgs);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "bot" as const,
        content: `Sorry, something went wrong: ${(error as Error).message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      generateResponse(input);
      setInput("");
    }
  };

  const formatLamports = (lamports: number) => {
    return lamports.toFixed(2) + " SOL";
  };

  const handleViewDetails = (orgName: string) => {
    generateResponse(`Show details for organization ${orgName}`);
  };

  const handleTogglePanel = () => {
    setIsPayrollOpen(!isPayrollOpen);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />

      {!publicKey && (
        <div className="fixed top-20 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-md bg-[#131319] border border-[#23232d] text-[12px] text-[#c7c7cf] shadow-lg">
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          Connect your wallet to enable transactions.
        </div>
      )}

      <main className="relative z-10 flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7c7ff5] mb-1.5">
                Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white">
                Dashboard
              </h1>
              <p className="mt-1.5 text-[13px] text-[#8b8b96]">
                Manage organizations and run payroll through the assistant.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[calc(100vh-14rem)]">
            <div
              className={`${isPayrollOpen ? "lg:col-span-2" : "lg:col-span-3"} min-h-[60vh] flex`}
            >
              <ChatPanel
                messages={messages}
                input={input}
                isLoading={isLoading || !apiKeySet}
                isPayrollOpen={isPayrollOpen}
                publicKey={publicKey?.toBase58()}
                onInputChange={setInput}
                onSubmit={handleSubmit}
                apiKeySet={apiKeySet}
                userApiKey={userApiKey}
                onApiKeyChange={setUserApiKey}
                onApiKeySubmit={handleApiKeySubmit}
              />
            </div>

            <OrganizationsPanel
              organizations={organizations}
              selectedOrg={selectedOrg}
              isOpen={isPayrollOpen}
              onToggle={handleTogglePanel}
              onSelectOrg={setSelectedOrg}
              onViewDetails={handleViewDetails}
              formatLamports={formatLamports}
            />
          </div>

          {!isPayrollOpen && (
            <button
              onClick={handleTogglePanel}
              className="fixed right-4 sm:right-6 bottom-6 sm:top-24 sm:bottom-auto z-40 h-9 px-3 inline-flex items-center gap-1.5 rounded-md bg-[#131319] border border-[#23232d] text-[13px] font-medium text-[#c7c7cf] hover:text-white hover:border-[#2e2e3a] transition-colors"
              aria-label="Open organizations panel"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Organizations</span>
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
