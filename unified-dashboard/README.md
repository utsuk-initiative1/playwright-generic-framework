# 🎭 Unified Test Dashboard

A comprehensive dashboard for monitoring test results across all automation frameworks in your project.

## 🚀 Features

### 📊 Multi-Framework Support
- **Playwright** - Web automation testing
- **Mobile Grace** - Mobile testing framework
- **Grace Android** - Android-specific testing
- **Mobile** - General mobile testing
- **Playwright Automation** - Additional Playwright projects

### 📈 Real-time Monitoring
- Live test result updates across all frameworks
- Auto-refresh every 60 seconds
- Real-time statistics and metrics aggregation
- Framework-specific and overall statistics

### 🎨 Modern UI
- Responsive design for all devices
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Glassmorphism design elements
- Framework-specific color coding

### 🔧 Interactive Features
- Switch between individual frameworks or view all
- Click on framework cards to drill down
- Manual refresh capability
- Error handling and fallback data
- Multiple data source support (Playwright, Allure, JSON)

## 📁 File Structure

```
unified-dashboard/
├── index.html              # Main dashboard interface
├── unified-dashboard.js    # Dashboard functionality
└── README.md              # This documentation
```

## 🛠️ Usage

### 1. Open Dashboard
```bash
# Navigate to unified dashboard directory
cd unified-dashboard

# Open in browser
open index.html
# or
start index.html
# or
xdg-open index.html
```

### 2. Via Enhanced CLI
```bash
# From any framework directory
node enhanced-cli.js

# Select option 3: Generate test reports
# Then select option 6: Open Unified Dashboard
```

### 3. View Test Results
- **All Frameworks**: Overview of all frameworks with aggregated statistics
- **Individual Frameworks**: Click on any framework tab to view detailed results
- **Real-time Updates**: Dashboard automatically refreshes every 60 seconds

## 🔧 Data Sources

The dashboard automatically detects and uses the best available data source for each framework:

1. **Playwright Results** (`playwright-report/data.json`)
2. **Allure Results** (`allure-results/data.json`)
3. **JSON Results** (`test-results/results.json`)
4. **Sample Data** (fallback when no real data is available)

## 📊 Statistics Displayed

### Overview Statistics
- **Total Tests**: Sum of all tests across frameworks
- **Passed**: Number of successful tests
- **Failed**: Number of failed tests
- **Skipped**: Number of skipped tests

### Framework-Specific Statistics
- Individual test results with status icons
- Test duration and timestamps
- Data source information
- Error details for failed tests

## 🎯 Framework Integration

### Supported Frameworks
- ✅ **Playwright** - Full support with HTML, JSON, and Allure reports
- ✅ **Mobile Grace** - Full support with multiple data sources
- ✅ **Grace Android** - Full support with Android-specific testing
- ✅ **Mobile** - Full support with mobile testing results
- ✅ **Playwright Automation** - Full support with additional Playwright projects

### Data Source Priority
1. Playwright HTML reports (most detailed)
2. Allure reports (comprehensive)
3. JSON reports (structured data)
4. Sample data (fallback)

## 🔄 Auto-Refresh

The dashboard automatically refreshes every 60 seconds to show the latest test results. You can also manually refresh by clicking the "🔄 Refresh All" button.

## 🎨 Customization

### Adding New Frameworks
To add support for a new framework, update the `frameworks` object in `unified-dashboard.js`:

```javascript
this.frameworks = {
    'new-framework': { name: 'New Framework', path: '../new-framework' },
    // ... existing frameworks
};
```

### Modifying Data Sources
Update the `sources` array in the `fetchFrameworkResults` method:

```javascript
const sources = [
    `${frameworkPath}/custom-report/data.json`,
    // ... existing sources
];
```

### Styling
The dashboard uses CSS custom properties for easy theming. Modify the CSS variables in `index.html` to change colors and styling.

## 🚀 Integration with Enhanced CLI

The unified dashboard is fully integrated with the Enhanced Playwright CLI:

1. **Automatic Creation**: Dashboard is created when using the CLI
2. **Easy Access**: Available through the reporting menu
3. **Framework Detection**: Automatically detects all available frameworks
4. **Data Aggregation**: Combines results from multiple frameworks

## 📱 Mobile Support

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🔧 Troubleshooting

### Common Issues

#### No Data Showing
- Ensure test results exist in the expected directories
- Check that the framework paths are correct
- Verify that the data files are in JSON format

#### Framework Not Detected
- Check that the framework directory exists
- Verify the framework name in the `frameworks` object
- Ensure the framework has run tests and generated results

#### Styling Issues
- Clear browser cache
- Check for JavaScript errors in browser console
- Verify that all CSS and JS files are loaded

## 🤝 Contributing

To contribute to the unified dashboard:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with multiple frameworks
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🆘 Support

- **GitHub Issues**: [Report Issues](https://github.com/utsuk-initiative1/playwright-generic-framework/issues)
- **Documentation**: Check the main framework documentation
- **Team Support**: Contact your team lead

---

**Made with ❤️ by Utsuk Initiative**

**Repository**: https://github.com/utsuk-initiative1/playwright-generic-framework
