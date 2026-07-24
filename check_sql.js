import * as fs from 'fs';

const content = fs.readFileSync('seeder.sql', 'utf-8');
const bomMatch = content.match(/INSERT INTO bom_items[^\(]+\((.*?)\);/s);
if (bomMatch) {
  const lines = bomMatch[1].split(/\n/).filter(l => l.includes('(') || l.includes(')') || l.trim().length > 0);
  console.log('BOM extracted successfully. Check the groups inserted.');
}

const mrpMatch = content.match(/INSERT INTO mrp_items[^\(]+\((.*?)\);/s);
if (mrpMatch) {
  console.log('MRP extracted successfully.');
}

const rekapMatch = content.match(/INSERT INTO rekap_items[^\(]+\((.*?)\);/s);
if (rekapMatch) {
  console.log('Rekap extracted successfully.');
}

const extractGroups = (text) => {
  const groups = new Set();
  const regex = /\(\s*'([^']+)'\s*,/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    groups.add(m[1]);
  }
  return Array.from(groups);
};

console.log('--- BOM Groups ---');
console.log(bomMatch ? extractGroups(bomMatch[0]) : []);

console.log('--- MRP Groups ---');
console.log(mrpMatch ? extractGroups(mrpMatch[0]) : []);

console.log('--- Rekap Groups ---');
console.log(rekapMatch ? extractGroups(rekapMatch[0]) : []);

