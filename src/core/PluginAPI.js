const chalk = require('chalk');

class PluginAPI {
  constructor(pluginManager, templateManager) {
    this.pluginManager = pluginManager;
    this.templateManager = templateManager;
  }

  /**
   * Register a new template generator
   * @param {string} type - Template type
   * @param {Function} generator - Generator function
   */
  registerTemplate(type, generator) {
    if (this.templateManager.hasTemplate(type)) {
      console.warn(chalk.yellow(`⚠️  Template type "${type}" already exists`));
      return;
    }

    this.templateManager.registerTemplate(type, generator);
    console.log(chalk.green(`✅ Template "${type}" registered by plugin`));
  }

  /**
   * Register a CLI command
   * @param {string} name - Command name
   * @param {Object} config - Command configuration
   */
  registerCommand(name, config) {
    // This will be implemented when we integrate with the CLI system
    console.log(chalk.blue(`📋 Command "${name}" registered by plugin`));
  }

  /**
   * Register a hook
   * @param {string} hookName - Hook name
   * @param {Function} callback - Callback function
   */
  registerHook(hookName, callback) {
    this.pluginManager.registerHook(hookName, callback);
  }

  /**
   * Execute hooks
   * @param {string} hookName - Hook name
   * @param {any} data - Data to pass to hooks
   * @returns {any} - Modified data
   */
  async executeHooks(hookName, data) {
    return await this.pluginManager.executeHooks(hookName, data);
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key
   * @param {any} defaultValue - Default value
   * @returns {any} - Configuration value
   */
  getConfig(key, defaultValue = null) {
    // This will be implemented when we add configuration management
    return defaultValue;
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key
   * @param {any} value - Configuration value
   */
  setConfig(key, value) {
    // This will be implemented when we add configuration management
    console.log(chalk.blue(`🔧 Config "${key}" set to "${value}"`));
  }

  /**
   * Log message with plugin context
   * @param {string} pluginName - Plugin name
   * @param {string} message - Message
   * @param {string} level - Log level
   */
  log(pluginName, message, level = 'info') {
    const prefix = chalk.cyan(`[${pluginName}]`);
    
    switch (level) {
      case 'error':
        console.error(prefix, chalk.red(message));
        break;
      case 'warn':
        console.warn(prefix, chalk.yellow(message));
        break;
      case 'success':
        console.log(prefix, chalk.green(message));
        break;
      default:
        console.log(prefix, message);
    }
  }

  /**
   * Get available templates
   * @returns {Array} - Available templates
   */
  getAvailableTemplates() {
    return this.templateManager.getAvailableTemplates();
  }

  /**
   * Generate template
   * @param {string} type - Template type
   * @param {string} name - Template name
   * @param {Object} options - Template options
   */
  async generateTemplate(type, name, options = {}) {
    return await this.templateManager.generateTemplate(type, name, options);
  }
}

module.exports = PluginAPI;