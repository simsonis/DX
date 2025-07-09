#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

// Import modules
const { setupProject } = require('./commands/setup');
const { generateTemplate } = require('./commands/generate');
const { lintProject } = require('./commands/lint');

console.log(chalk.blue.bold('🚀 DX - Developer Experience Toolkit'));

program
  .name('dx')
  .description('Developer Experience toolkit for better development workflow')
  .version('1.0.0');

program
  .command('setup')
  .description('Setup development environment and project structure')
  .action(setupProject);

program
  .command('generate <type>')
  .description('Generate code templates and boilerplate')
  .option('-n, --name <name>', 'Name of the component/module')
  .action(generateTemplate);

program
  .command('lint')
  .description('Run linting and code quality checks')
  .action(lintProject);

program
  .command('init')
  .description('Initialize a new DX project')
  .action(async () => {
    console.log(chalk.green('🎯 Initializing DX project...'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-dx-project'
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'Project type:',
        choices: ['cli-tool', 'web-app', 'api-server', 'library']
      },
      {
        type: 'confirm',
        name: 'useTypescript',
        message: 'Use TypeScript?',
        default: true
      }
    ]);

    console.log(chalk.green(`✨ Creating ${answers.projectName} project...`));
    // Project initialization logic will be implemented
  });

program.parse();