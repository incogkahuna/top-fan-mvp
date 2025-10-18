// Test script to check API endpoints
const https = require('https');

function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test environment endpoint
    console.log('1. Testing environment endpoint...');
    const envResult = await testEndpoint('https://earlytwentiesstorture.vercel.app/api/test/env');
    console.log('Status:', envResult.status);
    console.log('Response:', JSON.stringify(envResult.data, null, 2));
    console.log('\n');
    
    // Test user creation endpoint
    console.log('2. Testing user creation endpoint...');
    const userResult = await testEndpoint('https://earlytwentiesstorture.vercel.app/api/test/user-creation');
    console.log('Status:', userResult.status);
    console.log('Response:', JSON.stringify(userResult.data, null, 2));
    console.log('\n');
    
    // Test database schema endpoint
    console.log('3. Testing database schema endpoint...');
    const schemaResult = await testEndpoint('https://earlytwentiesstorture.vercel.app/api/test/database-schema');
    console.log('Status:', schemaResult.status);
    console.log('Response:', JSON.stringify(schemaResult.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

runTests();

