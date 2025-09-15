// Helpers
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];
const toast = (msg) => {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2200);
};
const scrollToId = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth" });

// YEAR
$("#year").textContent = new Date().getFullYear();

// Mobile nav
$("#hamburger")?.addEventListener("click", () => $("#navLinks").classList.toggle("show"));

// Smooth active nav highlight
const links = $$(".nav-link");
const sections = links.map(a => document.querySelector(a.getAttribute("href")));
const onScroll = () => {
  const y = window.scrollY + 120;
  sections.forEach((sec, i) => {
    if (!sec) return;
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    links[i].classList.toggle("active", y >= top && y < bottom);
  });
};
document.addEventListener("scroll", onScroll);

// Accordion
$$(".accordion").forEach(acc => {
  $$(".accordion-header", acc).forEach(h => {
    h.addEventListener("click", () => {
      h.classList.toggle("active");
      const panel = h.nextElementSibling;
      if (panel) panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
  });
});

// Tabs
$$(".tabs").forEach(tabs => {
  const buttons = $$(".tab", tabs);
  const panels = $$(".tab-panel", tabs);
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      $("#" + btn.dataset.tab, tabs.parentElement).classList.add("active");
    });
  });
});

// Services: search + filter
const serviceGrid = $("#serviceGrid");
const serviceCards = $$(".service", serviceGrid);
$("#serviceSearch").addEventListener("input", e => filterServices(e.target.value, $("#serviceFilter").value));
$("#serviceFilter").addEventListener("change", e => filterServices($("#serviceSearch").value, e.target.value));
function filterServices(query, type){
  const q = (query || "").toLowerCase();
  serviceCards.forEach(card => {
    const tags = (card.dataset.tags || "").toLowerCase();
    const text = card.textContent.toLowerCase();
    const matchQ = !q || text.includes(q);
    const matchT = type === "all" || tags.includes(type);
    card.style.display = (matchQ && matchT) ? "block" : "none";
  });
}

// KPI counters (animate on view)
const counters = $$(".kpi-number");
let countersDone = false;
const obs = new IntersectionObserver((entries) => {
  if (!countersDone && entries.some(e => e.isIntersecting)) {
    countersDone = true;
    counters.forEach(el => animateCounter(el));
  }
}, { threshold: .3 });
counters.forEach(el => obs.observe(el));

function animateCounter(el){
  const target = Number(el.dataset.target || "0");
  const suffix = el.dataset.suffix || "";
  const prefix = el.dataset.prefix || "";
  const duration = 1200, start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start)/duration);
    const val = Math.floor(target * p);
    el.textContent = `${prefix}${val}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Quick referral form (hero)
$("#quickReferralForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  toast("Thanks! We’ll reach out shortly.");
  e.target.reset();
});

// Contact form
$("#contactForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  const name = $("#cName").value;
  const email = $("#cEmail").value;
  const msg = $("#cMsg").value;
  // Pretend send…
  localStorage.setItem("contact_"+Date.now(), JSON.stringify({name,email,msg}));
  toast(`Message sent. Thanks, ${name}!`);
  e.target.reset();
});

// Modal (Referral Intake)
const modal = $("#referralModal");
const openReferral = ()=> modal.showModal();
$("#openReferralBtn")?.addEventListener("click", openReferral);
$("#openReferralBtn2")?.addEventListener("click", openReferral);

// Save referral to localStorage
$("#saveReferralBtn").addEventListener("click", ()=>{
  const data = {
    referrer: $("#rReferrer").value,
    client: $("#rClient").value,
    email: $("#rEmail").value,
    phone: $("#rPhone").value,
    context: $("#rContext").value,
    notes: $("#rNotes").value,
    ts: new Date().toISOString(),
  };
  if(!data.referrer || !data.client || !data.phone || !data.context){
    toast("Please complete required fields.");
    return;
  }
  localStorage.setItem("referral_"+Date.now(), JSON.stringify(data));
  modal.close();
  toast("Referral saved. We’ll follow up.");
  // Clear fields
  ["rReferrer","rClient","rEmail","rPhone","rContext","rNotes"].forEach(id=>{ $("#"+id).value = "" });
});
