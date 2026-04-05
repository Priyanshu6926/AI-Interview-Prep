const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.cluster1.pqyrk4s.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV lookup failed:', err.message);
  } else {
    console.log('SRV Records found:', addresses);
  }
});
