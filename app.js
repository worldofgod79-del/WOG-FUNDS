// Paste your Supabase project URL and anon public key below.
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(n)||0);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const today=new Date().toISOString().slice(0,10);
document.querySelectorAll('input[type=date]').forEach(x=>x.value=today);

document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{
 document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 b.classList.add("active");document.getElementById(b.dataset.page).classList.add("active");
 if(b.dataset.page==="history") loadHistory();
});

async function loadAll(){
 const [{data:d,error:de},{data:e,error:ee}]=await Promise.all([
  db.from("donations").select("*").order("donation_date",{ascending:false}),
  db.from("expenses").select("*").order("expense_date",{ascending:false})
 ]);
 if(de||ee){showError(de||ee);return}
 const td=d.reduce((s,x)=>s+Number(x.amount),0),te=e.reduce((s,x)=>s+Number(x.amount),0);
 donations.textContent=money(td);expenses.textContent=money(te);balance.textContent=money(td-te);
 const tx=[
  ...d.map(x=>({id:x.id,type:"donation",date:x.donation_date,title:x.donor_name,amount:x.amount,meta:[x.purpose,x.payment_mode].filter(Boolean).join(" • ")})),
  ...e.map(x=>({id:x.id,type:"expense",date:x.expense_date,title:x.description,amount:x.amount,meta:x.category||""}))
 ].sort((a,b)=>b.date.localeCompare(a.date));
 recent.innerHTML=tx.slice(0,6).map(row).join("")||'<div class="empty">No transactions yet.</div>';
}
function row(x,del=false){
 return `<div class="tx"><div><div class="title">${esc(x.title)}</div><div class="meta">${esc(x.date)}${x.meta?" • "+esc(x.meta):""}</div></div><div><div class="amt ${x.type==="donation"?"in":"out"}">${x.type==="donation"?"+":"-"}${money(x.amount)}</div>${del?`<button class="del" onclick="removeTx('${x.type}','${x.id}')">Delete</button>`:""}</div></div>`;
}
async function loadHistory(){
 const [{data:d},{data:e}]=await Promise.all([
  db.from("donations").select("*").order("donation_date",{ascending:false}),
  db.from("expenses").select("*").order("expense_date",{ascending:false})
 ]);
 const all=[...(d||[]).map(x=>({id:x.id,type:"donation",date:x.donation_date,title:x.donor_name,amount:x.amount,meta:[x.purpose,x.payment_mode].filter(Boolean).join(" • "),remarks:x.remarks})),
 ...(e||[]).map(x=>({id:x.id,type:"expense",date:x.expense_date,title:x.description,amount:x.amount,meta:x.category||"",remarks:x.remarks}))];
 const q=(search.value||"").toLowerCase(), f=filter.value;
 const out=all.filter(x=>(f==="all"||x.type===f)&&`${x.title} ${x.meta} ${x.remarks||""}`.toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date));
 historyList.innerHTML=out.map(x=>row(x,true)).join("")||'<div class="empty">No matching transactions.</div>';
}
donationForm.onsubmit=async e=>{
 e.preventDefault();const f=new FormData(e.target);
 const {error}=await db.from("donations").insert({donation_date:f.get("date"),donor_name:f.get("donor_name"),amount:Number(f.get("amount")),payment_mode:f.get("payment_mode"),purpose:f.get("purpose"),reference:f.get("reference"),remarks:f.get("remarks")});
 if(error)return showError(error);e.target.reset();e.target.querySelector('[name=date]').value=today;alert("Donation saved");await loadAll();
};
expenseForm.onsubmit=async e=>{
 e.preventDefault();const f=new FormData(e.target);
 const {error}=await db.from("expenses").insert({expense_date:f.get("date"),description:f.get("description"),amount:Number(f.get("amount")),category:f.get("category"),remarks:f.get("remarks")});
 if(error)return showError(error);e.target.reset();e.target.querySelector('[name=date]').value=today;alert("Expense saved");await loadAll();
};
async function removeTx(type,id){
 if(!confirm("Delete this transaction?"))return;
 const table=type==="donation"?"donations":"expenses";
 const {error}=await db.from(table).delete().eq("id",id);
 if(error)return showError(error);await loadAll();await loadHistory();
}
function showError(e){alert("Database error: "+(e?.message||e));}
search.oninput=loadHistory;filter.onchange=loadHistory;
loadAll();
