import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');

const workbook = xlsx.readFile('Revisi MRP Excel.xlsx');
const rekapData = xlsx.utils.sheet_to_json(workbook.Sheets['Rekap'], { header: 1 });

console.log(rekapData.slice(0, 10));


