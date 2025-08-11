#!/usr/bin/env node

const EnhancedCLI = require('./enhanced-cli.js');

async function main() {
  const cli = new EnhancedCLI();
  
  console.log('🎯 Enhanced Playwright Framework CLI');
  console.log('=====================================\n');
  
  try {
    await cli.execute();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the CLI
if (require.main === module) {
  main();
}

module.exports = main; 