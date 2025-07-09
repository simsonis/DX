#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Import modules
const { setupProject } = require('./commands/setup');
const { generateTemplate } = require('./commands/generate');
const { lintProject } = require('./commands/lint');

// Import plugin system
const PluginManager = require('./core/PluginManager');
const TemplateManager = require('./core/TemplateManager');
const PluginAPI = require('./core/PluginAPI');

// Initialize plugin system
const pluginManager = new PluginManager();
const templateManager = new TemplateManager();
const pluginAPI = new PluginAPI(pluginManager, templateManager);

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
  .action(async (type, options) => {
    await pluginManager.loadPlugins();
    
    // Register Vue plugin manually for demo
    const vuePlugin = require('./plugins/vue-plugin');
    if (vuePlugin.register) {
      vuePlugin.register(pluginAPI);
    }

    // Register Express plugin
    const expressPlugin = require('./plugins/express-plugin');
    if (expressPlugin.register) {
      expressPlugin.register(pluginAPI);
    }
    
    // Check if template exists in plugin system
    if (templateManager.hasTemplate(type)) {
      const name = options.name || 'MyComponent';
      await templateManager.generateTemplate(type, name, options);
    } else {
      // Fall back to original generate function
      await generateTemplate(type, options);
    }
  });

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
        default: 'my-dx-project',
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'Project type:',
        choices: ['cli-tool', 'web-app', 'api-server', 'library'],
      },
      {
        type: 'confirm',
        name: 'useTypescript',
        message: 'Use TypeScript?',
        default: true,
      },
    ]);

    console.log(chalk.green(`✨ Creating ${answers.projectName} project...`));
    // Project initialization logic will be implemented
  });

program
  .command('plugins')
  .description('List installed plugins')
  .action(async () => {
    await pluginManager.loadPlugins();
    const plugins = pluginManager.getPluginInfo();
    
    if (plugins.length === 0) {
      console.log(chalk.yellow('No plugins installed'));
      return;
    }
    
    console.log(chalk.blue('📦 Installed Plugins:'));
    plugins.forEach(plugin => {
      console.log(`  ${chalk.green(plugin.name)} v${plugin.version}`);
      console.log(`    ${plugin.description}`);
      console.log(`    Author: ${plugin.author}`);
      console.log('');
    });
  });

program
  .command('templates')
  .description('List available templates')
  .action(async () => {
    await pluginManager.loadPlugins();
    const templates = templateManager.getTemplateInfo();
    
    console.log(chalk.blue('📝 Available Templates:'));
    templates.forEach(template => {
      console.log(`  ${chalk.green(template.type)} - ${template.description}`);
    });
  });

// Initialize plugin system
async function initializePlugins() {
  await pluginManager.loadPlugins();
  
  // Register Vue plugin manually for demo
  const vuePlugin = require('./plugins/vue-plugin');
  if (vuePlugin.register) {
    vuePlugin.register(pluginAPI);
  }

  // Register Express plugin
  const expressPlugin = require('./plugins/express-plugin');
  if (expressPlugin.register) {
    expressPlugin.register(pluginAPI);
  }
}

// Initialize and parse
initializePlugins().then(() => {
  program.parse();
}).catch(error => {
  console.error(chalk.red('❌ Failed to initialize plugins:'), error.message);
  process.exit(1);
});
