const KEY="wog_funds_v1";
let data=JSON.parse(localStorage.getItem(KEY)||'{"donations":[],"expenses":[]}');

const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(n)||0);
const save=()=>{localStorage.setItem(KEY,JSON.stringify(data));render();};
const today=new Date().toISOString().slice(0,10);
document.querySelectorAll('input[type=date]').forEach(x=>x.value=today);

document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active"));
 btn.classList.add("active");document.getElementById(btn.dataset.tab).classList.add("active");
});

document.getElementById("donationForm").onsubmit=e=>{
 e.preventDefault();const f=new FormData(e.target);
 data.donations.push({id:crypto.randomUUID(),date:f.get("date"),donor:f.get("donor"),amount:+f.get("amount"),mode:f.get("mode"),purpose:f.get("purpose"),reference:f.get("reference"),remarks:f.get("remarks")});
 e.target.reset();e.target.querySelector('[name=date]').value=today;save();alert("Donation saved");
};
document.getElementById("expenseForm").onsubmit=e=>{
 e.preventDefault();const f=new FormData(e.target);
 data.expenses.push({id:crypto.randomUUID(),date:f.get("date"),description:f.get("description"),amount:+f.get("amount"),category:f.get("category"),remarks:f.get("remarks")});
 e.target.reset();e.target.querySelector('[name=date]').value=today;save();alert("Expense saved");
};

function allTx(){
 return [
  ...data.donations.map(x=>({...x,type:"donation",title:x.donor,meta:[x.date,x.purpose,x.mode].filter(Boolean).join(" • ")})),
  ...data.expenses.map(x=>({...x,type:"expense",title:x.description,meta:[x.date,x.category].filter(Boolean).join(" • ")}))
 ].sort((a,b)=>b.date.localeCompare(a.date));
}
function row(x,allowDelete=false){
 const sign=x.type==="donation"?"+":"-";
 return `<div class="tx"><div><div class="tx-title">${esc(x.title)}</div><div class="tx-meta">${esc(x.meta||"")}</div></div><div><div class="amount ${x.type==="donation"?"in":"out"}">${sign}${money(x.amount)}</div>${allowDelete?`<button onclick="removeTx('${x.type}','${x.id}')" style="border:0;background:none;color:#999;font-size:11px">Delete</button>`:""}</div></div>`;
}
function render(){
 const donations=data.donations.reduce((s,x)=>s+x.amount,0), expenses=data.expenses.reduce((s,x)=>s+x.amount,0);
 totalDonations.textContent=money(donations);totalExpenses.textContent=money(expenses);balance.textContent=money(donations-expenses);
 const tx=allTx();recent.innerHTML=tx.slice(0,6).map(x=>row(x)).join("")||'<div class="empty">No transactions yet.</div>';
 const q=(search.value||"").toLowerCase(), tf=typeFilter.value;
 const filtered=tx.filter(x=>(tf==="all"||x.type===tf)&&`${x.title} ${x.meta} ${x.remarks||""}`.toLowerCase().includes(q));
 historyList.innerHTML=filtered.map(x=>row(x,true)).join("")||'<div class="empty">No matching transactions.</div>';
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function removeTx(type,id){if(!confirm("Delete this transaction?"))return;data[type==="donation"?"donations":"expenses"]=data[type==="donation"?"donations":"expenses"].filter(x=>x.id!==id);save();}
search.oninput=render;typeFilter.onchange=render;
themeBtn.onclick=()=>document.body.classList.toggle("dark");
render();
