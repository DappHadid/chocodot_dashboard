import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');

const workbook = xlsx.readFile('Revisi MRP Excel.xlsx');
const rekapData = xlsx.utils.sheet_to_json(workbook.Sheets['Rekap'], { header: 1 });

for (let i = 0; i < rekapData.length; i++) {
  const row = rekapData[i];
  if (row[0] && typeof row[0] === 'string' && row[0].includes('Cokelat') && row.length === 1) {
    console.log('Found Rekap Group (col 0):', row[0]);
  }
}

console.log('First 20 rows:');
console.log(rekapData.slice(0, 20).map(r => r.filter(c => c !== undefined && c !== null && c !== '')));
