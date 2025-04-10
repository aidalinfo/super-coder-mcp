# Clean Code MCP Server

An MCP server implementation that provides a tool for planning and creating clean, well-structured code with comprehensive English comments.

## Features

- Plan code architecture step by step
- Design modular, maintainable components
- Follow clean code principles and best practices
- Create comprehensive documentation with English comments
- Revise design decisions as requirements become clearer
- Branch into alternative implementation strategies
- Focus on code readability and simplicity

## Tool

### cleancode

Facilitates clean code planning with a focus on readability, maintainability, and well-structured English comments.

**Inputs:**
- `thought` (string): Your current code planning step
- `nextThoughtNeeded` (boolean): Whether another code planning step is needed
- `thoughtNumber` (integer): Current step number
- `totalThoughts` (integer): Estimated total steps needed
- `isRevision` (boolean, optional): Whether this revises a previous planning step
- `revisesThought` (integer, optional): Which step is being reconsidered
- `branchFromThought` (integer, optional): Branching point step number for alternative approach
- `branchId` (string, optional): Alternative implementation identifier
- `needsMoreThoughts` (boolean, optional): If more planning steps are needed

## Usage

The Clean Code tool is designed for:
- Before writing complex code that needs careful planning
- When designing new features or refactoring existing code
- When code structure and organization are critical
- For ensuring comprehensive documentation with English comments
- For following clean code principles and best practices
- For breaking down complex functionality into modular components
- For planning testable and maintainable implementations

## Configuration

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

#### npx

```json
{
  "mcpServers": {
    "clean-code": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-clean-code"
      ]
    }
  }
}
```

#### docker

```json
{
  "mcpServers": {
    "cleancode": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp/cleancode"
      ]
    }
  }
}
```

## Building

Docker:

```bash
docker build -t mcp/cleancode .
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
