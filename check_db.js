import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkDb() {
  const { data: bomData } = await supabase.from('bom_items').select('product_group').limit(100);
  const bomGroups = [...new Set(bomData.map(r => r.product_group))];
  
  const { data: mrpData } = await supabase.from('mrp_items').select('product_group').limit(100);
  const mrpGroups = [...new Set(mrpData.map(r => r.product_group))];
  
  const { data: mrpDesc } = await supabase.from('mrp_items').select('desc').limit(100);
  const mrpDescs = [...new Set(mrpDesc.map(r => r.desc))];

  console.log('--- BOM Groups ---');
  console.log(bomGroups);
  
  console.log('--- MRP Groups ---');
  console.log(mrpGroups);
  
  console.log('--- MRP Descs ---');
  console.log(mrpDescs);
}

checkDb();
