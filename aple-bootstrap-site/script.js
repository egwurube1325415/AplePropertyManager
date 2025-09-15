// Utilities
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

// Year
$("#year").textContent = new Date().getFullYear();

// Bootstrap toast helper
function showToast(msg){
  const toastEl = $("#toast .toast");
  $("#toastBody").textContent = msg;
  const t = new bootstrap.Toast(toastEl, { delay: 2200 });
  t.show();
}

// Referral Modal
const referralModal = new bootstrap.Modal('#referralModal');
$("#openReferralBtn")?.addEventListener("click", ()=> referralModal.show());
$("#openReferralBtn2")?.addEventListener("click", ()=> referralModal.show());

$("#saveReferralBtn").addEventListener("click", ()=>{
  const data = {
    referrer: $("#rReferrer").value.trim(),
    client: $("#rClient").value.trim(),
    email: $("#rEmail").value.trim(),
    phone: $("#rPhone").value.trim(),
    context: $("#rContext").value,
    notes: $("#rNotes").value.trim(),
    ts: new Date().toISOString(),
  };
  if(!data.referrer || !data.client || !data.phone || !data.context){
    showToast("Please complete required fields.");
    return;
  }
  localStorage.setItem("referral_"+Date.now(), JSON.stringify(data));
  referralModal.hide();
  $("#referralForm").reset();
  showToast("Referral saved. We’ll follow up.");
});

// Quick referral (hero card)
$("#quickReferralForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  showToast("Thanks! We’ll reach out shortly.");
  e.target.reset();
});

// Contact form
$("#contactForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const name = $("#cName").value.trim();
  const email = $("#cEmail").value.trim();
  const msg = $("#cMsg").value.trim();
  localStorage.setItem("contact_"+Date.now(), JSON.stringify({name,email,msg,ts:new Date().toISOString()}));
  e.target.reset();
  showToast(`Message sent. Thanks, ${name || "there"}!`);
});

// Services: search + filter
const serviceCards = $$("#serviceGrid .service");
function filterServices(q, tag){
  const query = (q||"").toLowerCase();
  const type = tag || "all";
  serviceCards.forEach(card=>{
    const text = card.textContent.toLowerCase();
    const tags = (card.dataset.tags||"").toLowerCase();
    const matchQ = !query || text.includes(query);
    const matchT = type==="all" || tags.includes(type);
    card.style.display = matchQ && matchT ? "" : "none";
  });
}
$("#serviceSearch").addEventListener("input", e=> filterServices(e.target.value, $("#serviceFilter").value));
$("#serviceFilter").addEventListener("change", e=> filterServices($("#serviceSearch").value, e.target.value));

// KPI counters (animate on scroll)
const counters = $$(".kpi-number");
let animated = false;
const observer = new IntersectionObserver((entries)=>{
  if (!animated && entries.some(e=>e.isIntersecting)){
    animated = true;
    counters.forEach(el => animateCounter(el));
  }
},{threshold:.35});
counters.forEach(el=> observer.observe(el));

function animateCounter(el){
  const target = Number(el.dataset.target || "0");
  const suffix = el.dataset.suffix || "";
  const prefix = el.dataset.prefix || "";
  const start = performance.now(), dur = 1200;
  function step(now){
    const p = Math.min(1, (now - start)/dur);
    const val = Math.floor(target * p);
    el.textContent = `${prefix}${val}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
