import ExcelJS from 'exceljs';
import {emptyPortfolio,validatePortfolio} from './state.js';
const cellValue=v=>v instanceof Date?v.toISOString().slice(0,10):v?.result??v?.text??(v?.richText?v.richText.map(x=>x.text).join(''):v??'');
const bool=v=>v===true||String(v).toLowerCase()==='true';
export async function readWorkbook(buffer){
 const wb=new ExcelJS.Workbook();await wb.xlsx.load(buffer);const p=emptyPortfolio();
 for(const sheet of wb.worksheets){
  const rows=[];sheet.eachRow({includeEmpty:false},r=>{const a=r.values.slice(1).map(cellValue);if(a.some(x=>x!==''))rows.push(a);});
  p.sourceSheets[sheet.name]=rows;
  if(sheet.name.toLowerCase()==='settings'){
   for(const [k,v] of rows)if(k)p.settings[String(k)]=String(v);continue;
  }
  const headers=rows[0]||[];const items=rows.slice(1).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]??''])));
  const key={transactions:'txns',transactions_bak:'backupTxns',assets:'assets',notes:'notes',othersources:'otherSources',deletedtxns:'deletedTxns'}[sheet.name.toLowerCase()];
  if(key)p[key]=items;
 }
 if(!Object.keys(p.sourceSheets).some(x=>x.toLowerCase()==='transactions'))throw Error('لم يتم العثور على ورقة Transactions');
 for(const key of ['txns','backupTxns','deletedTxns'])for(const t of p[key])t.date=String(t.date).slice(0,10);
 for(const a of p.assets)a.isGold=bool(a.isGold);
 for(const n of p.notes){n.pinned=bool(n.pinned);n.archived=bool(n.archived);}
 for(const s of p.otherSources)s.included=!(s.included===false||String(s.included).toLowerCase()==='false');
 // Preserve original sheet content, including old settings and backups, in the private database.
 // Supplied FMP keys stay in the authenticated user's private state, never in the build/repository.
 p.settings.notes=JSON.stringify(p.notes);validatePortfolio(p);return p;
}
export async function exportTransactions(txns){
 const wb=new ExcelJS.Workbook();wb.creator='ثروة';const ws=wb.addWorksheet('Transactions',{views:[{rightToLeft:false,state:'frozen',ySplit:1}]});
 const keys=['id','date','assetType','assetName','action','qty','price','fees','currency','rate','totalCostSAR','remarks','linkedTxnId','incomeType','sourceAssetId','sourceAssetName'];
 ws.columns=keys.map(key=>({header:key,key,width:key==='remarks'?38:key==='assetName'?25:18}));
 for(const t of [...txns].sort((a,b)=>a.date.localeCompare(b.date))){
  // Text values are always literal strings, never Excel formulas. IDs exported as text for exact round trips.
  ws.addRow({...t,id:String(t.id),linkedTxnId:t.linkedTxnId==null?'':String(t.linkedTxnId),sourceAssetId:t.sourceAssetId==null?'':String(t.sourceAssetId)});
 }
 ws.getRow(1).font={bold:true,color:{argb:'FFF5F3EB'}};ws.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF07372E'}};
 ws.autoFilter={from:'A1',to:'P1'};for(const k of ['qty','price','fees','rate','totalCostSAR'])ws.getColumn(k).numFmt='#,##0.00########';
 return wb.xlsx.writeBuffer();
}
export function download(buffer,name,type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
 const url=URL.createObjectURL(new Blob([buffer],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
