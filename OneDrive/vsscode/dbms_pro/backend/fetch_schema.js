require('dotenv').config();

const http = require('https');

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const options = {
  hostname: 'wdrolrtyceaohpjinnyt.supabase.co',
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': SUPABASE_ANON_KEY
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    require('fs').writeFileSync('schema.json', data);
    console.log('Schema saved to schema.json');
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
