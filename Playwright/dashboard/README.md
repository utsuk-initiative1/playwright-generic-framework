# 🎭 Playwright Test Dashboard

A modern, interactive dashboard for monitoring and analyzing Playwright test results in real-time.

## 🚀 Features

### 📊 Real-time Monitoring
- Live test result updates
- Auto-refresh every 30 seconds
- Real-time statistics and metrics

### 📈 Visual Analytics
- Test pass/fail/skip statistics
- Performance metrics and trends
- Interactive filtering and sorting

### 🎨 Modern UI
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Glassmorphism design elements

### 🔧 Interactive Features
- Filter tests by status (All, Passed, Failed, Skipped)
- Manual refresh capability
- Export functionality (JSON, CSV)
- Performance metrics calculation

## 📁 File Structure

```
dashboard/
├── index.html          # Main dashboard interface
├── dashboard.js        # Dashboard functionality
└── README.md          # This documentation
```

## 🛠️ Usage

### 1. Open Dashboard
```bash
# Navigate to dashboard directory
cd dashboard

# Open in browser
open index.html
# or
start index.html
# or
xdg-open index.html
```

### 2. View Test Results
- Dashboard automatically loads sample test data
- Real-time statistics are displayed in cards
- Test list shows individual test results with status icons

### 3. Filter Results
- Click filter buttons to view specific test statuses
- Use "All Tests" to see complete results
- Filter by: Passed, Failed, Skipped

### 4. Refresh Data
- Click "🔄 Refresh" button for manual updates
- Auto-refresh occurs every 30 seconds
- Loading indicators show during refresh

## 🔧 Configuration

### Customizing Data Source
Edit `dashboard.js` to connect to your actual test results:

```javascript
async fetchTestResults() {
    // Replace with actual API call or file reading
    const response = await fetch('/api/test-results');
    this.testData = await response.json();
}
```

### Modifying Refresh Interval
```javascript
// In dashboard.js
startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
        this.loadTestResults();
    }, 60000); // Change to 60 seconds
}
```

### Adding New Metrics
```javascript
// Add new stat card in index.html
<div class="stat-card">
    <div class="stat-number" id="newMetric">0</div>
    <div class="stat-label">New Metric</div>
</div>

// Update in dashboard.js
updateStats() {
    document.getElementById('newMetric').textContent = this.calculateNewMetric();
}
```

## 📊 Data Format

The dashboard expects test data in this format:

```json
{
  "total": 12,
  "passed": 8,
  "failed": 2,
  "skipped": 2,
  "lastUpdated": "2024-01-15T10:30:00Z",
  "tests": [
    {
      "name": "Test Name",
      "status": "passed|failed|skipped",
      "duration": "1.2s",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 🎨 Customization

### Styling
Modify CSS in `index.html` to customize appearance:

```css
/* Change color scheme */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #27ae60;
    --error-color: #e74c3c;
    --warning-color: #f39c12;
}
```

### Adding New Features
```javascript
// Add export functionality
exportResults(format) {
    // Implementation for exporting data
}

// Add performance metrics
getPerformanceMetrics() {
    // Calculate and return performance data
}
```

## 🔗 Integration

### With Playwright Framework
```bash
# Run tests and generate results
npm test

# Open dashboard to view results
open dashboard/index.html
```

### With CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Generate Dashboard
  run: |
    cp test-results/results.json dashboard/data/
    echo "Dashboard updated with latest results"
```

### With Web Server
```bash
# Serve dashboard with Python
python -m http.server 8000

# Serve with Node.js
npx serve dashboard

# Access at http://localhost:8000
```

## 🚨 Troubleshooting

### Common Issues

1. **Dashboard Not Loading**
   - Check browser console for errors
   - Ensure all files are in correct location
   - Verify JavaScript is enabled

2. **No Data Displayed**
   - Check data format matches expected structure
   - Verify fetchTestResults() function
   - Check network connectivity for API calls

3. **Styling Issues**
   - Clear browser cache
   - Check CSS syntax
   - Verify responsive design breakpoints

### Debug Mode
```javascript
// Enable debug logging
console.log('Dashboard data:', this.testData);
console.log('Current filter:', this.currentFilter);
```

## 📈 Future Enhancements

### Planned Features
- [ ] WebSocket integration for real-time updates
- [ ] Chart.js integration for visual graphs
- [ ] Test history and trends
- [ ] Screenshot comparison viewer
- [ ] Performance benchmarking
- [ ] Team collaboration features
- [ ] Email notifications
- [ ] Slack/Discord integration

### Contributing
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## 📝 Notes

- Dashboard is currently using sample data
- Replace with actual test result integration
- Consider security for production deployment
- Add authentication if needed
- Optimize for large datasets

## 🔗 Related Documentation

- [Framework Configuration](../framework.config.ts)
- [Test Base](../packages/core/TestBase.ts)
- [CI/CD Scripts](../ci-cd/)
- [Package.json Scripts](../package.json)