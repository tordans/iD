// Entry for `dist/traffic-sign-converter/recommender.js`, a lazy-loaded ESM bundle with the
// parts of the vendored traffic sign converter that turn a `traffic_sign` value into
// recommended tags. The vendored slim browser bundle (`id-field-browser.js`) does not
// include `signsToTags`, and the unbundled files import `opening_hours` by bare name.
export { trafficSignTagToSigns } from '../vendor/traffic-sign-converter/trafficSignTagToSigns/trafficSignTagToSigns.js';
export { signsToTags } from '../vendor/traffic-sign-converter/signsToTags/signsToTags.js';
export { signsToTrafficSignTagValue } from '../vendor/traffic-sign-converter/signsToTrafficSignTag/signsToTrafficSignTagValue.js';
