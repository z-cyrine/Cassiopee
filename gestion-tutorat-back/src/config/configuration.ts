export default () => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  cas: {
    url: process.env.CAS_URL || 'https://cas7d.imtbs-tsp.eu/cas',
    serviceUrl: process.env.SERVICE_URL || 'https://localhost:8080',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  },
}); 