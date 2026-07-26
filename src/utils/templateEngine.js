export function renderTemplate(templateString, record) {
  if (!templateString) return '';
  
  let result = templateString;

  Object.keys(record).forEach((key) => {
    if (['id', 'Status', 'SentAt', 'Error'].includes(key)) return;
    
    const value = record[key] !== undefined && record[key] !== null ? String(record[key]) : '';
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
    result = result.replace(regex, value);
  });

  if (record.ContactPerson) {
    const firstName = record.ContactPerson.split(' ')[0];
    result = result.replace(/\{\{\s*FirstName\s*\}\}/gi, firstName);
  } else if (record.Name) {
    const firstName = record.Name.split(' ')[0];
    result = result.replace(/\{\{\s*FirstName\s*\}\}/gi, firstName);
  }

  return result;
}

export function textToHtml(plainText) {
  if (!plainText) return '';
  
  const paragraphs = plainText.split(/\n\n+/);
  
  const htmlParagraphs = paragraphs.map(p => {
    const linesWithBreaks = p.split('\n').join('<br/>');
    return `<p style="margin-bottom: 16px; line-height: 1.6;">${linesWithBreaks}</p>`;
  });

  return htmlParagraphs.join('');
}
