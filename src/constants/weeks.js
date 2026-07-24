export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export const WEEKS = Array.from({ length: 48 }, (_, i) => {
  const month = MONTHS[Math.floor(i / 4)]
  const week = (i % 4) + 1
  return {
    key: `w${String(i + 1).padStart(2, '0')}`,
    label: `${month} W${week}`,
    month,
    week,
    monthIndex: Math.floor(i / 4)
  }
})
