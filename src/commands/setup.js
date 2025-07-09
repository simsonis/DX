const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function setupProject() {
  console.log(chalk.blue('🔧 Setting up development environment...'));

  try {
    // Create essential directories
    const directories = [
      'src/components',
      'src/utils',
      'src/config',
      'tests',
      'docs',
      '.vscode'
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
      console.log(chalk.green(`✓ Created directory: ${dir}`));
    }

    // Create VS Code settings
    const vscodeSettings = {
      "editor.formatOnSave": true,
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "eslint.autoFixOnSave": true,
      "files.autoSave": "onFocusChange"
    };

    await fs.writeJson('.vscode/settings.json', vscodeSettings, { spaces: 2 });
    console.log(chalk.green('✓ VS Code settings configured'));

    // Create .gitignore
    const gitignoreContent = `node_modules/
.env
.DS_Store
*.log
dist/
build/
coverage/
.nyc_output/
`;

    await fs.writeFile('.gitignore', gitignoreContent);
    console.log(chalk.green('✓ .gitignore created'));

    // Create ESLint config
    const eslintConfig = {
      "env": {
        "node": true,
        "es2021": true
      },
      "extends": ["eslint:recommended"],
      "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
      },
      "rules": {
        "no-console": "warn",
        "no-unused-vars": "error"
      }
    };

    await fs.writeJson('.eslintrc.json', eslintConfig, { spaces: 2 });
    console.log(chalk.green('✓ ESLint configuration created'));

    // Create Prettier config
    const prettierConfig = {
      "semi": true,
      "trailingComma": "es5",
      "singleQuote": true,
      "printWidth": 80,
      "tabWidth": 2
    };

    await fs.writeJson('.prettierrc.json', prettierConfig, { spaces: 2 });
    console.log(chalk.green('✓ Prettier configuration created'));

    console.log(chalk.green.bold('\n🎉 Development environment setup complete!'));
    console.log(chalk.yellow('Next steps:'));
    console.log(chalk.yellow('1. Run "npm install" to install dependencies'));
    console.log(chalk.yellow('2. Run "npm run dev" to start development'));

  } catch (error) {
    console.error(chalk.red(`❌ Setup failed: ${error.message}`));
  }
}

module.exports = { setupProject };