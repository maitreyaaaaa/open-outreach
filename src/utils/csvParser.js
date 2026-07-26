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
  const roles = ['Head of Talent', 'VP of Engineering', 'Product Lead', 'Growth Marketing Director', 'Chief Technology Officer', 'Founder & CEO', 'Talent Acquisition Manager', 'Director of Sales'];
  const companies = ['Apex Systems', 'Nexus AI', 'Vertex Cloud', 'Nova Digital', 'Pulse Analytics', 'Horizon Media', 'Quantum Labs', 'Starlight Tech'];
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
      CustomNote: `Hi ${fn}, noticed your leadership at ${company} as ${role}. Would love to connect and follow your updates!`,
      Status: 'Pending',
      SentAt: null,
      Error: null
    });
  }

  return demoData;
}

export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const formatted = results.data.map((row, index) => {
            const keys = Object.keys(row);
            const companyKey = keys.find(k => k.toLowerCase().includes('company') || k.toLowerCase().includes('org')) || keys[0];
            const emailKey = keys.find(k => k.toLowerCase().includes('email') || k.toLowerCase().includes('mail')) || keys[1];
            const nameKey = keys.find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('contact')) || keys[2];
            const urlKey = keys.find(k => k.toLowerCase().includes('url') || k.toLowerCase().includes('linkedin'));

            return {
              id: index + 1,
              Company: row[companyKey] ? String(row[companyKey]).trim() : `Company #${index + 1}`,
              Email: row[emailKey] ? String(row[emailKey]).trim() : '',
              LinkedInUrl: row[urlKey] ? String(row[urlKey]).trim() : (row.LinkedInUrl || ''),
              ContactPerson: row[nameKey] ? String(row[nameKey]).trim() : 'Hiring Manager',
              Role: row.Role || 'Executive',
              Name: row.Name || row[nameKey] || 'Contact',
              CustomNote: row.CustomNote || '',
              Status: 'Pending',
              SentAt: null,
              Error: null
            };
          });

          resolve(formatted);
        } else {
          reject(new Error('No data found in CSV file.'));
        }
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
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
        
        if (rows && rows.length > 0) {
          const formatted = rows.map((row, index) => {
            const keys = Object.keys(row);
            const companyKey = keys.find(k => k.toLowerCase().includes('company')) || keys[0];
            const emailKey = keys.find(k => k.toLowerCase().includes('email')) || keys[1];
            const nameKey = keys.find(k => k.toLowerCase().includes('name')) || keys[2];

            return {
              id: index + 1,
              Company: row[companyKey] ? String(row[companyKey]).trim() : `Company #${index + 1}`,
              Email: row[emailKey] ? String(row[emailKey]).trim() : '',
              ContactPerson: row[nameKey] ? String(row[nameKey]).trim() : 'Hiring Manager',
              CustomNote: row.CustomNote || '',
              Status: 'Pending',
              SentAt: null,
              Error: null
            };
          });

          resolve(formatted);
        } else {
          reject(new Error('No data found in Excel sheet.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
