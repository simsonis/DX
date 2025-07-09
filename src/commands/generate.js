const chalk = require('chalk');
const fs = require('fs-extra');

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
      case 'ts-component':
        await generateTsComponent(name);
        break;
      case 'ts-utility':
        await generateTsUtility(name);
        break;
      case 'ts-interface':
        await generateTsInterface(name);
        break;
      case 'react-component':
        await generateReactComponent(name);
        break;
      case 'react-hook':
        await generateReactHook(name);
        break;
      default:
        console.log(chalk.red(`❌ Unknown template type: ${type}`));
        console.log(
          chalk.yellow('Available types: component, utility, config, ts-component, ts-utility, ts-interface, react-component, react-hook')
        );
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

async function generateTsComponent(name) {
  const componentTemplate = `export interface ${name}Options {
  debug?: boolean;
  theme?: string;
  // Add your options here
}

export class ${name} {
  private options: ${name}Options;

  constructor(options: ${name}Options = {}) {
    this.options = options;
    this.init();
  }

  private init(): void {
    console.log('${name} initialized');
  }

  public render(): void {
    // Implementation here
  }

  public destroy(): void {
    // Cleanup logic
  }
}

export default ${name};
`;

  const testTemplate = `import ${name} from '../src/components/${name}';

describe('${name}', () => {
  test('should initialize correctly', () => {
    const component = new ${name}();
    expect(component).toBeDefined();
  });

  test('should accept options', () => {
    const options = { debug: true, theme: 'dark' };
    const component = new ${name}(options);
    expect(component).toBeDefined();
  });
});
`;

  await fs.writeFile(`src/components/${name}.ts`, componentTemplate);
  await fs.writeFile(`tests/${name}.test.ts`, testTemplate);

  console.log(chalk.green(`✓ TypeScript Component ${name} created`));
  console.log(chalk.green(`✓ TypeScript Test file created`));
}

async function generateTsUtility(name) {
  const utilityTemplate = `/**
 * ${name} utility function
 * @param input - Input parameter
 * @returns Processed output
 */
export function ${name.toLowerCase()}<T>(input: T): T {
  // Implementation here
  return input;
}

/**
 * ${name} async utility function
 * @param input - Input parameter
 * @returns Promise with processed output
 */
export async function ${name.toLowerCase()}Async<T>(input: T): Promise<T> {
  // Implementation here
  return Promise.resolve(input);
}

export default { ${name.toLowerCase()}, ${name.toLowerCase()}Async };
`;

  await fs.writeFile(`src/utils/${name.toLowerCase()}.ts`, utilityTemplate);
  console.log(chalk.green(`✓ TypeScript Utility ${name} created`));
}

async function generateTsInterface(name) {
  const interfaceTemplate = `export interface ${name} {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add your properties here
}

export interface ${name}CreateInput {
  name: string;
  // Add your input properties here
}

export interface ${name}UpdateInput {
  id: string;
  name?: string;
  // Add your update properties here
}

export type ${name}Status = 'active' | 'inactive' | 'pending';

export interface ${name}Service {
  create(input: ${name}CreateInput): Promise<${name}>;
  update(input: ${name}UpdateInput): Promise<${name}>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<${name} | null>;
  findAll(): Promise<${name}[]>;
}

export default ${name};
`;

  await fs.writeFile(`src/types/${name}.ts`, interfaceTemplate);
  console.log(chalk.green(`✓ TypeScript Interface ${name} created`));
}

async function generateReactComponent(name) {
  const componentTemplate = `import React from 'react';
import './styles/${name}.css';

export interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
  // Add your props here
}

const ${name}: React.FC<${name}Props> = ({ 
  className = '', 
  children,
  ...props 
}) => {
  return (
    <div className={\`${name.toLowerCase()} \${className}\`} {...props}>
      {children}
      <p>Welcome to ${name} component!</p>
    </div>
  );
};

export default ${name};
`;

  const styleTemplate = `.${name.toLowerCase()} {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.${name.toLowerCase()}:hover {
  background-color: #eeeeee;
}

.${name.toLowerCase()} p {
  margin: 0;
  color: #333;
  font-size: 1rem;
}
`;

  const testTemplate = `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${name} from '../src/components/${name}';

describe('${name}', () => {
  test('renders component correctly', () => {
    render(<${name} />);
    expect(screen.getByText('Welcome to ${name} component!')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<${name} className="custom-class" />);
    expect(container.firstChild).toHaveClass('${name.toLowerCase()}', 'custom-class');
  });

  test('renders children', () => {
    render(<${name}>Test content</${name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
`;

  await fs.ensureDir('src/components/styles');
  await fs.writeFile(`src/components/${name}.tsx`, componentTemplate);
  await fs.writeFile(`src/components/styles/${name}.css`, styleTemplate);
  await fs.writeFile(`tests/${name}.test.tsx`, testTemplate);

  console.log(chalk.green(`✓ React Component ${name} created`));
  console.log(chalk.green(`✓ CSS styles created`));
  console.log(chalk.green(`✓ React Test file created`));
}

async function generateReactHook(name) {
  const hookTemplate = `import { useState, useEffect, useCallback } from 'react';

export interface ${name}Options {
  initialValue?: any;
  autoUpdate?: boolean;
  // Add your options here
}

export interface ${name}Return {
  value: any;
  setValue: (value: any) => void;
  reset: () => void;
  isLoading: boolean;
  error: string | null;
  // Add your return properties here
}

export const use${name} = (options: ${name}Options = {}): ${name}Return => {
  const { initialValue = null, autoUpdate = false } = options;
  
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  useEffect(() => {
    if (autoUpdate) {
      // Auto-update logic here
      console.log('${name} hook auto-updating...');
    }
  }, [autoUpdate]);

  return {
    value,
    setValue,
    reset,
    isLoading,
    error,
  };
};

export default use${name};
`;

  const testTemplate = `import { renderHook, act } from '@testing-library/react';
import { use${name} } from '../src/hooks/use${name}';

describe('use${name}', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => use${name}());
    
    expect(result.current.value).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('should initialize with custom initial value', () => {
    const initialValue = 'test';
    const { result } = renderHook(() => use${name}({ initialValue }));
    
    expect(result.current.value).toBe(initialValue);
  });

  test('should update value', () => {
    const { result } = renderHook(() => use${name}());
    
    act(() => {
      result.current.setValue('new value');
    });
    
    expect(result.current.value).toBe('new value');
  });

  test('should reset to initial value', () => {
    const initialValue = 'initial';
    const { result } = renderHook(() => use${name}({ initialValue }));
    
    act(() => {
      result.current.setValue('changed');
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.value).toBe(initialValue);
  });
});
`;

  await fs.ensureDir('src/hooks');
  await fs.writeFile(`src/hooks/use${name}.ts`, hookTemplate);
  await fs.writeFile(`tests/use${name}.test.ts`, testTemplate);

  console.log(chalk.green(`✓ React Hook use${name} created`));
  console.log(chalk.green(`✓ Hook Test file created`));
}

module.exports = { generateTemplate };
