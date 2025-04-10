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

#### npm from GitHub

```json
{
  "mcpServers": {
    "clean-code": {
      "command": "npx",
      "args": [
        "-y",
        "github:aidalinfo/super-coder-mcp"
      ]
    }
  }
}
```

#### Manual installation

```bash
# Install directly from GitHub
npm install -g github:aidalinfo/super-coder-mcp

# Then use in configuration
{
  "mcpServers": {
    "cleancode": {
      "command": "mcp-server-clean-code"
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

## GitHub Actions CI/CD

This repository includes a GitHub Actions workflow that automatically publishes the package to npm when a new release is created.

### Setting up for automatic npm publishing

To enable automatic publishing to npm, you need to add an NPM_TOKEN secret to your GitHub repository:

1. Generate an npm access token:
   - Go to npmjs.com and log in
   - Click on your profile picture in the top right corner and select "Access Tokens"
   - Click "Generate New Token" and choose the "Publish" option
   - Copy the generated token

2. Add the token to your GitHub repository:
   - Go to your GitHub repository
   - Click on "Settings" > "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste the token you copied from npm
   - Click "Add secret"

3. Create a new release:
   - Go to your GitHub repository
   - Click on "Releases" > "Create a new release"
   - Choose a tag version (e.g., v1.0.0)
   - Add a release title and description
   - Click "Publish release"

The GitHub Actions workflow will automatically trigger, build the package, and publish it to npm.

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
