import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export function generateDemoCompanies() {
  const companies = [
    { name: 'Y Combinator', email: 'press@ycombinator.com', contact: 'Garry Tan' },
    { name: 'Techstars', email: 'hello@techstars.com', contact: 'Maëlle Gavet' },
    { name: '500 Global', email: 'press@500.co', contact: 'Christine Tsai' },
    { name: 'MassChallenge', email: 'media@masschallenge.org', contact: 'Caitlin Reimers' },
    { name: 'Plug and Play', email: 'press@pnptc.com', contact: 'Saeed Amidi' },
    { name: 'Startupbootcamp', email: 'marketing@startupbootcamp.org', contact: 'Ibrahim Seksek' },
    { name: 'Entrepreneur First', email: 'partnerships@joinef.com', contact: 'Matt Clifford' },
    { name: 'Antler', email: 'press@antler.co', contact: 'Magnus Grimeland' },
    { name: 'Village Global', email: 'hello@villageglobal.com', contact: 'Erik Torenberg' },
    { name: 'Sequoia Capital', email: 'compliance@sequoiacap.com', contact: 'Roelof Botha' },
    { name: 'Andreessen Horowitz', email: 'menlopark-info@a16z.com', contact: 'Marc Andreessen' },
    { name: 'Accel', email: 'prayank@accel.com', contact: 'Rich Wong' },
    { name: 'Lightspeed Venture Partners', email: 'harsha@lsip.com', contact: 'Ravi Mhatre' },
    { name: 'Index Ventures', email: 'press@indexventures.com', contact: 'Neil Rimer' },
    { name: 'Founders Fund', email: 'erin@foundersfund.com', contact: 'Brian Singerman' },
    { name: 'General Catalyst', email: 'MGillis@generalcatalyst.com', contact: 'Hemant Taneja' },
    { name: 'Bessemer Venture Partners', email: 'bessemerbeam@bvp.com', contact: 'Byron Deeter' },
    { name: 'NEA', email: 'bd@nea.com', contact: 'Scott Sandell' },
    { name: 'Khosla Ventures', email: 'kv@khoslaventures.com', contact: 'Vinod Khosla' },
    { name: 'Kleiner Perkins', email: 'plans@kpcb.com', contact: 'Mamoon Hamid' },
    { name: 'SoftBank Vision Fund', email: 'rowan@softbank.com', contact: 'Rajeev Misra' },
    { name: 'Tiger Global', email: 'media@tigerglobal.com', contact: 'Chase Coleman' },
    { name: 'Insight Partners', email: 'CorpPartnerships@insightpartners.com', contact: 'Jeff Horing' },
    { name: 'Coatue', email: 'media@coatue.com', contact: 'Philippe Laffont' },
    { name: 'GV (Google Ventures)', email: 'press@gv.com', contact: 'Frédérique Dame' }
  ];

  return companies.map((c, i) => ({
    id: i + 1,
    Company: c.name,
    Email: c.email,
    ContactPerson: c.contact,
    CustomNote: `We saw ${c.name}'s recent announcement and wanted to reach out.`,
    Status: 'Pending',
    SentAt: null,
    Error: null
  }));
}

export function generateDemoLinkedInProfiles() {
  const roles = ['Angel Investor', 'Managing Partner', 'Venture Partner', 'General Partner', 'Founder & Investor', 'Principal Investor', 'Investment Director', 'Head of Investments'];
  const companies = ['Apex Capital', 'Nexus Ventures', 'Vertex Angel Fund', 'Nova Seed Fund', 'Pulse Syndicate', 'Horizon Angels', 'Quantum Fund', 'Starlight Capital'];
  const firstNames = ['Sarah', 'Michael', 'Alex', 'Elena', 'David', 'Jessica', 'James', 'Rachel', 'Daniel', 'Sophia', 'Chris', 'Amanda'];
  const lastNames = ['Chen', 'Smith', 'Johnson', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];

  const demoData = [];

  for (let i = 1; i <= 25; i++) {
    const fn = firstNames[(i - 1) % firstNames.length];
    const ln = lastNames[(i - 1) % lastNames.length];
    const company = companies[(i - 1) % companies.length];
    const role = roles[(i - 1) % roles.length];
    const handle = `${fn.toLowerCase()}-${ln.toLowerCase()}-${i}`;
    
    demoData.push({
      id: i,
      Name: `${fn} ${ln}`,
      Company: company,
      Role: role,
      LinkedInUrl: `https://www.linkedin.com/in/${handle}`,
      CustomNote: `Hi ${fn}, noticed your work at ${company} as ${role}. Would love to connect and share updates on our venture!`,
      Status: 'Pending',
      SentAt: null,
      Error: null
    });
  }

  return demoData;
}

/**
 * Checks magic bytes to detect binary files (.xlsx ZIP header PK 0x50 0x4B, .xls OLE2 0xD0 0xCF)
 */
function isBinaryFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arr = new Uint8Array(e.target.result);
        if (arr.length >= 4) {
          if ((arr[0] === 0x50 && arr[1] === 0x4B) || (arr[0] === 0xD0 && arr[1] === 0xCF)) {
            return resolve(true);
          }
        }
        let binaryCount = 0;
        for (let i = 0; i < Math.min(arr.length, 512); i++) {
          if (arr[i] === 0 || (arr[i] < 9 && arr[i] !== 10 && arr[i] !== 13)) {
            binaryCount++;
          }
        }
        resolve(binaryCount > 2);
      } catch (err) {
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 1024));
  });
}

/**
 * Robust LinkedIn URL Validator
 * Accepts all subdomains (in.linkedin.com, uk.linkedin.com), handles, query tracking params, and sales nav links.
 */
export function isValidLinkedInUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const cleaned = url.trim().toLowerCase();
  if (cleaned.length < 10) return false;

  // Must contain linkedin.com OR be a valid HTTP(S) URL
  const isLinkedIn = cleaned.includes('linkedin.com') || cleaned.includes('linkedin.com/in/') || cleaned.includes('linkedin.com/sales/');
  const isHttpUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(cleaned);

  return isLinkedIn || isHttpUrl;
}

/**
 * Normalizes LinkedIn URL by cleaning tracking parameters and adding protocol
 */
export function normalizeLinkedInUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let u = url.trim();
  if (!u) return '';

  // Clean trailing query parameters (e.g. ?miniProfileUrn=...)
  if (u.includes('?')) {
    u = u.split('?')[0];
  }

  // Prepend protocol if missing
  if (!u.startsWith('http://') && !u.startsWith('https://')) {
    u = `https://${u.replace(/^\/\//, '')}`;
  }

  return u;
}

/**
 * Sanitizes text to strip binary artifacts and control characters
 */
function sanitizeText(str) {
  if (!str) return '';
  let s = String(str);
  s = s.replace(/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u2261\uFFFD\uFFFC]/g, '');
  s = s.replace(/≡+/g, '').replace(/\\+/g, ' ').trim();
  return s;
}

/**
 * Sort profiles so Valid LinkedIn URLs come FIRST (top), Invalid URLs come LAST (bottom)
 */
export function sortProfilesValidFirst(profiles) {
  return [...profiles].sort((a, b) => {
    const aValid = isValidLinkedInUrl(a.LinkedInUrl);
    const bValid = isValidLinkedInUrl(b.LinkedInUrl);
    if (aValid && !bValid) return -1;
    if (!aValid && bValid) return 1;
    return 0;
  });
}

/**
 * Universal Intelligent File Parser
 */
export async function parseAnyFile(file) {
  const fileName = file.name.toLowerCase();
  const isExcelExt = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || file.type.includes('sheet') || file.type.includes('excel');
  const isBinary = await isBinaryFile(file);

  let rawRows = [];
  if (isBinary || isExcelExt) {
    rawRows = await parseExcelFile(file);
  } else {
    try {
      rawRows = await parseCSVFile(file);
    } catch (err) {
      rawRows = await parseExcelFile(file);
    }
  }

  const sorted = sortProfilesValidFirst(rawRows);
  const validCount = sorted.filter(r => isValidLinkedInUrl(r.LinkedInUrl)).length;
  console.log(`[Parser Debug] Parsed ${file.name}: ${sorted.length} total rows (${validCount} valid LinkedIn URLs, ${sorted.length - validCount} invalid).`);

  return sorted;
}

/**
 * Smart Column Mapper for Raw Scraped Objects
 */
