import { supabase } from './supabase'

export async function getBomByProduct(productGroup) {
  const { data, error } = await supabase
    .from('bom_items')
    .select('*')
    .eq('product_group', productGroup)
    .order('no', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function getMrpByProduct(productGroup) {
  const { data, error } = await supabase
    .from('mrp_items')
    .select('*')
    .eq('product_group', productGroup)
    .order('no', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function getRekapByProduct(productGroup) {
  const { data, error } = await supabase
    .from('rekap_items')
    .select('*')
    .eq('product_group', productGroup)
    .order('kode', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function getAllRekap() {
  const { data, error } = await supabase
    .from('rekap_items')
    .select('*')
  
  if (error) throw error
  return data || []
}
