/**
 * Utility script for testing connectivity with Strapi API
 */

import { testApiEndpoints, testCORS } from './debug.js';

// Run the test
(async () => {
  console.log('Starting API connectivity test...');
  await testApiEndpoints();
  console.log('Starting CORS test...');
  await testCORS();
  console.log('API test complete!');
})(); 