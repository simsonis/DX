const chalk = require('chalk');
const fs = require('fs-extra');

class TemplateManager {
  constructor() {
    this.templates = new Map();
    this.registerDefaultTemplates();
  }

  /**
   * Register default templates
   */
  registerDefaultTemplates() {
    // Import existing template functions
    const { generateTemplate } = require('../commands/generate');
    
    // Register existing templates
    this.templates.set('component', this.createTemplateWrapper('component'));
    this.templates.set('utility', this.createTemplateWrapper('utility'));
    this.templates.set('config', this.createTemplateWrapper('config'));
    this.templates.set('ts-component', this.createTemplateWrapper('ts-component'));
    this.templates.set('ts-utility', this.createTemplateWrapper('ts-utility'));
    this.templates.set('ts-interface', this.createTemplateWrapper('ts-interface'));
    this.templates.set('react-component', this.createTemplateWrapper('react-component'));
    this.templates.set('react-hook', this.createTemplateWrapper('react-hook'));
  }

  /**
   * Create a wrapper for existing template functions
   * @param {string} type - Template type
   * @returns {Function} - Template wrapper function
   */
  createTemplateWrapper(type) {
    return async (name, options = {}) => {
      const { generateTemplate } = require('../commands/generate');
      return await generateTemplate(type, { name, ...options });
    };
  }

  /**
   * Register a new template
   * @param {string} type - Template type
   * @param {Function} generator - Generator function
   */
  registerTemplate(type, generator) {
    if (this.templates.has(type)) {
      console.warn(chalk.yellow(`⚠️  Template "${type}" already exists, overriding...`));
    }

    this.templates.set(type, generator);
    console.log(chalk.green(`✅ Template "${type}" registered`));
  }

  /**
   * Check if template exists
   * @param {string} type - Template type
   * @returns {boolean} - Template exists
   */
  hasTemplate(type) {
    return this.templates.has(type);
  }

  /**
   * Get available templates
   * @returns {Array} - Available template types
   */
  getAvailableTemplates() {
    return Array.from(this.templates.keys());
  }

  /**
   * Generate template
   * @param {string} type - Template type
   * @param {string} name - Template name
   * @param {Object} options - Template options
   * @returns {Promise<any>} - Generation result
   */
  async generateTemplate(type, name, options = {}) {
    const generator = this.templates.get(type);
    
    if (!generator) {
      throw new Error(`Template type "${type}" not found`);
    }

    try {
      console.log(chalk.blue(`📝 Generating ${type} template: ${name}`));
      const result = await generator(name, options);
      console.log(chalk.green(`✅ Template "${name}" generated successfully`));
      return result;
    } catch (error) {
      console.error(chalk.red(`❌ Template generation failed: ${error.message}`));
      throw error;
    }
  }

  /**
   * Get template generator
   * @param {string} type - Template type
   * @returns {Function|null} - Template generator function
   */
  getTemplate(type) {
    return this.templates.get(type) || null;
  }

  /**
   * Remove template
   * @param {string} type - Template type
   */
  removeTemplate(type) {
    if (this.templates.has(type)) {
      this.templates.delete(type);
      console.log(chalk.green(`✅ Template "${type}" removed`));
    }
  }

  /**
   * Get template information
   * @returns {Array} - Template information
   */
  getTemplateInfo() {
    return Array.from(this.templates.keys()).map(type => ({
      type,
      description: this.getTemplateDescription(type)
    }));
  }

  /**
   * Get template description
   * @param {string} type - Template type
   * @returns {string} - Template description
   */
  getTemplateDescription(type) {
    const descriptions = {
      'component': 'JavaScript component class',
      'utility': 'Utility function with JSDoc',
      'config': 'Configuration object',
      'ts-component': 'TypeScript component with interfaces',
      'ts-utility': 'TypeScript utility with generic types',
      'ts-interface': 'TypeScript interface definitions',
      'react-component': 'React functional component with props',
      'react-hook': 'React custom hook with TypeScript'
    };
    
    return descriptions[type] || 'Custom template';
  }
}

module.exports = TemplateManager;