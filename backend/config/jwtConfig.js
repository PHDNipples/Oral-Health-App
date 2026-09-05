// backend/config/jwtConfig.js

module.exports = {
  ALGORITHM: "HS256",
  ISSUER: "ataata-oral-health-app",
  AUDIENCE: "ataata-oral-health-app-clients",
  EXPIRES_IN: "24h",
  REQUIRED_CLAIMS: ["uid", "email", "tokenVersion", "iat", "exp"],
};
