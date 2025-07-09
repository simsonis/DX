# DX - Developer Experience Toolkit

🚀 A comprehensive toolkit for improving developer experience and productivity.

## Features

- **Project Setup**: Automated development environment configuration
- **Code Generation**: Templates for components, utilities, and configurations
- **Code Quality**: Integrated linting and formatting tools
- **CLI Interface**: Easy-to-use command-line interface

## Installation

```bash
npm install
```

## Usage

### Initialize Development Environment

```bash
npm run setup
```

This will:
- Create essential directory structure
- Configure VS Code settings
- Setup ESLint and Prettier
- Create .gitignore file

### Available Commands

```bash
# Initialize a new DX project
node src/index.js init

# Setup development environment
node src/index.js setup

# Generate code templates
node src/index.js generate component --name MyComponent
node src/index.js generate utility --name MyUtility
node src/index.js generate config --name MyConfig

# Run code quality checks
node src/index.js lint
```

### Development Scripts

```bash
# Start development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build project
npm run build
```

## Project Structure

```
dx/
├── src/
│   ├── commands/          # CLI command implementations
│   ├── components/        # Reusable components
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── index.js          # Main entry point
├── tests/                # Test files
├── docs/                 # Documentation
├── .vscode/             # VS Code settings
├── package.json         # Project dependencies
└── README.md           # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License