function normalizeRowData(row, index) {
  if (!row || typeof row !== 'object') return null;

  const fullRowStr = JSON.stringify(row).toLowerCase();

  // Ignore internal Excel ZIP metadata paths
  if (
    fullRowStr.includes('xl/theme') ||
    fullRowStr.includes('sharedstrings.xml') ||
    fullRowStr.includes('[content_types].xml') ||
    fullRowStr.includes('_rels/.rels') ||
    fullRowStr.includes('xl/worksheets')
  ) {
    return null;
  }

  const keys = Object.keys(row);
  if (keys.length === 0) return null;

  // Check if row is a formula garbage token (e.g. 4Gf3,Q*)
  const allValuesStr = keys.map(k => String(row[k] || '')).join(' ');
  if (/^[a-z0-9,\*<>\^\$!≡\\\|\?\s]{1,12}$/i.test(allValuesStr.trim()) && !allValuesStr.includes('http')) {
    return null; // Ignore formula garbage row
  }

  const findKey = (patterns) => {
    return keys.find(k => {
      const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      return patterns.some(p => cleanKey.includes(p));
    });
  };

  // 1. Name Detection
  const firstNameKey = findKey(['firstname', 'first', 'fname', 'givenname']);
  const lastNameKey = findKey(['lastname', 'last', 'lname', 'surname', 'familyname']);
  const fullNameKey = findKey(['fullname', 'name', 'contactname', 'investorname', 'personname', 'person', 'contact', 'investor', 'lead', 'target']);

  let rawName = '';
  if (firstNameKey && row[firstNameKey]) {
    const fn = sanitizeText(row[firstNameKey]);
    const ln = lastNameKey && row[lastNameKey] ? sanitizeText(row[lastNameKey]) : '';
    rawName = `${fn} ${ln}`.trim();
  } else if (fullNameKey && row[fullNameKey]) {
    rawName = sanitizeText(row[fullNameKey]);
  } else {
    const textVal = keys.map(k => sanitizeText(row[k])).find(v => v.length > 2 && !v.includes('http') && !v.includes('@'));
    rawName = textVal || '';
  }

  const name = sanitizeText(rawName) || `Contact #${index + 1}`;

  // 2. Role / Title / Position Detection
  const roleKey = findKey(['role', 'title', 'jobtitle', 'position', 'headline', 'occupation', 'designation', 'investortype', 'type', 'category']);
  let role = roleKey && row[roleKey] ? sanitizeText(row[roleKey]) : 'Executive / Investor';

  // 3. Company / Firm / Organization Detection
  const companyKey = findKey(['company', 'firm', 'fund', 'organization', 'org', 'employer', 'workplace', 'account', 'venture', 'business']);
  let company = companyKey && row[companyKey] ? sanitizeText(row[companyKey]) : '';
  
  if (!company && role.toLowerCase().includes(' at ')) {
    const parts = role.split(/ at /i);
    if (parts[1]) {
      company = sanitizeText(parts[1]);
      role = sanitizeText(parts[0]);
    }
  }
  if (!company) company = 'Investment Firm';

  // 4. LinkedIn URL Detection — Intelligent Multi-Strategy Matcher
  const linkedinKey = findKey(['linkedin', 'profileurl', 'profilelink', 'personlinkedinurl', 'linkedinurl', 'url', 'link', 'social']);
  let rawUrl = '';
  if (linkedinKey && row[linkedinKey]) {
    rawUrl = sanitizeText(row[linkedinKey]);
  }
  
  // If key search didn't yield a valid URL, search ALL cell values in row for any URL containing linkedin.com or http
  if (!isValidLinkedInUrl(rawUrl)) {
    const urlFromCells = keys
      .map(k => sanitizeText(row[k]))
      .find(v => v.includes('linkedin.com') || v.includes('linkedin.com/in/') || v.includes('linkedin.com/sales/') || v.startsWith('http'));
    
    if (urlFromCells) {
      rawUrl = urlFromCells;
    }
  }

  const linkedinUrl = normalizeLinkedInUrl(rawUrl);

  // 5. Email Detection
  const emailKey = findKey(['email', 'mail', 'emailaddress', 'contactemail']);
  let email = emailKey && row[emailKey] ? sanitizeText(row[emailKey]) : '';
  if (!email) {
    const emailVal = keys.map(k => sanitizeText(row[k])).find(v => v.includes('@') && v.includes('.'));
    email = emailVal || '';
  }

  // 6. Custom Note Generation
  const noteKey = findKey(['customnote', 'note', 'message', 'intro']);
  const customNote = noteKey && row[noteKey] ? sanitizeText(row[noteKey]) : '';

  return {
    id: index + 1,
    Name: name,
    Company: company,
    Role: role,
    Email: email,
    LinkedInUrl: linkedinUrl,
    ContactPerson: name,
    CustomNote: customNote,
    Status: 'Pending',
    SentAt: null,
    Error: null
  };
}

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const formatted = results.data
            .map((row, index) => normalizeRowData(row, index))
            .filter(Boolean);

          if (formatted.length > 0) {
            return resolve(formatted);
          }
        }
        
        Papa.parse(file, {
          header: false,
          skipEmptyLines: 'greedy',
          complete: (rawResults) => {
            if (rawResults.data && rawResults.data.length > 0) {
              const fallbackFormatted = rawResults.data.map((rowArr, index) => {
                const rowObj = {};
                rowArr.forEach((val, i) => { rowObj[`col_${i}`] = val; });
                return normalizeRowData(rowObj, index);
              }).filter(Boolean);

              if (fallbackFormatted.length > 0) {
                return resolve(fallbackFormatted);
              }
            }
            reject(new Error('No readable data rows found in CSV file.'));
          },
          error: (err) => reject(err)
        });
      },
      error: (err) => reject(err)
    });
  });
}

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        let sheet = workbook.Sheets[workbook.SheetNames[0]];

        for (const name of workbook.SheetNames) {
          if (workbook.Sheets[name] && XLSX.utils.sheet_to_json(workbook.Sheets[name]).length > 0) {
            sheet = workbook.Sheets[name];
            break;
          }
        }

        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        
        if (rows && rows.length > 0) {
          const formatted = rows
            .map((row, index) => normalizeRowData(row, index))
            .filter(Boolean);

          resolve(formatted);
        } else {
          reject(new Error('No data found in Excel sheet.'));
        }
      } catch (err) {
        reject(new Error(`Excel parsing error: ${err.message}`));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
