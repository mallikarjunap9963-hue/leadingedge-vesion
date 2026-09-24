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
  ".collaboration-left, .collaboration-middle, .japan-content, .footer-title, .footer-text, .footer-right"
);

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach(section => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "all .8s ease";
  sectionObserver.observe(section);
});


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


