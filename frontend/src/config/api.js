const configuredApiUrl = import.meta.env.VITE_API_URL || '';
const isProductionBuild = import.meta.env.PROD;

if (isProductionBuild && !/^https:\/\/[^/]+/i.test(configuredApiUrl)) {
	throw new Error('VITE_API_URL must be an HTTPS URL in production');
}

export const apiUrl = (path) => `${configuredApiUrl.replace(/\/$/, '')}${path}`;
