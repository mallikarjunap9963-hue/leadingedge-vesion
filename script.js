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
    navDropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });
  });

  const navDropdowns = document.querySelectorAll(".nav-dropdown");
  navDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle("open");
      });
    }
  });

  navLinks.forEach(link => {
    if (!link.classList.contains("dropdown-toggle")) {
      link.addEventListener("click", function () {
        menuToggle.classList.remove("open");
        navLinksContainer.classList.remove("open");
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileMenu);
} else {
  initMobileMenu();
}


/* =====================================
   STATS COUNTER ANIMATION
===================================== */
function animateCounter(el) {
  const originalText = el.innerText.trim();
  const match = originalText.match(/^(\d+)(.*)$/);
  if (!match) return;

  const targetNum = parseInt(match[1], 10);
  const suffix = match[2] || "";
  const duration = 1800; // 1.8 seconds duration
  const frameRate = 60;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let currentFrame = 0;

  el.innerText = "0" + suffix;

  const timer = setInterval(() => {
    currentFrame++;
    const progress = currentFrame / totalFrames;
    // Cubic ease-out formula for smooth deceleration
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentNum = Math.floor(easeProgress * targetNum);

    el.innerText = currentNum + suffix;

    if (currentFrame >= totalFrames) {
      el.innerText = targetNum + suffix;
      clearInterval(timer);
    }
  }, 1000 / frameRate);
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-info strong");
  if (counters.length === 0) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    counters.forEach(counter => observer.observe(counter));
  } else {
    counters.forEach(counter => animateCounter(counter));
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCounters);
} else {
  initCounters();
}



