export const environment = {
  production: false,
  api: {
    baseUrl: 'https://staging-api.psychologyerp.com/api',
    timeout: 30000,
    version: 'v1'
  },
  app: {
    name: 'PsycoERP (Staging)',
    version: '1.0.0'
  },
  features: {
    enableLogging: true,
    enableMockData: false
  }
};