const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

async function generateTemplate(type, options) {
  console.log(chalk.blue(`📝 Generating ${type} template...`));

  const name = options.name || 'MyComponent';

  try {
    switch (type) {
      case 'component':
        await generateComponent(name);
        break;
      case 'utility':
        await generateUtility(name);
        break;
      case 'config':
        await generateConfig(name);
        break;
      default:
        console.log(chalk.red(`❌ Unknown template type: ${type}`));
        console.log(chalk.yellow('Available types: component, utility, config'));
        return;
    }

    console.log(chalk.green(`✅ ${type} template generated successfully!`));
  } catch (error) {
    console.error(chalk.red(`❌ Generation failed: ${error.message}`));
  }
}

async function generateComponent(name) {
  const componentTemplate = `class ${name} {
  constructor(options = {}) {
    this.options = options;
    this.init();
  }

  init() {
    console.log('${name} initialized');
  }

  render() {
    // Implementation here
  }

  destroy() {
    // Cleanup logic
  }
}

module.exports = ${name};
`;

  const testTemplate = `const ${name} = require('../src/components/${name}');

describe('${name}', () => {
  test('should initialize correctly', () => {
    const component = new ${name}();
    expect(component).toBeDefined();
  });

  test('should have default options', () => {
    const component = new ${name}();
    expect(component.options).toEqual({});
  });
});
`;

  await fs.writeFile(`src/components/${name}.js`, componentTemplate);
  await fs.writeFile(`tests/${name}.test.js`, testTemplate);
  
  console.log(chalk.green(`✓ Component ${name} created`));
  console.log(chalk.green(`✓ Test file created`));
}

async function generateUtility(name) {
  const utilityTemplate = `/**
 * ${name} utility function
 * @param {*} input - Input parameter
 * @returns {*} - Processed output
 */
function ${name.toLowerCase()}(input) {
  // Implementation here
  return input;
}

module.exports = { ${name.toLowerCase()} };
`;

  await fs.writeFile(`src/utils/${name.toLowerCase()}.js`, utilityTemplate);
  console.log(chalk.green(`✓ Utility ${name} created`));
}

async function generateConfig(name) {
  const configTemplate = `const ${name.toLowerCase()}Config = {
  // Configuration options
  enabled: true,
  debug: false,
  
  // Add your configuration here
};

module.exports = ${name.toLowerCase()}Config;
`;

  await fs.writeFile(`src/config/${name.toLowerCase()}.js`, configTemplate);
  console.log(chalk.green(`✓ Config ${name} created`));
}

module.exports = { generateTemplate };