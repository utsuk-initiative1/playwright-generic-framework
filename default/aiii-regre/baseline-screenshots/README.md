# Baseline Screenshots Directory

This directory contains baseline screenshots for visual regression testing. These images serve as the "golden standard" for comparing against new screenshots during test execution.

## 📁 Structure

```
baseline-screenshots/
├── desktop/
│   ├── chromium/
│   ├── firefox/
│   └── webkit/
├── mobile/
│   ├── pixel-5/
│   └── iphone-12/
├── tablet/
│   └── ipad-pro/
└── README.md
```

## 🎯 Purpose

Visual regression testing compares screenshots taken during test execution against these baseline images to detect visual changes in the application.

## 📸 How to Use

### 1. Generate Baseline Screenshots

```bash
# Generate baselines for all browsers
npx playwright test --update-snapshots

# Generate baselines for specific browser
npx playwright test --project=chromium --update-snapshots

# Generate baselines for mobile
npx playwright test --project=mobile-chrome --update-snapshots
```

### 2. Run Visual Tests

```bash
# Run visual regression tests
npm run test:visual

# Run with specific baseline
npx playwright test --config=framework.config.ts --project=chromium
```

### 3. Update Baselines

```bash
# Update all baselines
npm run update-baselines

# Update specific baseline
npx playwright test --update-snapshots --project=chromium
```

## 🔧 Configuration

### Visual Test Configuration

In your test files, use the visual testing utilities:

```typescript
import { test, expect } from '../core/TestBase';

test('visual regression test', async ({ page, basePage }) => {
  await basePage.navigateTo('/my-page');
  
  // Take screenshot for comparison
  await expect(page).toHaveScreenshot('my-page.png');
  
  // Compare specific element
  await expect(page.locator('.header')).toHaveScreenshot('header.png');
});
```

### Screenshot Options

```typescript
// Full page screenshot
await expect(page).toHaveScreenshot('full-page.png', {
  fullPage: true,
  animations: 'disabled'
});

// Element screenshot
await expect(page.locator('.component')).toHaveScreenshot('component.png', {
  threshold: 0.1, // 10% tolerance
  maxDiffPixels: 100
});
```

## 📊 Best Practices

### 1. Baseline Management
- **Version Control**: Always commit baseline screenshots to version control
- **Naming Convention**: Use descriptive names (e.g., `homepage-desktop.png`)
- **Organization**: Group by browser/device type
- **Cleanup**: Remove outdated baselines regularly

### 2. Visual Testing Strategy
- **Critical Paths**: Focus on key user journeys
- **Responsive Design**: Test across different screen sizes
- **Component Testing**: Test individual components in isolation
- **Cross-browser**: Ensure consistency across browsers

### 3. Threshold Configuration
```typescript
// In framework.config.ts
expect: {
  toHaveScreenshot: {
    threshold: 0.1, // 10% tolerance
    maxDiffPixels: 100
  }
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Baseline Not Found:**
   ```bash
   # Regenerate baselines
   npm run update-baselines
   ```

2. **False Positives:**
   - Adjust threshold values
   - Exclude dynamic content areas
   - Use element-specific screenshots

3. **Cross-platform Differences:**
   - Use consistent environments
   - Consider platform-specific baselines
   - Use Docker for consistent rendering

### Debug Visual Differences

```bash
# Show visual differences
npx playwright show-report

# Compare specific screenshots
npx playwright test --reporter=html
```

## 📈 Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Visual Regression Tests
  run: |
    npm run test:visual
    npm run update-baselines
  env:
    PLAYWRIGHT_UPDATE_SNAPSHOTS: 1
```

### Jenkins Pipeline
```groovy
stage('Visual Testing') {
    steps {
        sh 'npm run test:visual'
        sh 'npm run update-baselines'
    }
}
```

## 🔗 Related Files

- [Visual Test Configuration](../framework/visual/)
- [Framework Configuration](../framework.config.ts)
- [Test Base](../framework/core/TestBase.ts)
- [Package.json Scripts](../package.json)

## 📝 Notes

- Baseline screenshots should be committed to version control
- Update baselines when intentional UI changes are made
- Use descriptive names for better organization
- Consider using different baselines for different environments