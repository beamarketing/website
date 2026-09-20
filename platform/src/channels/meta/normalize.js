import { createHash } from 'node:crypto';

/**
 * Meta's advertiser-data normalisation rules.
 *
 * These are NOT the same as LinkedIn's. LinkedIn matches on a single key
 * (lowercased, trimmed email → SHA-256). Meta matches on up to fifteen keys and
 * normalises each one differently, and a wrongly normalised key does not error —
 * it silently fails to match, quietly costing you reach. So every rule below is
 * applied explicitly rather than assumed.
 *
 * Reference: Meta Customer List Custom Audiences, "Data preparation".
 */

const sha256 = (value) => createHash('sha256').update(String(value), 'utf8').digest('hex');

/** Strips accents so "José" and "Jose" hash alike, as Meta expects. */
const deaccent = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');

const blank = (v) => v === null || v === undefined || String(v).trim() === '';

// US state names → the two-letter ANSI abbreviation Meta wants.
const US_STATES = {
  alabama: 'al', alaska: 'ak', arizona: 'az', arkansas: 'ar', california: 'ca',
  colorado: 'co', connecticut: 'ct', delaware: 'de', florida: 'fl', georgia: 'ga',
  hawaii: 'hi', idaho: 'id', illinois: 'il', indiana: 'in', iowa: 'ia', kansas: 'ks',
  kentucky: 'ky', louisiana: 'la', maine: 'me', maryland: 'md', massachusetts: 'ma',
  michigan: 'mi', minnesota: 'mn', mississippi: 'ms', missouri: 'mo', montana: 'mt',
  nebraska: 'ne', nevada: 'nv', 'new hampshire': 'nh', 'new jersey': 'nj',
  'new mexico': 'nm', 'new york': 'ny', 'north carolina': 'nc', 'north dakota': 'nd',
  ohio: 'oh', oklahoma: 'ok', oregon: 'or', pennsylvania: 'pa', 'rhode island': 'ri',
  'south carolina': 'sc', 'south dakota': 'sd', tennessee: 'tn', texas: 'tx',
  utah: 'ut', vermont: 'vt', virginia: 'va', washington: 'wa', 'west virginia': 'wv',
  wisconsin: 'wi', wyoming: 'wy', 'district of columbia': 'dc',
};

const COUNTRIES = {
  'united states': 'us', usa: 'us', 'u.s.': 'us', 'u.s.a.': 'us', america: 'us',
  'united kingdom': 'gb', uk: 'gb', 'great britain': 'gb', england: 'gb',
  israel: 'il', germany: 'de', deutschland: 'de', france: 'fr', spain: 'es',
  espana: 'es', italy: 'it', netherlands: 'nl', holland: 'nl', canada: 'ca',
  australia: 'au', india: 'in', japan: 'jp', brazil: 'br', brasil: 'br',
  sweden: 'se', norway: 'no', denmark: 'dk', finland: 'fi', ireland: 'ie',
  switzerland: 'ch', austria: 'at', belgium: 'be', poland: 'pl', portugal: 'pt',
  mexico: 'mx', singapore: 'sg', 'south korea': 'kr', korea: 'kr', china: 'cn',
  'new zealand': 'nz', 'south africa': 'za', uae: 'ae',
  'united arab emirates': 'ae',
};

