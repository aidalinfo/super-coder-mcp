#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
// Fixed chalk import for ESM
import chalk from "chalk";

interface CodePlanningData {
  codeReflection: string;
  stepNumber: number;
  totalSteps: number;
  isRevision?: boolean;
  revisesStep?: number;
  branchFromStep?: number;
  branchId?: string;
  needsMoreSteps?: boolean;
  nextStepNeeded: boolean;
}

class CleanCodePlanningServer {
  private reflectionHistory: CodePlanningData[] = [];
  private branches: Record<string, CodePlanningData[]> = {};

  private validateCodePlanningData(input: unknown): CodePlanningData {
    const data = input as Record<string, unknown>;

    if (!data.codeReflection || typeof data.codeReflection !== "string") {
      throw new Error("Invalid codeReflection: must be a string");
    }
    if (!data.stepNumber || typeof data.stepNumber !== "number") {
      throw new Error("Invalid stepNumber: must be a number");
    }
    if (!data.totalSteps || typeof data.totalSteps !== "number") {
      throw new Error("Invalid totalSteps: must be a number");
    }
    if (typeof data.nextStepNeeded !== "boolean") {
      throw new Error("Invalid nextStepNeeded: must be a boolean");
    }

    return {
      codeReflection: data.codeReflection,
      stepNumber: data.stepNumber,
      totalSteps: data.totalSteps,
      nextStepNeeded: data.nextStepNeeded,
      isRevision: data.isRevision as boolean | undefined,
      revisesStep: data.revisesStep as number | undefined,
      branchFromStep: data.branchFromStep as number | undefined,
      branchId: data.branchId as string | undefined,
      needsMoreSteps: data.needsMoreSteps as boolean | undefined,
    };
  }

