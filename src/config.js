/**
 * App-wide configuration constants.
 * Override BASE_URL for different environments (dev, staging, prod)
 * by setting REACT_APP_API_BASE_URL in your .env file.
 */
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  'https://api.spiral-fieldforce.com/v1';

export default {
  BASE_URL,
  API_TIMEOUT_MS: 10000,
};
