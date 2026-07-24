import { createClient } from '@supabase/supabase-js';
import * as xlsx from 'xlsx';
import 'dotenv/config';

// Inisialisasi Klien Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeeder() {
  console.log('Membaca file Excel...');
  const workbook = xlsx.readFile('Revisi MRP Excel.xlsx');
  
  // 1. Ekstrak Data BOM Rev
  const bomData = xlsx.utils.sheet_to_json(workbook.Sheets['BOM Rev'], { header: 1 });
  const bomPayload = [];
  let currentBomGroup = '';

  for (const row of bomData) {
    // Tangkap nama grup produk (Contoh: "Cokelat Kosongan Dark")
    if (row[1] && typeof row[1] === 'string' && row[1].includes('Cokelat')) {
      currentBomGroup = row[1];
    } 
    // Ambil baris data yang memiliki nomor urut
    else if (row[1] && !isNaN(row[1])) {
      bomPayload.push({
        product_group: currentBomGroup,
        no: row[1],
        level: row[2] || 0,
        kode: row[3] || '',
        bahan_baku: row[4] || '',
        quantity: row[5] || 0,
        satuan: row[6] || '',
        lead_time_minggu: row[7] || 0,
        lot_size: row[8] || 0,
        on_hand: row[9] || 0
      });
    }
  }

  // 2. Ekstrak Data MRP Revisi
  const mrpData = xlsx.utils.sheet_to_json(workbook.Sheets['MRP Revisi'], { header: 1 });
  const mrpPayload = [];
  let currentDesc = '';
  let currentPartNumber = '';
  let currentLevel = 0;
  
  const rowTypes = [
    'gross_requirement', 'schedule_receipts', 'projected_on_hand', 
    'net_requirement', 'planned_order_receipts', 'planned_order_release', 'sisa'
  ];

  for (let i = 0; i < mrpData.length; i++) {
    const row = mrpData[i];
    
    // Ambil metadata komponen
    if (row[2] === 'Desc.') currentDesc = row[5];
    if (row[2] === 'Part Number') currentPartNumber = row[4];
    if (row[8] === 'Level') currentLevel = parseFloat(row[10]) || 0;

    // Deteksi awal blok 7 baris perhitungan
    if (row[2] === 'Gross Requirement') {
      for (let j = 0; j < 7; j++) {
        const dataRow = mrpData[i + j];
        let payload = {
          product_group: currentDesc,
          no: mrpPayload.length / 7 + 1,
          desc: currentDesc,
          part_number: currentPartNumber,
          level: currentLevel,
          row_type: rowTypes[j],
        };
        
        // Loop kolom w01 hingga w48 (Index 4 sampai 51 di Excel)
        for (let w = 1; w <= 48; w++) {
          const colIndex = w + 3; 
          const weekKey = `w${w.toString().padStart(2, '0')}`;
          payload[weekKey] = dataRow[colIndex] || 0;
        }
        mrpPayload.push(payload);
      }
    }
  }

  // 3. Ekstrak Data Rekap
  const rekapData = xlsx.utils.sheet_to_json(workbook.Sheets['Rekap'], { header: 1 });
  const rekapPayload = [];
  
  for (const row of rekapData) {
    // Pastikan baris memiliki kode bahan baku dan nama bahan baku
    if (row[2] && typeof row[2] === 'string' && row[3] && typeof row[3] === 'string') {
      let payload = {
        product_group: 'All', 
        kode: row[2],
        bahan_baku: row[3],
        satuan: 'pcs',
        total: 0,
        category: 'dibuat' 
      };

      // Loop kolom w01 hingga w48 (Index 4 sampai 51)
      for (let w = 1; w <= 48; w++) {
        const colIndex = w + 3;
        const weekKey = `w${w.toString().padStart(2, '0')}`;
        payload[weekKey] = parseFloat(row[colIndex]) || 0;
      }
      rekapPayload.push(payload);
    }
  }

  console.log('Menyisipkan data ke Supabase...');
  
  // Masukkan data dalam batch agar aman dari limit timeout
  const { error: errBom } = await supabase.from('bom_items').insert(bomPayload);
  if (errBom) console.error('Error BOM:', errBom); else console.log('BOM sukses.');

  const { error: errMrp } = await supabase.from('mrp_items').insert(mrpPayload);
  if (errMrp) console.error('Error MRP:', errMrp); else console.log('MRP sukses.');

  const { error: errRekap } = await supabase.from('rekap_items').insert(rekapPayload);
  if (errRekap) console.error('Error Rekap:', errRekap); else console.log('Rekap sukses.');

  console.log('Seeder selesai!');
}

runSeeder();