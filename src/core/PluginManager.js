const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.pluginDirs = [
      path.join(__dirname, '../plugins'),
      path.join(process.cwd(), 'dx-plugins'),
      path.join(process.cwd(), 'node_modules')
    ];
    this.hooks = new Map();
  }

  /**
   * Register a plugin
   * @param {string} name - Plugin name
   * @param {Object} plugin - Plugin object
   */
  register(name, plugin) {
    if (this.plugins.has(name)) {
      console.warn(chalk.yellow(`⚠️  Plugin "${name}" is already registered`));
      return;
    }

    // Validate plugin structure
    if (!this.validatePlugin(plugin)) {
      console.error(chalk.red(`❌ Invalid plugin structure for "${name}"`));
      return;
    }

    this.plugins.set(name, plugin);
    console.log(chalk.green(`✅ Plugin "${name}" registered successfully`));

    // Register plugin hooks
    if (plugin.hooks) {
      Object.keys(plugin.hooks).forEach(hookName => {
        this.registerHook(hookName, plugin.hooks[hookName]);
      });
    }

    // Execute plugin initialization
    if (plugin.initialize) {
      plugin.initialize();
    }
  }

  /**
   * Load plugins from directories
   */
  async loadPlugins() {
    console.log(chalk.blue('🔌 Loading plugins...'));

    for (const pluginDir of this.pluginDirs) {
      try {
        if (await fs.pathExists(pluginDir)) {
          await this.loadPluginsFromDirectory(pluginDir);
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error loading plugins from ${pluginDir}: ${error.message}`));
      }
    }

    console.log(chalk.green(`✅ Loaded ${this.plugins.size} plugins`));
  }

  /**
   * Load plugins from a specific directory
   * @param {string} directory - Directory path
   */
  async loadPluginsFromDirectory(directory) {
    const entries = await fs.readdir(directory);

    for (const entry of entries) {
      const fullPath = path.join(directory, entry);
      const stat = await fs.stat(fullPath);

      if (stat.isDirectory()) {
        const packagePath = path.join(fullPath, 'package.json');
        
        if (await fs.pathExists(packagePath)) {
          const packageJson = await fs.readJson(packagePath);
          
          // Check if it's a DX plugin
          if (packageJson.keywords && packageJson.keywords.includes('dx-plugin')) {
            await this.loadPlugin(fullPath, packageJson);
          }
        }
      }
    }
  }

  /**
   * Load a single plugin
   * @param {string} pluginPath - Plugin path
   * @param {Object} packageJson - Package.json content
   */
  async loadPlugin(pluginPath, packageJson) {
    try {
      const mainFile = packageJson.main || 'index.js';
      const pluginFile = path.join(pluginPath, mainFile);

      if (await fs.pathExists(pluginFile)) {
        const plugin = require(pluginFile);
        this.register(packageJson.name, plugin);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error loading plugin ${packageJson.name}: ${error.message}`));
    }
  }

  /**
   * Validate plugin structure
   * @param {Object} plugin - Plugin object
   * @returns {boolean} - Is valid
   */
  validatePlugin(plugin) {
    return (
      plugin &&
      typeof plugin === 'object' &&
      typeof plugin.name === 'string' &&
      typeof plugin.version === 'string'
    );
  }

  /**
   * Register a hook
   * @param {string} hookName - Hook name
   * @param {Function} callback - Callback function
   */
  registerHook(hookName, callback) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(callback);
  }

  /**
   * Execute hooks
   * @param {string} hookName - Hook name
   * @param {any} data - Data to pass to hooks
   * @returns {any} - Modified data
   */
  async executeHooks(hookName, data = null) {
    const hooks = this.hooks.get(hookName);
    if (!hooks) return data;

    let result = data;
    for (const hook of hooks) {
      try {
        result = await hook(result);
      } catch (error) {
        console.error(chalk.red(`❌ Hook "${hookName}" error: ${error.message}`));
      }
    }
    return result;
  }

  /**
   * Get plugin by name
   * @param {string} name - Plugin name
   * @returns {Object|null} - Plugin object
   */
  getPlugin(name) {
    return this.plugins.get(name) || null;
  }

  /**
   * Get all plugins
   * @returns {Map} - All plugins
   */
  getAllPlugins() {
    return this.plugins;
  }

  /**
   * Unregister a plugin
   * @param {string} name - Plugin name
   */
  unregister(name) {
    const plugin = this.plugins.get(name);
    if (plugin) {
      // Execute plugin cleanup
      if (plugin.cleanup) {
        plugin.cleanup();
      }
      this.plugins.delete(name);
      console.log(chalk.green(`✅ Plugin "${name}" unregistered`));
    }
  }

  /**
   * Get plugin information
   * @returns {Array} - Plugin information
   */
  getPluginInfo() {
    return Array.from(this.plugins.entries()).map(([name, plugin]) => ({
      name,
      version: plugin.version,
      description: plugin.description || 'No description',
      author: plugin.author || 'Unknown'
    }));
  }
}

module.exports = PluginManager;