/**
 * RFC-4180 CSV parsing/serialising with no dependencies.
 * Handles quoted fields, embedded commas/newlines, escaped quotes, BOM and
 * CRLF — i.e. the things a real CRM export actually contains.
 */

export function parseCsv(input, { delimiter = null } = {}) {
  let text = String(input ?? '');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
  if (!text.trim()) return { headers: [], rows: [] };

  const delim = delimiter || sniffDelimiter(text);
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"' && field === '') { inQuotes = true; continue; }
    if (ch === delim) { row.push(field); field = ''; continue; }
    if (ch === '\r') continue;
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  const headers = (rows.shift() || []).map((h) => h.trim());
  const objects = rows
    .filter((r) => r.some((c) => c !== null && String(c).trim() !== ''))
    .map((r) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (r[i] ?? '').trim(); });
      return obj;
    });
  return { headers, rows: objects };
}

function sniffDelimiter(text) {
  const line = text.slice(0, text.indexOf('\n') === -1 ? text.length : text.indexOf('\n'));
  const counts = [',', ';', '\t', '|'].map((d) => [d, line.split(d).length]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 1 ? counts[0][0] : ',';
}

export function toCsv(rows, headers = null) {
  if (!rows.length) return headers ? headers.join(',') + '\n' : '';
  const cols = headers || [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const cell = (v) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n') + '\n';
}

/**
 * Maps arbitrary CRM column names onto our contact fields. Sales exports never
 * agree on casing or wording, so we match on a normalised key.
 */
const FIELD_ALIASES = {
  email: ['email', 'emailaddress', 'email address', 'workemail', 'work email', 'e-mail', 'mail', 'primaryemail'],
  first_name: ['firstname', 'first name', 'first', 'givenname', 'given name', 'fname'],
  last_name: ['lastname', 'last name', 'last', 'surname', 'familyname', 'family name', 'lname'],
  company: ['company', 'companyname', 'company name', 'account', 'accountname', 'organization', 'organisation', 'employer'],
  job_title: ['title', 'jobtitle', 'job title', 'position', 'role', 'designation'],
  seniority: ['seniority', 'level', 'senioritylevel'],
  function: ['function', 'department', 'dept', 'jobfunction', 'job function'],
  linkedin_url: ['linkedin', 'linkedinurl', 'linkedin url', 'linkedinprofile', 'linkedin profile', 'liurl', 'profileurl'],
  country: ['country', 'countryname', 'location', 'geo'],
  industry: ['industry', 'vertical', 'sector'],
  company_size: ['companysize', 'company size', 'employees', 'employeecount', 'headcount', 'size'],
  phone: ['phone', 'phonenumber', 'phone number', 'mobile', 'telephone', 'tel'],
  domain: ['domain', 'website', 'companydomain', 'company domain', 'url'],
  owner: ['owner', 'accountowner', 'account owner', 'salesowner', 'rep', 'assignedto'],
  lifecycle_stage: ['lifecycle', 'lifecyclestage', 'lifecycle stage', 'stage', 'status'],
};

const norm = (s) => String(s).toLowerCase().replace(/[_\-.]/g, ' ').replace(/\s+/g, ' ').trim();

/** Returns { email: 'Work Email', first_name: 'FirstName', ... } for a header row. */
export function guessMapping(headers) {
  const mapping = {};
  const used = new Set();
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const hit = headers.find((h) => {
      if (used.has(h)) return false;
      const n = norm(h);
      return aliases.includes(n) || aliases.includes(n.replace(/\s/g, ''));
    });
    if (hit) { mapping[field] = hit; used.add(hit); }
  }
  return mapping;
}

/** Applies a mapping to a raw row; unmapped columns become custom attrs. */
export function applyMapping(row, mapping) {
  const out = { attrs: {} };
  const mapped = new Set(Object.values(mapping));
  for (const [field, header] of Object.entries(mapping)) {
    const v = row[header];
    if (v !== undefined && v !== '') out[field] = v;
  }
  for (const [key, value] of Object.entries(row)) {
    if (mapped.has(key) || value === '' || value === undefined) continue;
    out.attrs[norm(key).replace(/\s/g, '_')] = value;
  }
  return out;
}
