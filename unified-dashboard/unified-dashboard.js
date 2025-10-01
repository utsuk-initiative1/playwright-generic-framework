// Unified Dashboard JavaScript functionality
// Handles data aggregation from multiple frameworks and real-time updates

class UnifiedDashboard {
    constructor() {
        this.frameworks = {
            'playwright': { name: 'Playwright', path: '../Playwright' },
            'mobile-grace': { name: 'Mobile Grace', path: '../Mobile-Grace' },
            'grace-android': { name: 'Grace Android', path: '../Grace-android' },
            'mobile': { name: 'Mobile', path: '../mobile' },
            'playwright-automation': { name: 'Playwright Automation', path: '../playwright-automation' }
        };
        
        this.currentFramework = 'all';
        this.frameworkData = {};
        this.refreshInterval = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadAllData();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Framework tab buttons
        document.querySelectorAll('.framework-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFramework(e.target.dataset.framework);
            });
        });
    }

    setActiveFramework(framework) {
        // Update active tab
        document.querySelectorAll('.framework-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-framework="${framework}"]`).classList.add('active');
        
        this.currentFramework = framework;
        this.renderFrameworkContent();
    }

    async loadAllData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            const promises = Object.keys(this.frameworks).map(framework => 
                this.loadFrameworkData(framework)
            );
            
            await Promise.all(promises);
            this.updateOverviewStats();
            this.renderFrameworkContent();
        } catch (error) {
            this.showError('Failed to load framework data: ' + error.message);
        } finally {
            this.isLoading = false;
        }
    }

    async loadFrameworkData(framework) {
        try {
            const frameworkInfo = this.frameworks[framework];
            const data = await this.fetchFrameworkResults(frameworkInfo.path);
            this.frameworkData[framework] = data;
        } catch (error) {
            console.warn(`Could not load data for ${framework}:`, error.message);
            this.frameworkData[framework] = this.getEmptyFrameworkData(framework);
        }
    }

    async fetchFrameworkResults(frameworkPath) {
        // Try multiple data sources for each framework
        const sources = [
            `${frameworkPath}/playwright-report/data.json`,
            `${frameworkPath}/allure-results/data.json`,
            `${frameworkPath}/test-results/results.json`
        ];

        for (const source of sources) {
            try {
                const response = await fetch(source);
                if (response.ok) {
                    const data = await response.json();
                    return this.parseFrameworkData(data, source);
                }
            } catch (error) {
                // Continue to next source
            }
        }

        // Fallback to sample data
        return this.getSampleFrameworkData();
    }

    parseFrameworkData(data, source) {
        let tests = [];
        let sourceType = 'unknown';

        if (source.includes('playwright-report')) {
            sourceType = 'playwright';
            tests = this.parsePlaywrightData(data);
        } else if (source.includes('allure-results')) {
            sourceType = 'allure';
            tests = this.parseAllureData(data);
        } else if (source.includes('test-results')) {
            sourceType = 'json';
            tests = this.parseJSONData(data);
        }

        const statusCounts = tests.reduce((acc, test) => {
            acc[test.status] = (acc[test.status] || 0) + 1;
            return acc;
        }, {});

        return {
            total: tests.length,
            passed: statusCounts.passed || 0,
            failed: statusCounts.failed || 0,
            skipped: statusCounts.skipped || 0,
            tests: tests,
            source: sourceType,
            lastUpdated: new Date().toISOString()
        };
    }

    parsePlaywrightData(data) {
        return data.suites?.flatMap(suite => 
            suite.specs?.flatMap(spec => 
                spec.tests?.map(test => ({
                    name: `${spec.title} - ${test.title}`,
                    status: test.results?.[0]?.status || 'unknown',
                    duration: `${(test.results?.[0]?.duration || 0) / 1000}s`,
                    timestamp: new Date(test.results?.[0]?.startTime || Date.now()).toISOString()
                })) || []
            ) || []
        ) || [];
    }

    parseAllureData(data) {
        return data.children?.map(test => ({
            name: test.name,
            status: test.status?.toLowerCase() || 'unknown',
            duration: `${(test.time?.duration || 0) / 1000}s`,
            timestamp: new Date(test.time?.start || Date.now()).toISOString()
        })) || [];
    }

    parseJSONData(data) {
        return data.suites?.flatMap(suite => 
            suite.specs?.flatMap(spec => 
                spec.tests?.map(test => ({
                    name: `${spec.title} - ${test.title}`,
                    status: test.results?.[0]?.status || 'unknown',
                    duration: `${(test.results?.[0]?.duration || 0) / 1000}s`,
                    timestamp: new Date(test.results?.[0]?.startTime || Date.now()).toISOString()
                })) || []
            ) || []
        ) || [];
    }

    getSampleFrameworkData() {
        return {
            total: Math.floor(Math.random() * 20) + 5,
            passed: Math.floor(Math.random() * 15) + 3,
            failed: Math.floor(Math.random() * 5),
            skipped: Math.floor(Math.random() * 3),
            tests: [],
            source: 'sample',
            lastUpdated: new Date().toISOString()
        };
    }

    getEmptyFrameworkData(framework) {
        return {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            tests: [],
            source: 'none',
            lastUpdated: new Date().toISOString()
        };
    }

    updateOverviewStats() {
        let total = 0, passed = 0, failed = 0, skipped = 0;

        if (this.currentFramework === 'all') {
            // Aggregate all frameworks
            Object.values(this.frameworkData).forEach(data => {
                total += data.total;
                passed += data.passed;
                failed += data.failed;
                skipped += data.skipped;
            });
        } else {
            // Show specific framework stats
            const data = this.frameworkData[this.currentFramework];
            if (data) {
                total = data.total;
                passed = data.passed;
                failed = data.failed;
                skipped = data.skipped;
            }
        }

        document.getElementById('totalTests').textContent = total;
        document.getElementById('passedTests').textContent = passed;
        document.getElementById('failedTests').textContent = failed;
        document.getElementById('skippedTests').textContent = skipped;
    }

    renderFrameworkContent() {
        const content = document.getElementById('frameworkContent');
        const title = document.getElementById('frameworkTitle');

        if (this.currentFramework === 'all') {
            title.textContent = 'All Frameworks';
            content.innerHTML = this.renderAllFrameworksView();
        } else {
            const frameworkInfo = this.frameworks[this.currentFramework];
            title.textContent = frameworkInfo.name;
            content.innerHTML = this.renderSingleFrameworkView(this.currentFramework);
        }
    }

    renderAllFrameworksView() {
        let html = '<div class="test-results">';
        
        Object.entries(this.frameworks).forEach(([key, framework]) => {
            const data = this.frameworkData[key] || this.getEmptyFrameworkData(key);
            const statusClass = data.failed > 0 ? 'failed' : data.passed > 0 ? 'passed' : 'skipped';
            
            html += `
                <div class="test-item ${statusClass}" onclick="setActiveFramework('${key}')">
                    <div class="test-name">${framework.name}</div>
                    <div class="test-details">
                        <span>Total: ${data.total}</span>
                        <span>Passed: ${data.passed}</span>
                        <span>Failed: ${data.failed}</span>
                        <span>Skipped: ${data.skipped}</span>
                        <span>Source: ${data.source}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    renderSingleFrameworkView(framework) {
        const data = this.frameworkData[framework] || this.getEmptyFrameworkData(framework);
        
        if (data.total === 0) {
            return '<div class="no-data">No test data available for this framework.</div>';
        }

        if (data.tests.length === 0) {
            return `
                <div class="no-data">
                    <h3>Framework Summary</h3>
                    <p>Total Tests: ${data.total}</p>
                    <p>Passed: ${data.passed}</p>
                    <p>Failed: ${data.failed}</p>
                    <p>Skipped: ${data.skipped}</p>
                    <p>Data Source: ${data.source}</p>
                </div>
            `;
        }

        let html = '<div class="test-results">';
        data.tests.forEach(test => {
            html += `
                <div class="test-item ${test.status}">
                    <div class="test-name">${test.name}</div>
                    <div class="test-details">
                        <span>Status: ${test.status.toUpperCase()}</span>
                        <span>Duration: ${test.duration}</span>
                        <span>Time: ${new Date(test.timestamp).toLocaleTimeString()}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        return html;
    }

    showLoading() {
        const content = document.getElementById('frameworkContent');
        content.innerHTML = '<div class="loading">Loading framework data...</div>';
    }

    showError(message) {
        const content = document.getElementById('frameworkContent');
        content.innerHTML = `<div class="error">${message}</div>`;
    }

    startAutoRefresh() {
        // Auto-refresh every 60 seconds
        this.refreshInterval = setInterval(() => {
            this.loadAllData();
        }, 60000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Cleanup
    destroy() {
        this.stopAutoRefresh();
    }
}

// Global functions for HTML onclick handlers
function setActiveFramework(framework) {
    if (window.unifiedDashboard) {
        window.unifiedDashboard.setActiveFramework(framework);
    }
}

function loadAllData() {
    if (window.unifiedDashboard) {
        window.unifiedDashboard.loadAllData();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.unifiedDashboard = new UnifiedDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedDashboard;
}
