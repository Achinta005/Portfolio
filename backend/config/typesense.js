import { Client } from 'typesense';

const typesenseClient = new Client({
  'nodes': [{
    'host': process.env.TYPESENSE_HOST,
    'port': process.env.TYPESENSE_PORT,
    'protocol': process.env.TYPESENSE_PROTOCOL
  }],
  'apiKey': process.env.TYPESENSE_API_KEY,
  'connectionTimeoutSeconds': 10,
  'numRetries': 3,
  'retryIntervalSeconds': 0.1
});

// Test connection on startup
async function testConnection() {
  try {
    const health = await typesenseClient.health.retrieve();
    console.log('Typesense Cloud connected successfully');
    return true;
  } catch (error) {
    console.error('Typesense Cloud connection failed:', error.message);
    return false;
  }
}

export default { typesenseClient, testConnection };
