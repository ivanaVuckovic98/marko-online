
 // Tehnički podaci o radovima: slike i godine. Tekstovi su u translations.js.
const projects = {
  "ona": {
    "year": 2024,
    "images": []
  },
  "hangover": {
    "year": 2025,
    "images": [
      "images/hangover1.jpeg",
      "images/hangover2.jpeg",
      "images/hangover3.jpeg"
    ]
  },
  "overhang": {
    "year": 2025,
    "images": [
      "images/overhang1.jpeg",
      "images/overhang2.jpeg"
    ]
  },

  "overscroll": {
    "year": 2026,
    "images": [
      "images/overscroll1.jpeg",
      "images/overscroll2.jpeg",
      "images/featured-overscroll.jpeg"
    ]
  },
  "severart": {
    "year": 2025,
    "images": [
      "images/severart1.jpeg",
      "images/severart2.jpeg",
      "images/severart3.jpeg"
    ]
  },

  "grill": {
    "year": 2024,
    "images": [
      "images/grill.jpeg"
    ]
  },

  "paintedgray": {
    "year": 2025,
    "type": "photobook",
    "images": Array.from(
      { length: 30 },
      (_, index) => `images/photobook/${index + 1}_result.jpg`
    )
  }
};

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const closeButton = document.getElementById("close-modal");
const menuToggle = document.getElementById("menu-toggle");
const mainNavigation = document.getElementById("main-navigation");

let currentLanguage = "en";
let currentProjectId = null;
let previousFocus = null;

function getText() {
    return translations[currentLanguage];
}

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value || "";
}

function renderLanguage() {
    const t = getText();
    document.documentElement.lang = currentLanguage;
    document.title = t.pageTitle;

    for (const key of ["home", "portfolio", "about", "contact"]) {
        setText(`.navigation a[href="#${key}"]`, t.navigation[key]);
    }
    setText(".home-label", t.home.label);
    setText(".home-title", t.home.title);
    setText(".home-statement", t.home.statement);
    setText(".about-section h2", t.about.heading);
    document.querySelectorAll(".about-section .about-copy").forEach((el, index) => {
        el.textContent = t.about.paragraphs[index] || "";
    });
    setText(".contact-section h2", t.contact.heading);
    setText(".contact-intro", t.contact.intro);
    setText(".contact-instagram", t.contact.instagram);

    document.querySelectorAll(".project[data-project]").forEach(card => {
        const id = card.dataset.project;
        const item = t.projects[id];
        if (!item) return;
        card.querySelector("h3").textContent = item.title;
        card.querySelector("p").textContent = item.type;
        card.setAttribute("aria-label", `${t.openGallery} ${item.title}`);
        const img = card.querySelector("img");
        if (img) img.alt = `${item.title}, ${projects[id].year}`;
    });

    document.querySelectorAll(".lang-btn").forEach(btn => {
        const active = btn.dataset.lang === currentLanguage;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
    });

    closeButton.setAttribute("aria-label", t.closeGallery);
    if (currentProjectId) renderProject(currentProjectId);
}

function changeLanguage(language) {
    if (!translations[language]) return;
    currentLanguage = language;
    try { localStorage.setItem("marko-language", language); } catch (_) {}
    renderLanguage();
}

