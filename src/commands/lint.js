const chalk = require('chalk');
const { execSync } = require('child_process');

async function lintProject() {
  console.log(chalk.blue('🔍 Running code quality checks...'));

  try {
    // Run ESLint
    console.log(chalk.yellow('Running ESLint...'));
    execSync('npx eslint src/ --fix', { stdio: 'inherit' });
    console.log(chalk.green('✓ ESLint checks passed'));

    // Run Prettier
    console.log(chalk.yellow('Running Prettier...'));
    execSync('npx prettier --write src/', { stdio: 'inherit' });
    console.log(chalk.green('✓ Code formatting applied'));

    // Run tests
    console.log(chalk.yellow('Running tests...'));
    execSync('npm test', { stdio: 'inherit' });
    console.log(chalk.green('✓ All tests passed'));

    console.log(chalk.green.bold('\n🎉 All quality checks passed!'));
  } catch (error) {
    console.error(chalk.red(`❌ Quality checks failed: ${error.message}`));
    process.exit(1);
  }
}

module.exports = { lintProject };