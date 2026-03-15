/**
 * Client env values from import.meta.env (Vite 8 envPrefix: 'ID_').
 * Used by config/id.js for CDN URLs, API connection, and feature flags.
 */
export const idPresetsCdnUrl = import.meta.env.ID_PRESETS_CDN_URL ?? null;
export const idOciCdnUrl = import.meta.env.ID_OCI_CDN_URL ?? null;
export const idNsiCdnUrl = import.meta.env.ID_NSI_CDN_URL ?? null;
export const idWmfSitematrixCdnUrl = import.meta.env.ID_WMF_SITEMATRIX_CDN_URL ?? null;
export const idApiConnectionUrl = import.meta.env.ID_API_CONNECTION_URL ?? null;
export const idApiConnectionApiUrl = import.meta.env.ID_API_CONNECTION_API_URL ?? null;
export const idApiConnectionClientId = import.meta.env.ID_API_CONNECTION_CLIENT_ID ?? null;
export const idApiConnection = import.meta.env.ID_API_CONNECTION ?? null;
export const idTaginfoApiUrl = import.meta.env.ID_TAGINFO_API_URL ?? null;
export const idNominatimApiUrl = import.meta.env.ID_NOMINATIM_API_URL ?? null;
export const idShowDonationMessage = import.meta.env.ID_SHOW_DONATION_MESSAGE ?? null;