function renderProject(id) {
    const project = projects[id];
    const t = getText();
    const translated = t.projects[id];
    if (!project || !translated) return;
    modalTitle.textContent = `${translated.title.toUpperCase()} — ${project.year}`;
    modalContent.replaceChildren();

    const inner = document.createElement("div");
    inner.className = "modal-inner";
    const description = document.createElement("div");
    description.className = "modal-description";
    const heading = document.createElement("h3");
    heading.textContent = t.aboutWork;
    description.appendChild(heading);
    translated.description.forEach(paragraph => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        description.appendChild(p);
    });

    const gallery = document.createElement("div");
    gallery.className = "modal-gallery";
    project.images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${translated.title} — ${t.imageLabel} ${index + 1}`;
        img.loading = index === 0 ? "eager" : "lazy";
        gallery.appendChild(img);
    });
    inner.append(description, gallery);
    modalContent.appendChild(inner);
    modalContent.scrollTop = 0;
}

function openProject(id) {
    if (!projects[id]) return;
    if (id === "paintedgray") {
        previousFocus = document.activeElement;
        openPhotobook();
        return;
    }
    previousFocus = document.activeElement;
    currentProjectId = id;
    renderProject(id);
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
}

function closeProject() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentProjectId = null;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
}

document.querySelectorAll(".project[data-project]").forEach(card => {
    card.addEventListener("click", () => openProject(card.dataset.project));
    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProject(card.dataset.project);
        }
    });
});
closeButton.addEventListener("click", closeProject);
modal.addEventListener("click", event => {
    if (event.target === modal) closeProject();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (currentProjectId) closeProject();
        else if (mainNavigation.classList.contains("is-open")) closeMobileMenu();
    }
    if (event.key === "Tab" && currentProjectId) {
        event.preventDefault();
        closeButton.focus();
    }
});

function closeMobileMenu() {
    mainNavigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", getText().openMenu);
    menuToggle.textContent = "☰";
}
menuToggle.addEventListener("click", () => {
    const open = mainNavigation.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? getText().closeMenu : getText().openMenu);
    menuToggle.textContent = open ? "×" : "☰";
});
mainNavigation.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobileMenu));
window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMobileMenu();
});
document.querySelectorAll(".lang-btn").forEach(button => {
    button.addEventListener("click", () => changeLanguage(button.dataset.lang));
});

try {
    const saved = localStorage.getItem("marko-language");
    if (saved && translations[saved]) currentLanguage = saved;
} catch (_) {}
renderLanguage();

/* =====================================
   PAINTED GRAY — PHOTOBOOK
   Prioritet naslovnice, kontrolisani background preload,
   ponovno koristenje vec ucitanih slika i ispravna rotacija.
===================================== */

const photobookModal = document.getElementById("photobook-modal");
const photobookPages = document.getElementById("photobook-pages");
const photobookCounter = document.getElementById("photobook-counter");
const photobookPrev = document.getElementById("photobook-prev");
const photobookNext = document.getElementById("photobook-next");
const photobookRotateLeft = document.getElementById("photobook-rotate-left");
const photobookRotateRight = document.getElementById("photobook-rotate-right");
const photobookClose = document.getElementById("close-photobook");
const photobookViewer = document.querySelector(".photobook-viewer");
const photobookImages = projects.paintedgray.images;

let currentBookPage = 0;
let currentBookRotation = 0;
let visibleBookImage = null;
let photobookRenderToken = 0;

// Svaki URL ucitavamo najvise jednom kroz ovaj sistem.
// Cuvamo Image objekat, ne samo URL, da ne stvaramo novi img pri listanju.
const photobookCache = new Map();

function loadPhotobookImage(index, priority = false) {
    if (index < 0 || index >= photobookImages.length) {
        return Promise.resolve(null);
    }

    if (photobookCache.has(index)) {
        return photobookCache.get(index).promise;
    }

    const img = new Image();
    img.alt = `Painted Gray — page ${index + 1}`;
    img.decoding = "async";
    if ("fetchPriority" in img) {
        img.fetchPriority = priority ? "high" : "low";
    }

    const record = { img, status: "loading", promise: null };
    record.promise = new Promise(resolve => {
        img.onload = async () => {
            // Dekodiranje unaprijed smanjuje zastajkivanje pri prikazu.
            if (typeof img.decode === "function") {
                try { await img.decode(); } catch (_) { /* slika je ipak ucitana */ }
            }
            record.status = "ready";
            resolve(img);
        };
        img.onerror = () => {
            record.status = "error";
            resolve(null);
        };
    });
    photobookCache.set(index, record);
    img.src = photobookImages[index];
    return record.promise;
}

// Ne pokrecemo 30 preuzimanja odjednom: pozadina radi sa dva paralelna.
let backgroundIndex = 1;
let backgroundActive = 0;
const BACKGROUND_LIMIT = 2;
let backgroundEnabled = false;

function scheduleBackgroundPhotobook() {
    if (!backgroundEnabled) return;
    while (backgroundActive < BACKGROUND_LIMIT && backgroundIndex < photobookImages.length) {
        const index = backgroundIndex++;
        // Ako je korisnik vec otvorio stranicu, zahtjev je vec u toku ili zavrsen.
        if (photobookCache.has(index)) continue;
        backgroundActive++;
        loadPhotobookImage(index).finally(() => {
            backgroundActive--;
            // Ostavimo browseru vremena za interakciju i ostatak stranice.
            if ("requestIdleCallback" in window) {
                window.requestIdleCallback(scheduleBackgroundPhotobook, { timeout: 1500 });
            } else {
                setTimeout(scheduleBackgroundPhotobook, 150);
            }
        });
    }
}

function startBackgroundPhotobook() {
    if (backgroundEnabled) return;
    backgroundEnabled = true;
    scheduleBackgroundPhotobook();
}

// Naslovnica pocinje da se ucitava cim se izvrsi script.js.
loadPhotobookImage(0, true);
// Ostale fotografije tek poslije ucitavanja osnovne stranice.
if (document.readyState === "complete") {
    setTimeout(startBackgroundPhotobook, 300);
} else {
    window.addEventListener("load", () => setTimeout(startBackgroundPhotobook, 300), { once: true });
}

function fitPhotobookImage() {
    if (!visibleBookImage || !visibleBookImage.naturalWidth || !photobookModal.classList.contains("is-open")) return;

    const width = photobookViewer.clientWidth;
    const height = photobookViewer.clientHeight;
    if (!width || !height) return;

    const rotated = currentBookRotation % 180 !== 0;
    const availableWidth = rotated ? height : width;
    const availableHeight = rotated ? width : height;
    const scale = Math.min(
        availableWidth / visibleBookImage.naturalWidth,
        availableHeight / visibleBookImage.naturalHeight
    );

    visibleBookImage.style.width = `${visibleBookImage.naturalWidth * scale}px`;
    visibleBookImage.style.height = `${visibleBookImage.naturalHeight * scale}px`;
    visibleBookImage.style.maxWidth = "none";
    visibleBookImage.style.maxHeight = "none";
    visibleBookImage.style.transform = `rotate(${currentBookRotation}deg)`;
    visibleBookImage.style.transformOrigin = "center center";
}

function renderPhotobook() {
    const index = currentBookPage;
    const token = ++photobookRenderToken;
    visibleBookImage = null;
    photobookPages.replaceChildren();

    const page = document.createElement("div");
    page.className = "photobook-page";
    photobookPages.appendChild(page);

    photobookCounter.textContent = `${index + 1} / ${photobookImages.length}`;
    photobookPrev.disabled = index === 0;
    photobookNext.disabled = index === photobookImages.length - 1;

    const record = photobookCache.get(index);
    if (!record || record.status === "loading") {
        const loading = document.createElement("span");
        loading.textContent = "Loading…";
        loading.setAttribute("role", "status");
        loading.style.cssText = "font-size:13px;color:#777;letter-spacing:.04em";
        page.appendChild(loading);
    }

    // Ako je slika vec spremna, ovaj callback se izvrsava bez mreze.
    loadPhotobookImage(index, true).then(img => {
        if (token !== photobookRenderToken || !photobookModal.classList.contains("is-open")) return;
        page.replaceChildren();
        if (!img) {
            const message = document.createElement("span");
            message.textContent = `Could not load page ${index + 1}.`;
            message.style.cssText = "font-size:13px;color:#777";
            page.appendChild(message);
            return;
        }
        // Premjestamo postojeci, vec ucitani img u viewer.
        img.style.display = "block";
        page.appendChild(img);
        visibleBookImage = img;
        fitPhotobookImage();
    });

    // Pripremamo susjedne fotografije odmah, ne cekamo pozadinski red.
    loadPhotobookImage(index + 1, true);
    loadPhotobookImage(index + 2, true);
    loadPhotobookImage(index - 1);
}

function openPhotobook() {
    previousFocus = document.activeElement;
    currentBookPage = 0;
    currentBookRotation = 0;
    photobookModal.classList.add("is-open");
    photobookModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderPhotobook();
    photobookClose.focus();
}

function closePhotobook() {
    photobookRenderToken++;
    photobookModal.classList.remove("is-open");
    photobookModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
}

function turnPhotobook(direction) {
    const next = Math.max(0, Math.min(currentBookPage + direction, photobookImages.length - 1));
    if (next === currentBookPage) return;
    currentBookPage = next;
    currentBookRotation = 0;
    renderPhotobook();
}

function rotatePhotobook(degrees) {
    currentBookRotation = (currentBookRotation + degrees + 360) % 360;
    // Ne kreiramo ponovo sliku pri rotaciji.
    fitPhotobookImage();
}

photobookPrev.addEventListener("click", () => turnPhotobook(-1));
photobookNext.addEventListener("click", () => turnPhotobook(1));
photobookRotateLeft.addEventListener("click", () => rotatePhotobook(-90));
photobookRotateRight.addEventListener("click", () => rotatePhotobook(90));
photobookClose.addEventListener("click", closePhotobook);

photobookModal.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closePhotobook();
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        turnPhotobook(1);
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        turnPhotobook(-1);
    }
});

window.addEventListener("resize", fitPhotobookImage);
