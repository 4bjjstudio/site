/* =============================================================
   4BJJ — script.js
   Apenas JavaScript puro. Sem dependências externas.
   ============================================================= */

/* ============================================================
   1) CONFIGURAÇÃO EDITÁVEL
   ------------------------------------------------------------
   Altere os valores abaixo conforme as informações do studio.
   Tudo o que está aqui é refletido automaticamente no site.
   ============================================================ */
const SITE_CONFIG = {
  // WhatsApp completo no padrão internacional (DDI + DDD + número), sem espaços ou sinais.
  // Exemplo Brasil: "5511999999999"
  WHATSAPP_NUMBER: "5500000000000",

  // Mensagem pré-preenchida ao abrir o WhatsApp
  WHATSAPP_MESSAGE: "Olá! Vim pelo site do 4BJJ e gostaria de agendar uma aula experimental.",

  // URL do perfil do Instagram
  INSTAGRAM_URL: "https://instagram.com/4bjjstudio",

  // Endereço completo do studio
  ADDRESS: "Rua exemplo, 000 — Cidade/UF",

  // Horários de funcionamento (label livre + valor livre)
  HOURS: [
    { label: "Segunda a Sexta", value: "06h00 – 22h00" },
    { label: "Sábado",          value: "08h00 – 12h00" },
    { label: "Domingo",         value: "Fechado"        },
  ],

  // Embed do Google Maps:
  //   1) Abra https://maps.google.com → busque seu endereço
  //   2) "Compartilhar" → "Incorporar um mapa" → copie só a URL do src
  //   3) Cole abaixo. Se ficar vazio, o site mostra um placeholder gentil.
  MAP_EMBED_SRC: "",
};

/* ============================================================
   2) Boot
   ============================================================ */
document.documentElement.classList.remove("no-js");
document.addEventListener("DOMContentLoaded", () => {
  applyContactInfo();
  setupHeader();
  setupNav();
  setupYear();
  setupReveal();
  loadGallery();
});

/* ============================================================
   Aplica WhatsApp / Instagram / endereço / horários / mapa
   ============================================================ */
function applyContactInfo() {
  const waHref = buildWhatsappUrl();

  document.querySelectorAll('[id="contact-whatsapp"], #contact-whatsapp-cta, #whatsapp-float')
    .forEach((el) => el.setAttribute("href", waHref));

  const waText = document.getElementById("contact-whatsapp");
  if (waText) waText.textContent = formatPhone(SITE_CONFIG.WHATSAPP_NUMBER);

  const ig = document.getElementById("contact-instagram");
  if (ig) {
    ig.href = SITE_CONFIG.INSTAGRAM_URL;
    ig.textContent = SITE_CONFIG.INSTAGRAM_URL.replace(/^https?:\/\//, "");
  }

  const igGallery = document.getElementById("gallery-insta-link");
  if (igGallery) igGallery.href = SITE_CONFIG.INSTAGRAM_URL;

  const addr = document.getElementById("contact-address");
  if (addr) addr.textContent = SITE_CONFIG.ADDRESS;

  const hours = document.getElementById("contact-hours");
  if (hours) {
    hours.innerHTML = SITE_CONFIG.HOURS
      .map(({ label, value }) => `<li><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></li>`)
      .join("");
  }

  const map = document.getElementById("contact-map");
  if (map) {
    if (SITE_CONFIG.MAP_EMBED_SRC) {
      const iframe = document.createElement("iframe");
      iframe.src = SITE_CONFIG.MAP_EMBED_SRC;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.setAttribute("allowfullscreen", "");
      iframe.title = "Mapa de localização do 4BJJ";
      map.appendChild(iframe);
    } else {
      map.classList.add("contact__map--placeholder");
      map.innerHTML =
        "<div><p>Configure <code>SITE_CONFIG.MAP_EMBED_SRC</code> em <code>script.js</code> para exibir o mapa do Google.</p></div>";
    }
  }
}

function buildWhatsappUrl() {
  const num = SITE_CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "");
  const msg = encodeURIComponent(SITE_CONFIG.WHATSAPP_MESSAGE);
  return `https://wa.me/${num}?text=${msg}`;
}

