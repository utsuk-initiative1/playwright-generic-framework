// Dashboard JavaScript functionality
// Handles test result processing, data visualization, and real-time updates

class TestDashboard {
    constructor() {
        this.testData = null;
        this.currentFilter = 'all';
        this.refreshInterval = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTestResults();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e.target.classList.contains('refresh-btn')) return;
                
                this.setActiveFilter(e.target.dataset.filter);
            });
        });

        // Refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadTestResults());
        }
    }

    setActiveFilter(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.currentFilter = filter;
        this.renderTests();
    }

    async loadTestResults() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            // In real implementation, this would fetch from API or file
            await this.fetchTestResults();
            this.updateStats();
            this.renderTests();
        } catch (error) {
            this.showError('Failed to load test results: ' + error.message);
        } finally {
            this.isLoading = false;
        }
    }

    async fetchTestResults() {
        // Simulate API call - replace with actual implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                this.testData = {
                    total: 12,
                    passed: 8,
                    failed: 2,
                    skipped: 2,
                    lastUpdated: new Date().toISOString(),
                    tests: [
                        { name: "Homepage Navigation", status: "passed", duration: "1.2s", timestamp: new Date().toISOString() },
                        { name: "User Login", status: "passed", duration: "2.1s", timestamp: new Date().toISOString() },
                        { name: "Product Search", status: "passed", duration: "1.8s", timestamp: new Date().toISOString() },
                        { name: "Add to Cart", status: "passed", duration: "1.5s", timestamp: new Date().toISOString() },
                        { name: "Checkout Process", status: "failed", duration: "3.2s", timestamp: new Date().toISOString() },
                        { name: "Payment Gateway", status: "passed", duration: "2.8s", timestamp: new Date().toISOString() },
                        { name: "Order Confirmation", status: "passed", duration: "1.1s", timestamp: new Date().toISOString() },
                        { name: "User Profile", status: "passed", duration: "1.9s", timestamp: new Date().toISOString() },
                        { name: "Password Reset", status: "skipped", duration: "0.0s", timestamp: new Date().toISOString() },
                        { name: "Email Verification", status: "passed", duration: "1.4s", timestamp: new Date().toISOString() },
                        { name: "API Endpoints", status: "failed", duration: "2.3s", timestamp: new Date().toISOString() },
                        { name: "Mobile Responsive", status: "skipped", duration: "0.0s", timestamp: new Date().toISOString() }
                    ]
                };
                resolve();
            }, 1000);
        });
    }

    updateStats() {
        if (!this.testData) return;

        document.getElementById('totalTests').textContent = this.testData.total;
        document.getElementById('passedTests').textContent = this.testData.passed;
        document.getElementById('failedTests').textContent = this.testData.failed;
        document.getElementById('skippedTests').textContent = this.testData.skipped;

        // Update last updated time
        const lastUpdated = document.getElementById('lastUpdated');
        if (lastUpdated) {
            lastUpdated.textContent = new Date(this.testData.lastUpdated).toLocaleString();
        }
    }

    renderTests() {
        if (!this.testData) return;

        const testList = document.getElementById('testList');
        const filteredTests = this.currentFilter === 'all' 
            ? this.testData.tests 
            : this.testData.tests.filter(test => test.status === this.currentFilter);

        if (filteredTests.length === 0) {
            testList.innerHTML = '<div class="loading">No tests found for the selected filter.</div>';
            return;
        }

        testList.innerHTML = filteredTests.map(test => this.createTestItem(test)).join('');
    }

    createTestItem(test) {
        const statusIcon = this.getStatusIcon(test.status);
        const statusClass = test.status;
        const timestamp = new Date(test.timestamp).toLocaleTimeString();

        return `
            <div class="test-item ${statusClass}" data-test="${test.name}">
                <div class="test-header">
                    <div class="test-name">${statusIcon} ${test.name}</div>
                    <div class="test-status">${test.status.toUpperCase()}</div>
                </div>
                <div class="test-details">
                    <div class="test-duration">Duration: ${test.duration}</div>
                    <div class="test-timestamp">Time: ${timestamp}</div>
                </div>
                ${test.status === 'failed' ? '<div class="test-error">Click to view error details</div>' : ''}
            </div>
        `;
    }

    getStatusIcon(status) {
        const icons = {
            passed: '✅',
            failed: '❌',
            skipped: '⏭️'
        };
        return icons[status] || '❓';
    }

    showLoading() {
        const testList = document.getElementById('testList');
        testList.innerHTML = '<div class="loading">Loading test results...</div>';
    }

    showError(message) {
        const testList = document.getElementById('testList');
        testList.innerHTML = `<div class="error">${message}</div>`;
    }

    startAutoRefresh() {
        // Auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadTestResults();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Export functionality
    exportResults(format = 'json') {
        if (!this.testData) return;

        let data, filename, mimeType;

        switch (format) {
            case 'json':
                data = JSON.stringify(this.testData, null, 2);
                filename = `test-results-${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                data = this.convertToCSV();
                filename = `test-results-${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv';
                break;
            default:
                console.error('Unsupported format:', format);
                return;
        }

        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    convertToCSV() {
        if (!this.testData) return '';

        const headers = ['Name', 'Status', 'Duration', 'Timestamp'];
        const rows = this.testData.tests.map(test => [
            test.name,
            test.status,
            test.duration,
            new Date(test.timestamp).toLocaleString()
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    // Performance metrics
    getPerformanceMetrics() {
        if (!this.testData) return null;

        const durations = this.testData.tests
            .filter(test => test.duration !== '0.0s')
            .map(test => parseFloat(test.duration.replace('s', '')));

        if (durations.length === 0) return null;

        return {
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            total: durations.reduce((a, b) => a + b, 0)
        };
    }

    // Cleanup
    destroy() {
        this.stopAutoRefresh();
        // Remove event listeners if needed
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.testDashboard = new TestDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestDashboard;
}