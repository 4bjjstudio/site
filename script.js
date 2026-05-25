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
  // Celular brasileiro = 13 dígitos (55 + DDD + 9 + 8 dígitos).
  WHATSAPP_NUMBER: "5531983639858",

  // Mensagem pré-preenchida ao abrir o WhatsApp
  WHATSAPP_MESSAGE: "Olá! Vim pelo site do 4BJJ e gostaria de agendar uma aula experimental.",

  // E-mail de contato
  EMAIL: "4bjjstudio@gmail.com",

  // URL do perfil do Instagram
  INSTAGRAM_URL: "https://instagram.com/4bjjstudio",

  // Endereço completo do studio
  ADDRESS: "Av. Gen. Olímpio Mourão Filho, 301 — Planalto, Belo Horizonte/MG, 31720-200",

  // Horários de funcionamento (label livre + valor livre)
  HOURS: [
    { label: "Segunda · Quarta · Sexta", value: "16h00 – 17h00" },
    { label: "Segunda · Quarta · Sexta", value: "21h00 – 22h00" },
  ],

  // Embed do Google Maps:
  //   1) Abra https://maps.google.com → busque seu endereço
  //   2) "Compartilhar" → "Incorporar um mapa" → copie só a URL do src
  //   3) Cole abaixo. Se ficar vazio, o site mostra um placeholder gentil.
  MAP_EMBED_SRC: "https://www.google.com/maps?q=Av.+Gen.+Ol%C3%ADmpio+Mour%C3%A3o+Filho,+301,+Planalto,+Belo+Horizonte+-+MG,+31720-200&output=embed",
};

/* ============================================================
   2) Boot
   ============================================================ */
document.documentElement.classList.remove("no-js");
document.addEventListener("DOMContentLoaded", () => {
  setupImageFallbacks();
  applyContactInfo();
  setupHeader();
  setupNav();
  setupYear();
  setupReveal();
  loadGallery();
});

/* ============================================================
   Fallbacks de imagem (substitui onerror inline → CSP-friendly)
   ============================================================ */
function setupImageFallbacks() {
  // Logo: img com data-fallback → troca src se falhar
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      img.src = img.dataset.fallback;
    });
  });

  // Foto do professor: marca o container como is-broken se a img falhar
  document.querySelectorAll("img[data-photo-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      const container = img.closest(".teacher__photo");
      if (container) container.classList.add("is-broken");
    }, { once: true });
  });
}

/* ============================================================
   Sincroniza dados de contato a partir do SITE_CONFIG.
   Os hrefs já vêm preenchidos no HTML (degrade gracioso sem JS);
   esta função apenas atualiza se o operador trocar valor no script.
   ============================================================ */
function applyContactInfo() {
  const waHref = buildWhatsappUrl();
  document.querySelectorAll("#contact-whatsapp, #contact-whatsapp-cta, #whatsapp-float")
    .forEach((el) => el.setAttribute("href", waHref));

  const waText = document.getElementById("contact-whatsapp");
  if (waText) waText.textContent = formatPhone(SITE_CONFIG.WHATSAPP_NUMBER);

  const email = document.getElementById("contact-email");
  if (email && SITE_CONFIG.EMAIL) {
    email.href = `mailto:${SITE_CONFIG.EMAIL}`;
    email.textContent = SITE_CONFIG.EMAIL;
  }

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
    hours.replaceChildren(...SITE_CONFIG.HOURS.map(({ label, value }) => {
      const li = document.createElement("li");
      const strong = document.createElement("strong"); strong.textContent = label;
      const span = document.createElement("span"); span.textContent = value;
      li.append(strong, span);
      return li;
    }));
  }

  const map = document.getElementById("contact-map");
  if (map && map.childElementCount === 0) {
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
      const fb = document.createElement("p");
      fb.textContent = "Mapa indisponível.";
      map.appendChild(fb);
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
   Header: sombra/borda ao rolar + scrollspy estável
   ============================================================ */
function setupHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Scroll spy: rastreia ratios e destaca a seção com maior visibilidade
  const links = Array.from(document.querySelectorAll('.primary-nav a[href^="#"]'));
  const sectionsById = new Map();
  links.forEach((a) => {
    const sec = document.querySelector(a.getAttribute("href"));
    if (sec) sectionsById.set(sec.id, { section: sec, link: a, ratio: 0 });
  });
  if (!("IntersectionObserver" in window) || sectionsById.size === 0) return;

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const rec = sectionsById.get(entry.target.id);
      if (rec) rec.ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
    });
    let best = { id: null, ratio: 0 };
    for (const [id, { ratio }] of sectionsById) {
      if (ratio > best.ratio) best = { id, ratio };
    }
    if (best.id) setActive(best.id);
  }, { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

  for (const { section } of sectionsById.values()) io.observe(section);
}

/* ============================================================
   Menu mobile (com focus trap + inert no main + resize-safe)
   ============================================================ */
function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("primary-nav");
  const main = document.getElementById("main");
  if (!toggle || !nav) return;

  const FOCUSABLE = 'a[href], button:not([disabled])';
  let lastFocus = null;

  const isMobile = () => window.innerWidth <= 820;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
    if (main) main.removeAttribute("inert");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  };
  const open = () => {
    lastFocus = document.activeElement;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    nav.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (main) main.setAttribute("inert", "");
    const first = nav.querySelector(FOCUSABLE);
    first && first.focus();
  };

  toggle.addEventListener("click", () => {
    toggle.getAttribute("aria-expanded") === "true" ? close() : open();
  });

  // Fecha ao clicar em link âncora (uma vez só, via delegation)
  nav.addEventListener("click", (e) => {
    if (e.target.closest('a[href^="#"]') && isMobile()) close();
  });

  // ESC fecha
  document.addEventListener("keydown", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (e.key === "Escape") { close(); return; }

    // Focus trap dentro do menu
    if (e.key === "Tab") {
      const focusables = Array.from(nav.querySelectorAll(FOCUSABLE));
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && active === lastEl) { e.preventDefault(); firstEl.focus(); }
    }
  });

  // Resize seguro: se passar pra desktop com menu aberto, fecha estado
  window.addEventListener("resize", () => {
    if (!isMobile() && nav.classList.contains("is-open")) close();
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
   Reveal on scroll  (não aplica se o usuário pediu motion reduzido)
   ============================================================ */
function setupReveal() {
  const reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;  // mantém visível como veio do HTML

  const targets = document.querySelectorAll(
    ".section__head, .value-card, .card, .benefit, .testimonial, .teacher__photo, .teacher__bio, .hero__inner, .contact"
  );

  if (!("IntersectionObserver" in window)) return;  // sem IO: já visível, sem fade

  targets.forEach((el) => el.classList.add("reveal"));

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

  // Filtros (só se houver pelo menos 2 categorias)
  const categories = Array.from(new Set(items.map((i) => i.categoria).filter(Boolean)));
  if (filters && categories.length >= 2) {
    filters.innerHTML =
      `<button type="button" class="gallery__filter is-active" data-filter="*" aria-pressed="true">Todos</button>` +
      categories
        .map((c) => `<button type="button" class="gallery__filter" data-filter="${escapeAttr(c)}" aria-pressed="false">${escapeHtml(c)}</button>`)
        .join("");

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery__filter");
      if (!btn) return;
      filters.querySelectorAll(".gallery__filter").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      const filter = btn.dataset.filter;
      grid.querySelectorAll(".gallery__item").forEach((card) => {
        const match = filter === "*" || card.dataset.categoria === filter;
        card.style.display = match ? "" : "none";
      });
    });
  } else if (filters) {
    filters.hidden = true;
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
