const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']); // Try bypassing local DNS

dns.resolveSrv('_mongodb._tcp.cluster1.pqyrk4s.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('Custom DNS SRV lookup failed:', err.message);
  } else {
    console.log('Custom DNS SRV Records found:', addresses);
  }
});