function formatPhone(raw) {
  const d = (raw || "").replace(/\D/g, "");
  if (d.length === 13) {
    return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}`;
  }
  if (d.length === 12) {
    return `+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,8)}-${d.slice(8)}`;
  }
  return raw;
}

/* ============================================================
   Header: sombra/borda ao rolar + scrollspy
   ============================================================ */
function setupHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Scroll spy: destaca o link cuja seção está visível
  const links = document.querySelectorAll('.primary-nav a[href^="#"]');
  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((a) => a.classList.toggle(
        "is-active", a.getAttribute("href") === `#${id}`
      ));
    });
  }, { rootMargin: "-50% 0px -45% 0px", threshold: 0 });

  sections.forEach((s) => io.observe(s));
}

/* ============================================================
   Menu mobile
   ============================================================ */
function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
  };
  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    nav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  nav.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", () => {
      if (window.innerWidth <= 820) close();
    })
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) close();
  });
}

/* ============================================================
   Ano dinâmico no rodapé
   ============================================================ */
function setupYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* ============================================================
   Reveal on scroll
   ============================================================ */
function setupReveal() {
  const targets = document.querySelectorAll(
    ".section__head, .value-card, .card, .benefit, .testimonial, .teacher__photo, .teacher__bio, .hero__inner, .contact"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -80px 0px", threshold: 0.06 });

  targets.forEach((el) => io.observe(el));
}

/* ============================================================
   Galeria via fetch(data/galeria.json)
   ============================================================ */
async function loadGallery() {
  const grid = document.getElementById("gallery");
  const empty = document.getElementById("gallery-empty");
  const filters = document.getElementById("gallery-filters");
  if (!grid) return;

  let items = [];
  try {
    const res = await fetch("data/galeria.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    items = await res.json();
    if (!Array.isArray(items) || items.length === 0) throw new Error("vazio");
  } catch (err) {
    console.warn("[galeria] falha ao carregar:", err);
    if (empty) empty.hidden = false;
    grid.hidden = true;
    return;
  }

  // Filtros
  const categories = Array.from(new Set(items.map((i) => i.categoria).filter(Boolean)));
  if (filters && categories.length > 0) {
    filters.innerHTML =
      `<button class="gallery__filter is-active" data-filter="*" role="tab" aria-selected="true">Todos</button>` +
      categories
        .map((c) => `<button class="gallery__filter" data-filter="${escapeAttr(c)}" role="tab" aria-selected="false">${escapeHtml(c)}</button>`)
        .join("");

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery__filter");
      if (!btn) return;
      filters.querySelectorAll(".gallery__filter").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      const filter = btn.dataset.filter;
      grid.querySelectorAll(".gallery__item").forEach((card) => {
        const match = filter === "*" || card.dataset.categoria === filter;
        card.style.display = match ? "" : "none";
      });
    });
  }

  // Cards
  grid.innerHTML = items.map(renderGalleryCard).join("");

  // Tratamento de erro de imagem
  grid.querySelectorAll(".gallery__img").forEach((img) => {
    img.addEventListener("error", () => {
      img.remove();
    }, { once: true });
  });
}

function renderGalleryCard(item) {
  const titulo = escapeHtml(item.titulo || "");
  const categoria = escapeHtml(item.categoria || "");
  const src = escapeAttr(item.imagem || "");
  const initials = (item.titulo || "4BJJ")
    .split(/\s+/).filter(Boolean).slice(0, 3).map((w) => w[0].toUpperCase()).join("");
  return `
    <article class="gallery__item" data-categoria="${categoria}">
      <div class="gallery__fallback" aria-hidden="true"><span>${escapeHtml(initials)}</span></div>
      ${src ? `<img class="gallery__img" src="${src}" alt="${titulo}" loading="lazy" decoding="async">` : ""}
      <div class="gallery__caption">
        ${categoria ? `<span class="gallery__category">${categoria}</span>` : ""}
        <span class="gallery__title">${titulo}</span>
      </div>
    </article>`;
}

/* ============================================================
   Utilidades
   ============================================================ */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function escapeAttr(str) {
  return escapeHtml(str);
}
