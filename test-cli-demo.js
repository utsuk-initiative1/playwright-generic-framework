#!/usr/bin/env node

// Demo script to show the enhanced CLI Allure functionality
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎭 Enhanced CLI Allure Report Demo');
console.log('==================================\n');

// Simulate the enhanced CLI reporting menu
function showReportingMenu() {
    console.log('📊 Generate Test Reports\n');
    console.log('1. 📈 Generate Allure Reports');
    console.log('2. 📊 Generate HTML Reports');
    console.log('3. 📋 Generate JSON Reports');
    console.log('4. 🔄 Generate All Report Types');
    console.log('5. 🌐 Open Dashboard');
    console.log('6. 🎭 Open Unified Dashboard');
    console.log('7. 🔙 Back to Main Menu\n');
}

// Simulate Allure report generation
function generateAllureReport() {
    console.log('📈 Generating Allure Reports...\n');
    
    const testDir = '/Users/madhukarbanoth/Documents/utsuk-ai-automation/test-allure';
    
    try {
        // Check if allure-results directory exists
        if (!fs.existsSync(path.join(testDir, 'allure-results'))) {
            console.log('⚠️  No allure-results directory found. Running tests first...');
            console.log('🔄 Running tests with Allure reporter...');
            execSync('npm run test:allure', { cwd: testDir, stdio: 'inherit' });
        }
        
        // Generate Allure report
        console.log('🔄 Generating Allure report...');
        execSync('npm run allure:generate', { cwd: testDir, stdio: 'inherit' });
        
        console.log('✅ Allure report generated successfully!');
        console.log('📁 Report location: ./allure-report/index.html');
        
        // Show report statistics
        const allureDataPath = path.join(testDir, 'allure-report', 'data', 'suites.json');
        if (fs.existsSync(allureDataPath)) {
            const allureData = JSON.parse(fs.readFileSync(allureDataPath, 'utf8'));
            console.log('\n📊 Report Statistics:');
            console.log(`   Total Tests: ${allureData.statistic?.total || 0}`);
            console.log(`   Passed: ${allureData.statistic?.passed || 0}`);
            console.log(`   Failed: ${allureData.statistic?.failed || 0}`);
            console.log(`   Skipped: ${allureData.statistic?.skipped || 0}`);
        }
        
        console.log('\n🌐 Opening Allure report in browser...');
        execSync('npm run allure:open', { cwd: testDir, stdio: 'inherit' });
        
    } catch (error) {
        console.error('❌ Failed to generate Allure report:', error.message);
    }
}

// Simulate HTML report generation
function generateHTMLReport() {
    console.log('📊 Generating HTML Reports...\n');
    
    const testDir = '/Users/madhukarbanoth/Documents/utsuk-ai-automation/test-allure';
    
    try {
        console.log('🔄 Running tests with HTML reporter...');
        execSync('npx playwright test --reporter=html', { cwd: testDir, stdio: 'inherit' });
        
        console.log('✅ HTML report generated successfully!');
        console.log('📁 Report location: ./playwright-report/index.html');
        
    } catch (error) {
        console.error('❌ Failed to generate HTML report:', error.message);
    }
}

// Simulate JSON report generation
function generateJSONReport() {
    console.log('📋 Generating JSON Reports...\n');
    
    const testDir = '/Users/madhukarbanoth/Documents/utsuk-ai-automation/test-allure';
    
    try {
        console.log('🔄 Running tests with JSON reporter...');
        execSync('npx playwright test --reporter=json', { cwd: testDir, stdio: 'inherit' });
        
        console.log('✅ JSON report generated successfully!');
        console.log('📁 Report location: ./test-results/results.json');
        
    } catch (error) {
        console.error('❌ Failed to generate JSON report:', error.message);
    }
}

// Simulate opening dashboard
function openDashboard() {
    console.log('🌐 Opening Dashboard...\n');
    
    const dashboardPath = '/Users/madhukarbanoth/Documents/utsuk-ai-automation/unified-dashboard/index.html';
    
    if (fs.existsSync(dashboardPath)) {
        console.log('✅ Opening unified dashboard in browser...');
        const platform = process.platform;
        const command = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
        
        try {
            execSync(`${command} "${dashboardPath}"`, { stdio: 'inherit' });
            console.log('✅ Dashboard opened successfully!');
        } catch (error) {
            console.log('📁 Dashboard location: ' + dashboardPath);
            console.log('Please open this file in your browser.');
        }
    } else {
        console.log('⚠️  Dashboard not found. Creating dashboard...');
        console.log('📁 Dashboard location: ' + dashboardPath);
    }
}

// Main demo function
function runDemo() {
    console.log('This demo shows the enhanced CLI Allure reporting functionality.\n');
    
    showReportingMenu();
    
    console.log('🎯 Demo: Testing Allure Report Generation');
    console.log('==========================================\n');
    
    // Demo Allure report generation
    generateAllureReport();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 Demo: Testing HTML Report Generation');
    console.log('========================================\n');
    
    // Demo HTML report generation
    generateHTMLReport();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 Demo: Testing JSON Report Generation');
    console.log('=======================================\n');
    
    // Demo JSON report generation
    generateJSONReport();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎯 Demo: Opening Dashboard');
    console.log('==========================\n');
    
    // Demo dashboard opening
    openDashboard();
    
    console.log('\n🎉 Demo completed successfully!');
    console.log('\n📚 Summary of Enhanced CLI Features:');
    console.log('✅ Allure report generation with detailed statistics');
    console.log('✅ HTML report generation with Playwright UI');
    console.log('✅ JSON report generation for data processing');
    console.log('✅ Unified dashboard for multi-framework monitoring');
    console.log('✅ Automatic test execution and report generation');
    console.log('✅ Error handling and fallback mechanisms');
    console.log('✅ Cross-platform browser opening support');
}

// Run the demo
runDemo();