  private formatCodeReflection(reflectionData: CodePlanningData): string {
    const {
      stepNumber,
      totalSteps,
      codeReflection,
      isRevision,
      revisesStep,
      branchFromStep,
      branchId,
    } = reflectionData;

    let prefix = "";
    let context = "";

    if (isRevision) {
      prefix = chalk.yellow("🔄 Revision");
      context = ` (revising step ${revisesStep})`;
    } else if (branchFromStep) {
      prefix = chalk.green("🌿 Alternative");
      context = ` (from step ${branchFromStep}, ID: ${branchId})`;
    } else {
      prefix = chalk.blue("🧩 Code Step");
      context = "";
    }

    const header = `${prefix} ${stepNumber}/${totalSteps}${context}`;
    const border = "─".repeat(
      Math.max(header.length, codeReflection.length) + 4
    );

    return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${codeReflection.padEnd(border.length - 2)} │
└${border}┘`;
  }

  public processCodePlanning(input: unknown): {
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  } {
    try {
      const validatedInput = this.validateCodePlanningData(input);

      if (validatedInput.stepNumber > validatedInput.totalSteps) {
        validatedInput.totalSteps = validatedInput.stepNumber;
      }

      this.reflectionHistory.push(validatedInput);

      if (validatedInput.branchFromStep && validatedInput.branchId) {
        if (!this.branches[validatedInput.branchId]) {
          this.branches[validatedInput.branchId] = [];
        }
        this.branches[validatedInput.branchId].push(validatedInput);
      }

      const formattedReflection = this.formatCodeReflection(validatedInput);
      console.error(formattedReflection);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stepNumber: validatedInput.stepNumber,
                totalSteps: validatedInput.totalSteps,
                nextStepNeeded: validatedInput.nextStepNeeded,
                branches: Object.keys(this.branches),
                reflectionHistoryLength: this.reflectionHistory.length,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                error: error instanceof Error ? error.message : String(error),
                status: "failed",
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  }
}

const CLEAN_CODE_TOOL: Tool = {
  name: "cleancode",
  description: `A detailed tool for planning and creating clean, well-structured code with comprehensive English comments.
This tool helps analyze coding problems through a flexible planning process that focuses on code quality and readability.
Each step can address different aspects of clean code principles and best practices.

When to use this tool:
- Before writing complex code that needs careful planning
- When designing a new feature or refactoring existing code
- When code structure and organization are critical
- For ensuring comprehensive documentation with English comments
- For following clean code principles and best practices
- For breaking down complex functionality into modular components
- For planning testable and maintainable implementations

Key features:
- You can plan your code architecture step by step
- You can revise previous design decisions as requirements become clearer
- You can branch into alternative implementation strategies
- You can focus on different aspects of clean code in each step
- Creates well-documented, readable, and maintainable code
- Follows established coding conventions and best practices
- Prioritizes simplicity and clarity over cleverness

Parameters explained:
- thought: Your current code planning step, which can include:
* Architecture and design considerations
* Module and component organization
* Function signature planning
* Comments and documentation strategies
* Error handling approaches
* Performance considerations
* Testing strategies
* Revisions to previous design decisions
* Alternative implementation approaches
- next_thought_needed: True if you need more planning steps before finalizing
- thought_number: Current step number in sequence
- total_thoughts: Current estimate of steps needed
- is_revision: A boolean indicating if this step revises previous thinking
- revises_thought: If is_revision is true, which step number is being reconsidered
- branch_from_thought: If branching, which step number is the branching point
- branch_id: Identifier for the current implementation alternative
- needs_more_thoughts: If reaching end but realizing more planning is needed

You should:
1. Start with high-level architecture and design considerations
2. Break down complex functionality into smaller, modular components
3. Plan function signatures, interfaces, and data structures
4. Consider error handling and edge cases
5. Draft comprehensive comments that explain the "why" not just the "what"
6. Follow the SOLID principles and other clean code practices
7. Prioritize readability and maintainability over cleverness
8. Plan for testability from the beginning
9. Only set next_thought_needed to false when the code planning is complete
10. Produce code that is clear, concise, and well-documented in English`,
  inputSchema: {
    type: "object",
    properties: {
      thought: {
        type: "string",
        description: "Your current code planning step",
      },
      nextThoughtNeeded: {
        type: "boolean",
        description: "Whether another code planning step is needed",
      },
      thoughtNumber: {
        type: "integer",
        description: "Current step number",
        minimum: 1,
      },
      totalThoughts: {
        type: "integer",
        description: "Estimated total steps needed",
        minimum: 1,
      },
      isRevision: {
        type: "boolean",
        description: "Whether this revises a previous planning step",
      },
      revisesThought: {
        type: "integer",
        description: "Which step is being reconsidered",
        minimum: 1,
      },
      branchFromThought: {
        type: "integer",
        description: "Branching point step number for alternative approach",
        minimum: 1,
      },
      branchId: {
        type: "string",
        description: "Alternative implementation identifier",
      },
      needsMoreThoughts: {
        type: "boolean",
        description: "If more planning steps are needed",
      },
    },
    required: [
      "thought",
      "nextThoughtNeeded",
      "thoughtNumber",
      "totalThoughts",
    ],
  },
};

const server = new Server(
  {
    name: "clean-code-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const cleanCodeServer = new CleanCodePlanningServer();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [CLEAN_CODE_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "cleancode") {
    return cleanCodeServer.processCodePlanning({
      codeReflection: request.params.arguments.thought,
      stepNumber: request.params.arguments.thoughtNumber,
      totalSteps: request.params.arguments.totalThoughts,
      nextStepNeeded: request.params.arguments.nextThoughtNeeded,
      isRevision: request.params.arguments.isRevision,
      revisesStep: request.params.arguments.revisesThought,
      branchFromStep: request.params.arguments.branchFromThought,
      branchId: request.params.arguments.branchId,
      needsMoreSteps: request.params.arguments.needsMoreThoughts,
    });
  }

  return {
    content: [
      {
        type: "text",
        text: `Unknown tool: ${request.params.name}`,
      },
    ],
    isError: true,
  };
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Clean Code MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
