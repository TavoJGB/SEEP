const partials = [
  { target: document.getElementById("header-container"), file: "partials/cabecera.html" },
  { target: document.getElementById("proposito-container"), file: "partials/proposito.html" },
  { target: document.getElementById("actividades-container"), file: "partials/actividades.html" },
  { target: document.getElementById("asociacion-container"), file: "partials/asociacion.html" },
  { target: document.getElementById("footer-container"), file: "partials/pie.html" },
];

function setCurrentYear() {
  const currentYearElement = document.querySelector("#currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = String(new Date().getFullYear());
  }
}

function initMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("open");
    });

    menu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        menu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
}

function initRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  reveals.forEach((element) => observer.observe(element));
}

Promise.all(
  partials.map(({ target, file }) => {
    if (!target) return Promise.resolve();

    return fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar ${file}`);
        }
        return response.text();
      })
      .then((html) => {
        target.innerHTML = html;
      });
  })
)
  .then(() => {
    setCurrentYear();
    initMenu();
    initRevealAnimations();
  })
  .catch((error) => {
    console.error("Error loading sections:", error);
  });
