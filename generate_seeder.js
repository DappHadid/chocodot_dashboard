import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');
import * as fs from 'fs';


function escapeString(str) {
  if (str === null || str === undefined) return "NULL";
  if (typeof str !== 'string') str = String(str);
  return `'${str.replace(/'/g, "''")}'`;
}

function runSeeder() {
  console.log('Membaca file Excel "Revisi MRP Excel.xlsx"...');
  
  // Baca file Excel
  let workbook;
  try {
    workbook = xlsx.readFile('Revisi MRP Excel.xlsx');
  } catch (err) {
    console.error('Gagal membaca file Excel:', err.message);
    return;
  }
  
  const sqlStatements = [
    `-- Menghapus data lama agar tidak terjadi duplikasi/mismatch\nTRUNCATE TABLE bom_items, mrp_items, rekap_items;\n`
  ];
  
  // 1. Ekstrak Data BOM Rev
  console.log('Mengekstrak sheet BOM Rev...');
  const bomData = xlsx.utils.sheet_to_json(workbook.Sheets['BOM Rev'], { header: 1 });
  const bomPayload = [];
  let currentBomGroup = '';

  for (const row of bomData) {
    if (row[0] && typeof row[0] === 'string' && row[0].includes('Cokelat') && !row[1] && !row[2]) {
      currentBomGroup = row[0].trim();
    } else if (row[0] && !isNaN(row[0])) {
      bomPayload.push(`(
        ${escapeString(currentBomGroup)}, 
        ${row[0]}, 
        ${row[1] || 0}, 
        ${escapeString(row[2] || '')}, 
        ${escapeString(row[3] || '')}, 
        ${row[4] || 0}, 
        ${escapeString(row[5] || '')}, 
        ${row[6] || 0}, 
        ${row[7] || 0}, 
        ${row[8] || 0}
      )`);
    }
  }

  if (bomPayload.length > 0) {
    const bomInsert = `INSERT INTO bom_items (product_group, no, level, kode, bahan_baku, quantity, satuan, lead_time_minggu, lot_size, on_hand) VALUES\n` + bomPayload.join(',\n') + ';';
    sqlStatements.push(bomInsert);
  }

  // 2. Ekstrak Data MRP Revisi
  console.log('Mengekstrak sheet MRP Revisi...');
  const mrpData = xlsx.utils.sheet_to_json(workbook.Sheets['MRP Revisi'], { header: 1 });
  const mrpPayload = [];
  let currentMrpGroup = '';
  let currentDesc = '';
  let currentPartNumber = '';
  let currentLevel = 0;
  
  const rowTypes = [
    'gross_requirement', 'schedule_receipts', 'projected_on_hand', 
    'net_requirement', 'planned_order_receipts', 'planned_order_release', 'sisa'
  ];

  for (let i = 0; i < mrpData.length; i++) {
    const row = mrpData[i];
    
    // Normalize MRP Group Name to match BOM and UI
    if (row[0] && typeof row[0] === 'string' && row[0].includes('Cokelat') && (!row[1] && !row[2])) {
      let groupName = row[0].trim();
      if (groupName === 'Cokelat Dark Kosongan') currentMrpGroup = 'Cokelat Kosongan Dark';
      else if (groupName === 'Cokelat White Kosongan') currentMrpGroup = 'Cokelat Kosongan White';
      else if (groupName === 'Cokelat Milk Kosongan') currentMrpGroup = 'Cokelat Kosongan Milk';
      else currentMrpGroup = groupName;
    }

    if (row[4] === 'Desc.') currentDesc = row[6] || '';
    if (row[0] === 'Part Number') currentPartNumber = row[2] || '';
    if (row[8] === 'Level') currentLevel = parseFloat(row[10]) || 0;

    if (row[0] === 'Gross Requirement') {
      for (let j = 0; j < 7; j++) {
        const dataRow = mrpData[i + j] || [];
        
        let weeksValues = [];
        for (let w = 1; w <= 48; w++) {
          const colIndex = w + 2; // Index 3 to 50
          weeksValues.push(dataRow[colIndex] || 0);
        }
        
        const no = Math.floor(mrpPayload.length / 7) + 1;
        const rowType = rowTypes[j];
        
        mrpPayload.push(`(
          ${escapeString(currentMrpGroup)},
          ${no},
          ${escapeString(currentDesc)},
          ${escapeString(currentPartNumber)},
          ${currentLevel},
          ${escapeString(rowType)},
          ${weeksValues.join(', ')}
        )`);
      }
    }
  }

  if (mrpPayload.length > 0) {
    const weekColumns = Array.from({ length: 48 }, (_, i) => `w${(i + 1).toString().padStart(2, '0')}`).join(', ');
    const mrpInsert = `INSERT INTO mrp_items (product_group, no, "desc", part_number, level, row_type, ${weekColumns}) VALUES\n` + mrpPayload.join(',\n') + ';';
    sqlStatements.push(mrpInsert);
  }

  // 3. Ekstrak Data Rekap
  console.log('Mengekstrak sheet Rekap...');
  const rekapData = xlsx.utils.sheet_to_json(workbook.Sheets['Rekap'], { header: 1 });
  const rekapPayload = [];
  
  const STANDARD_GROUPS = {
    'CDTI': 'Cokelat Kosongan Dark',
    'CWTI': 'Cokelat Kosongan White',
    'CMTI': 'Cokelat Kosongan Milk',
    'CDD': 'Cokelat Dark Isi Dodol',
    'CWD': 'Cokelat White Isi Dodol',
    'CMD': 'Cokelat Milk Isi Dodol'
  };
  
  let currentRekapGroup = 'All';

  for (const row of rekapData) {
    if (row[0] && typeof row[0] === 'string' && STANDARD_GROUPS[row[0]]) {
      currentRekapGroup = STANDARD_GROUPS[row[0]];
    }

    if (row[0] && typeof row[0] === 'string' && row[1] && typeof row[1] === 'string' && row[0] !== 'Kode' && row[0] !== 'Kode ' && row[1] !== 'Bahan Baku') {
      
      let weeksValues = [];
      for (let w = 1; w <= 48; w++) {
        const colIndex = w + 1; // Index 2 to 49
        weeksValues.push(parseFloat(row[colIndex]) || 0);
      }
      
      rekapPayload.push(`(
        ${escapeString(currentRekapGroup)},
        ${escapeString(row[0])},
        ${escapeString(row[1])},
        'pcs',
        'dibuat',
        ${weeksValues.join(', ')}
      )`);
    }
  }

  if (rekapPayload.length > 0) {
    const weekColumns = Array.from({ length: 48 }, (_, i) => `w${(i + 1).toString().padStart(2, '0')}`).join(', ');
    const rekapInsert = `INSERT INTO rekap_items (product_group, kode, bahan_baku, satuan, category, ${weekColumns}) VALUES\n` + rekapPayload.join(',\n') + ';';
    sqlStatements.push(rekapInsert);
  }

  // Menulis ke file seeder.sql
  console.log('Menulis file seeder.sql...');
  fs.writeFileSync('seeder.sql', sqlStatements.join('\n\n'));
  console.log('File seeder.sql berhasil dibuat dengan mapping product_group yang selaras!');
}

runSeeder();
