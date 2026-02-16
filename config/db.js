const https = require('https');
const mongoose = require('mongoose');

const options = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

/**
 * Resolve MongoDB Atlas SRV via Google DNS-over-HTTPS (bypasses system DNS timeout).
 * Returns standard URI: mongodb://user:pass@host1:27017,host2:27017,.../db?params
 */
function resolveSrvViaDoH(mongoSrvUri) {
  const atIdx = mongoSrvUri.lastIndexOf('@');
  if (atIdx === -1) return Promise.reject(new Error('Invalid mongodb+srv URI'));
  const authPart = mongoSrvUri.slice(0, atIdx).replace(/^mongodb\+srv:\/\//, '');
  const rest = mongoSrvUri.slice(atIdx + 1);
  const slashIdx = rest.indexOf('/');
  const qIdx = rest.indexOf('?');
  const srvHost = slashIdx === -1 ? (qIdx === -1 ? rest : rest.slice(0, qIdx)) : rest.slice(0, slashIdx);
  const pathPart =
      slashIdx === -1 ? '' : rest.slice(slashIdx + 1, qIdx === -1 ? undefined : qIdx);
  const query = qIdx === -1 ? '' : rest.slice(qIdx + 1);
  const db = pathPart || 'test';
  const srvName = `_mongodb._tcp.${srvHost}`.replace(/\.$/, '');

  return new Promise((resolve, reject) => {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(srvName)}&type=33`;
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.Status !== 0 || !json.Answer || !json.Answer.length) {
            return reject(new Error('SRV lookup returned no results'));
          }
          const hosts = json.Answer.map((a) => {
            const parts = String(a.data).trim().split(/\s+/);
            const port = parts.length >= 3 ? parts[2] : '27017';
            const host = (parts.length >= 4 ? parts[3] : '').replace(/\.$/, '');
            return host ? `${host}:${port}` : null;
          }).filter(Boolean);
          if (!hosts.length) return reject(new Error('No SRV hosts parsed'));
          const params = new URLSearchParams(query);
          params.set('ssl', 'true');
          if (!params.has('authSource')) params.set('authSource', 'admin');
          const standardUri = `mongodb://${authPart}@${hosts.join(',')}/${db}?${params.toString()}`;
          resolve(standardUri);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.setTimeout(10000, function () {
      this.destroy();
      reject(new Error('DoH request timeout'));
    });
    req.on('error', reject);
  });
}

function connectDB() {
  let uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    'mongodb://localhost:27017/thinknest';

  uri = uri.trim();

  function tryConnect(connectionUri) {
    return mongoose.connect(connectionUri, options).then((conn) => {
      console.log('MongoDB Connected:', conn.connection.host);
      console.log('Database:', conn.connection.name);
      return conn;
    });
  }

  const isSrv = uri.startsWith('mongodb+srv://');

  if (isSrv) {
    // Resolve SRV via DNS-over-HTTPS first (avoids system DNS timeout), then connect
    console.warn('Resolving MongoDB Atlas via DNS-over-HTTPS (avoids SRV timeout)...');
    return resolveSrvViaDoH(uri)
      .then((standardUri) => tryConnect(standardUri))
      .catch((dohErr) => {
        console.warn('DoH failed, trying system DNS (may timeout)...', dohErr.message);
        return tryConnect(uri).catch((err) => {
          console.error('MongoDB connection error:', err.message);
          console.error('');
          console.error('Use the standard connection string from Atlas:');
          console.error('  Atlas → Connect → Connect your application → Standard connection string');
          console.error('  Set it as MONGO_URI in .env (replace mongodb+srv with that string)');
          throw err;
        });
      });
  }

  return tryConnect(uri).catch((err) => {
    console.error('MongoDB connection error:', err.message);
    throw err;
  });
}

module.exports = connectDB;
