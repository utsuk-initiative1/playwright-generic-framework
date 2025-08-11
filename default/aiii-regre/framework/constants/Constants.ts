export const Timeouts = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  VERY_LONG: 60000
};

export const Selectors = {
  COMMON: {
    LOADING: '[data-testid="loading"]',
    ERROR: '[data-testid="error"]',
    SUCCESS: '[data-testid="success"]'
  }
};

export const Messages = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  LOADING: 'Please wait...'
};