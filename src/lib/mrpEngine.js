import { WEEKS } from '../constants/weeks';

// WEEKS has { week: 1, key: 'w01', monthIndex: 0 }, etc. up to 48.
// We map Month 1-12 to specific weeks. Typically, we can just put the demand on the 1st week of the month.
const MONTH_START_WEEKS = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45];

export function calculateMRP(bomItems, demandData) {
  if (!bomItems || bomItems.length === 0) return [];

  // 1. Build component relationship and consolidate unique items
  const components = {}; // keyed by `kode`
  
  // Track the most recent item at each level to find parents
  const recentAtLevel = {};

  // Group BOM items
  bomItems.forEach((item) => {
    // Determine parent
    let parentKode = null;
    if (item.level > 0) {
      parentKode = recentAtLevel[item.level - 1];
    }
    recentAtLevel[item.level] = item.kode;

    if (!components[item.kode]) {
      components[item.kode] = {
        kode: item.kode,
        desc: item.bahan_baku,
        level: item.level,
        lead_time: item.lead_time_minggu || 0,
        lot_size: item.lot_size || 1, // Avoid divide by zero
        on_hand: item.on_hand || 0,
        satuan: item.satuan,
        parents: [],
      };
    } else {
      // If it exists, we might need to take the minimum level if it appears at multiple levels
      // Usually MRP calculates by low-level code
      components[item.kode].level = Math.min(components[item.kode].level, item.level);
    }

    if (parentKode) {
      components[item.kode].parents.push({
        parentKode,
        qty: item.quantity || 1
      });
    }
  });

  // 2. Sort components by Low-Level Code (level ascending)
  const sortedComponentKeys = Object.keys(components).sort((a, b) => components[a].level - components[b].level);

  // 3. Initialize MRP Data structures for 48 weeks
  const mrpResults = {}; // keyed by `kode`

  const initializeWeeks = () => {
    const weeks = {};
    for (let i = 1; i <= 48; i++) {
      weeks[`w${i.toString().padStart(2, '0')}`] = 0;
    }
    return weeks;
  };

  sortedComponentKeys.forEach(kode => {
    const comp = components[kode];
    
    // We will store 7 rows per component
    const rows = {
      gross_requirement: initializeWeeks(),
      schedule_receipts: initializeWeeks(),
      projected_on_hand: initializeWeeks(),
      net_requirement: initializeWeeks(),
      planned_order_receipts: initializeWeeks(),
      planned_order_release: initializeWeeks(),
      sisa: initializeWeeks(),
    };

    mrpResults[kode] = { comp, rows };
  });

  // 4. Calculate Top-Down
  sortedComponentKeys.forEach(kode => {
    const comp = components[kode];
    const mrp = mrpResults[kode].rows;

    // A. Calculate Gross Requirements
    if (comp.level === 0) {
      // Level 0 gets demand from demandData
      // demandData is an array of 12 values for Month 1-12
      demandData.forEach((qty, idx) => {
        if (qty > 0 && idx < MONTH_START_WEEKS.length) {
          const weekKey = `w${MONTH_START_WEEKS[idx].toString().padStart(2, '0')}`;
          mrp.gross_requirement[weekKey] += qty;
        }
      });
    } else {
      // Level > 0 gets demand from parent's Planned Order Release
      comp.parents.forEach(parentInfo => {
        const parentMrp = mrpResults[parentInfo.parentKode].rows.planned_order_release;
        for (let i = 1; i <= 48; i++) {
          const weekKey = `w${i.toString().padStart(2, '0')}`;
          const parentRelease = parentMrp[weekKey];
          if (parentRelease > 0) {
            mrp.gross_requirement[weekKey] += parentRelease * parentInfo.qty;
          }
        }
      });
    }

    // B. Calculate MRP logic week by week
    let currentOnHand = comp.on_hand;

    for (let i = 1; i <= 48; i++) {
      const weekKey = `w${i.toString().padStart(2, '0')}`;
      const gr = mrp.gross_requirement[weekKey];
      const sr = mrp.schedule_receipts[weekKey]; // Usually 0 in this sim
      
      const available = currentOnHand + sr - gr;
      
      let netReq = 0;
      let plannedReceipt = 0;

      if (available < 0) {
        netReq = Math.abs(available);
        
        // Calculate lot size needed
        const lotSize = comp.lot_size > 0 ? comp.lot_size : 1;
        let lotsNeeded = Math.ceil(netReq / lotSize);
        // If lot size is 1 or 0 (meaning L4L or Exact), we just order exact amount
        if (comp.lot_size === 0 || (comp.lot_size === 1 && comp.satuan !== 'pcs')) { 
           // Usually lot size 0 means L4L
           lotsNeeded = netReq;
           plannedReceipt = netReq;
        } else {
           plannedReceipt = lotsNeeded * lotSize;
        }

        currentOnHand = available + plannedReceipt;
      } else {
        currentOnHand = available;
      }

      mrp.projected_on_hand[weekKey] = currentOnHand;
      mrp.net_requirement[weekKey] = netReq;
      mrp.planned_order_receipts[weekKey] = plannedReceipt;

      // Planned Order Release (offset by lead time)
      if (plannedReceipt > 0) {
        const releaseWeekNum = i - comp.lead_time;
        if (releaseWeekNum > 0) {
          const releaseWeekKey = `w${releaseWeekNum.toString().padStart(2, '0')}`;
          mrp.planned_order_release[releaseWeekKey] = plannedReceipt;
        } else {
          // If past due (releaseWeekNum <= 0), we can just put it in w01 or handle as 'past_due'
          // We will just put it in w01 for simplicity in this simulation, or track a past_due field.
          mrp.planned_order_release['w01'] += plannedReceipt; 
        }
      }
    }
  });

  // 5. Flatten results into the structure expected by MrpDetailTable
  // Expected structure: array of objects with part_number, desc, level, lead_time, lot_size, on_hand, bom_uom, row_type, w01...w48
  const flattenedResults = [];
  
  // To keep the order similar to BOM
  const orderedKodes = [];
  bomItems.forEach(item => {
    if (!orderedKodes.includes(item.kode)) orderedKodes.push(item.kode);
  });

  orderedKodes.forEach(kode => {
    const { comp, rows } = mrpResults[kode];
    
    const rowTypes = [
      'gross_requirement', 'schedule_receipts', 'projected_on_hand', 
      'net_requirement', 'planned_order_receipts', 'planned_order_release', 'sisa'
    ];

    rowTypes.forEach(rt => {
      const rowData = {
        part_number: comp.kode,
        desc: comp.desc,
        level: comp.level,
        lead_time: comp.lead_time,
        lot_size: comp.lot_size,
        on_hand: comp.on_hand,
        satuan: comp.satuan,
        bom_uom: comp.satuan,
        row_type: rt,
        past_due: 0, // Placeholder
      };

      for (let i = 1; i <= 48; i++) {
        const wk = `w${i.toString().padStart(2, '0')}`;
        rowData[wk] = rows[rt][wk];
      }

      flattenedResults.push(rowData);
    });
  });

  return flattenedResults;
}
