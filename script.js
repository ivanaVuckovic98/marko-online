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
        // Trenutno jedina fokusabilna kontrola u modalu je dugme za zatvaranje.
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
