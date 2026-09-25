/* =====================================
   SCROLL TO TOP
===================================== */

const topButton = document.getElementById("topButton");

if (topButton) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      topButton.classList.add("show");
    } else {
      topButton.classList.remove("show");
    }
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}





/* =====================================
   SECTION ANIMATION
===================================== */

const sections = document.querySelectorAll(
  ".collaboration-left, .collaboration-middle, .japan-content, .footer-title, .footer-text, .footer-right, .who-we-are-content, .who-we-are-image, .about-raj-card, .venture-card, .promise-card, .trip-covers-card, .day-card, .outcome-card, .contact-box, .ambassador-bullets li, .award-photo-box, .legacy-item, .inspiring-card, .ambassador-contact-card"
);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach(section => {
    section.classList.add("reveal");
    sectionObserver.observe(section);
  });
}


/* =====================================
   NAV LINK ACTIVE STATE HANDLER
===================================== */

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", function () {
    navLinks.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});


/* =====================================
   MOBILE MENU TOGGLE
===================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinksContainer = document.getElementById("navLinks");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!menuToggle || !navLinksContainer) return;

  menuToggle.onclick = function (e) {
    e.stopPropagation();
    e.preventDefault();
    menuToggle.classList.toggle("open");
    navLinksContainer.classList.toggle("open");
  };

  document.addEventListener("click", function (e) {
    if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
      menuToggle.classList.remove("open");
      navLinksContainer.classList.remove("open");
    }
  });

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("open");
      navLinksContainer.classList.remove("open");
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileMenu);
} else {
  initMobileMenu();
}


