import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');

const workbook = xlsx.readFile('Revisi MRP Excel.xlsx');
const mrpData = xlsx.utils.sheet_to_json(workbook.Sheets['MRP Revisi'], { header: 1 });

for (let i = 0; i < mrpData.length; i++) {
  const row = mrpData[i];
  if (row[0] && typeof row[0] === 'string' && row[0].includes('Cokelat') && row.length === 1) {
    console.log('Found MRP Group:', row[0]);
  }
}