/** Each normaliser returns the cleaned string, or null when unusable. */
export const NORMALISERS = {
  // Lowercase + trim. Meta does NOT strip gmail dots or +suffixes, so neither do we.
  EMAIL(value) {
    const v = String(value).trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v) ? v : null;
  },

  // Digits only, country code included, leading zeros and symbols removed.
  PHONE(value) {
    const digits = String(value).replace(/\D/g, '').replace(/^0+/, '');
    return digits.length >= 7 ? digits : null;
  },

  // a-z only for latin names; accents folded, punctuation and spaces dropped.
  FN(value) {
    const v = deaccent(String(value)).toLowerCase().replace(/[^a-zÀ-ɏЀ-ӿ֐-׿]/g, '');
    return v || null;
  },
  LN(value) { return NORMALISERS.FN(value); },

  // First initial: exactly one character.
  FI(value) {
    const v = NORMALISERS.FN(value);
    return v ? v[0] : null;
  },

  CT(value) {
    const v = deaccent(String(value)).toLowerCase().replace(/[^a-z]/g, '');
    return v || null;
  },

  ST(value) {
    const raw = deaccent(String(value)).toLowerCase().trim();
    if (US_STATES[raw]) return US_STATES[raw];
    const compact = raw.replace(/[^a-z]/g, '');
    return compact || null;
  },

  // US ZIPs are truncated to the first five digits; other countries keep theirs.
  ZIP(value) {
    const v = String(value).toLowerCase().replace(/\s/g, '');
    if (!v) return null;
    return /^\d{5}(-?\d{4})?$/.test(v) ? v.slice(0, 5) : v;
  },

  COUNTRY(value) {
    const raw = deaccent(String(value)).toLowerCase().trim();
    if (COUNTRIES[raw]) return COUNTRIES[raw];
    return /^[a-z]{2}$/.test(raw) ? raw : null;
  },

  DOBY(value) {
    const year = String(value).match(/\b(19|20)\d{2}\b/);
    return year ? year[0] : null;
  },

  GEN(value) {
    const v = String(value).trim().toLowerCase();
    if (/^(m|male|man)$/.test(v)) return 'm';
    if (/^(f|female|woman)$/.test(v)) return 'f';
    return null;
  },
};

// Meta hashes every key except these two, which are sent in the clear.
const UNHASHED = new Set(['MADID', 'EXTERN_ID']);

/** Normalises then hashes one value for a given Meta schema key. */
export function prepareKey(key, value) {
  if (blank(value)) return null;
  if (UNHASHED.has(key)) return String(value).trim();
  const normalise = NORMALISERS[key];
  if (!normalise) return null;
  const normalised = normalise(value);
  return normalised ? sha256(normalised) : null;
}

/**
 * The schema we upload, in priority order. More keys means a higher match rate:
 * email alone typically matches far fewer B2B contacts than email plus name
 * plus country, because people register personal Facebook accounts with
 * personal addresses.
 */
export const SCHEMA = ['EMAIL', 'FN', 'LN', 'CT', 'ST', 'ZIP', 'COUNTRY', 'PHONE', 'EXTERN_ID'];

/** Maps one Beamr contact onto a Meta payload row aligned to SCHEMA. */
export function contactToRow(contact, schema = SCHEMA) {
  const source = {
    EMAIL: contact.email,
    FN: contact.first_name,
    LN: contact.last_name,
    CT: contact.city ?? contact.attrs?.city,
    ST: contact.state ?? contact.attrs?.state,
    ZIP: contact.zip ?? contact.attrs?.zip ?? contact.attrs?.postal_code,
    COUNTRY: contact.country,
    PHONE: contact.phone,
    // Our own id, so Meta can match a returning person we already know.
    EXTERN_ID: contact.id,
  };
  return schema.map((key) => prepareKey(key, source[key]) ?? '');
}

/** How many of the schema keys we can actually fill, as a quality signal. */
export function rowCompleteness(row) {
  const filled = row.filter((v) => v !== '').length;
  return { filled, total: row.length, ratio: Math.round((filled / row.length) * 100) / 100 };
}

/** user_data block for the Conversions API — same rules, different key names. */
export function capiUserData(contact, { fbp = null, fbc = null, ip = null, userAgent = null } = {}) {
  const data = {};
  const em = prepareKey('EMAIL', contact?.email);
  if (em) data.em = [em];
  const fn = prepareKey('FN', contact?.first_name);
  if (fn) data.fn = [fn];
  const ln = prepareKey('LN', contact?.last_name);
  if (ln) data.ln = [ln];
  const ph = prepareKey('PHONE', contact?.phone);
  if (ph) data.ph = [ph];
  const country = prepareKey('COUNTRY', contact?.country);
  if (country) data.country = [country];
  if (contact?.id) data.external_id = [String(contact.id)];
  // fbp/fbc are Meta's own browser identifiers and are sent unhashed.
  if (fbp) data.fbp = fbp;
  if (fbc) data.fbc = fbc;
  if (ip) data.client_ip_address = ip;
  if (userAgent) data.client_user_agent = userAgent;
  return data;
}
