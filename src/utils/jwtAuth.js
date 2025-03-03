const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const jose = require('node-jose');
const fs = require('node:fs');

const alg = 'RS256';

/**
 * Synchronously sign the given payload into a JSON Web Token string.
 * @author N V Harish <nv.harish@outlook.com>
 * @param {Object} payload Payload to sign
 * @param {string} kid Unique identifer of the RSA key pair
 * @param {Buffer} privateKey PEM encoded private key for RSA
 * @returns {string} The JSON Web Token
 * @example const fs = require('node:fs');
 * const privateKey = fs.readFileSync('privatekey.pem', 'utf-8');
 * sign({ foo: 'bar', exp: Math.floor(Date.now() / 1000) + (60 * 60), aud: 'example.com', sub: 'userId12345', iss: 'example.com' }, 'abcdefghijk', privateKey)
 */
function sign(payload, kid, privateKey) {
  const options = {
    algorithm: alg,
    header: {
      kid,
      alg,
      typ: 'JWT',
    },
  };
  const token = jwt.sign(payload, privateKey, options);
  return token;
}

/**
 * Asynchronously verify given token using a public key contain in a JSON Web Keyset (JWKS) URL to get a decoded token.
 * @author N V Harish <nv.harish@outlook.com>
 * @param {string} token JWT string to verify
 * @param {string} jwksUri JWKs public url
 * @param {CallableFunction} callback Callback to get the decoded token
 * @example verify('xxxxxxx.xxxxxx.xxxxxx', 'http://localhost/.well-known/jwks.json', (err, decoded) => { ... })
 * @returns void
 */
function verify(token, jwksUri, callback) {
  const getKey = (header, callback) => {
    const client = jwksClient({
      jwksUri,
      timeout: 30000,
    });

    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err, null);
      } else {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      }
    });
  };
  jwt.verify(token, getKey, callback);
}

/**
 * Generates JSON Web Keyset (JWKS) for the given RSA public key and writes the JWK to a JSON file.
 * @author N V Harish <nv.harish@outlook.com>
 * @param {Buffer} publicKey PEM encoded public key for RSA
 * @param {string} jwksFilePath Public jwks.json file absolute path
 * @returns void
 * @example const fs = require('node:fs');
 * const publicKey = fs.readFileSync('publickey.pem', 'utf-8');
 * generateJwks(publickey)
 */
async function generateJwks(publicKey, jwksFilePath) {
  const key = await jose.JWK.asKey(publicKey, 'pem');
  const jwk = key.toJSON();

  let jwks = { keys: [] };
  if (fs.existsSync(jwksFilePath)) {
    jwks = JSON.parse(fs.readFileSync(jwksFilePath, 'utf-8').toString());
  }

  jwks.keys.push({
    kty: jwk.kty,
    kid: jwk.kid,
    alg,
    use: 'sig',
    n: jwk.n,
    e: jwk.e,
  });
  fs.writeFileSync(jwksFilePath, JSON.stringify(jwks), 'utf-8');
}

module.exports = {
  verify,
  sign,
  generateJwks,
};
