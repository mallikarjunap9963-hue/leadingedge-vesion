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

/* =====================================
   DAY CARD PHOTO SWITCHER
===================================== */
function switchDayImg(btn) {
  const card = btn.closest('.day-card-new');
  if (!card) return;
  const img = card.querySelector('.day-img-wrapper img');
  const newSrc = btn.getAttribute('data-img');
  if (img && newSrc) {
    img.style.transition = 'opacity 0.2s ease';
    img.style.opacity = '0.3';
    setTimeout(() => {
      img.src = newSrc;
      img.style.opacity = '1';
    }, 150);
  }
  const tabs = card.querySelectorAll('.photo-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

/* =====================================
   MAGNIFIC POPUP LIGHTBOX FOR TOUR IMAGES
===================================== */
function initMagnificPopup() {
  let overlay = document.querySelector(".magnific-popup-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "magnific-popup-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <div class="magnific-popup-container">
        <button class="magnific-popup-close" aria-label="Close Popup">&times;</button>
        <div class="magnific-popup-img-wrapper">
          <img src="" alt="" class="magnific-popup-img" />
        </div>
        <div class="magnific-popup-footer">
          <span class="magnific-popup-caption"></span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const popupImg = overlay.querySelector(".magnific-popup-img");
  const popupCaption = overlay.querySelector(".magnific-popup-caption");
  const closeBtn = overlay.querySelector(".magnific-popup-close");

  function closePopup() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closePopup);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closePopup();
    }
  });

  const imgBoxes = document.querySelectorAll(".gallery-img-box");
  imgBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const img = box.querySelector("img");
      const label = box.querySelector(".gallery-img-label");
      if (!img) return;

      const src = img.getAttribute("src");
      let altText = label ? label.textContent.trim() : (img.getAttribute("alt") || "Tour Landmark");

      popupImg.src = src;
      popupImg.alt = altText;
      popupCaption.innerHTML = altText.startsWith("📍") ? altText : `📍 ${altText}`;

      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initMagnificPopup();
    initContactForm();
  });
} else {
  initMagnificPopup();
  initContactForm();
}


/* =====================================
   AJAX CONTACT FORM HANDLER (PHPMailer)
===================================== */
function initContactForm() {
  const forms = document.querySelectorAll("#enquiryForm, .touch-form");
  if (!forms || forms.length === 0) return;

  forms.forEach(form => {
    // Prevent duplicate listener attachments
    if (form.dataset.ajaxAttached) return;
    form.dataset.ajaxAttached = "true";

    // Remove any inline onsubmit attribute if present
    form.removeAttribute("onsubmit");

    let isSubmitting = false;

    // Locate or create the status alert banner inside the form
    let alertBox = form.querySelector(".form-status-alert");
    if (!alertBox) {
      alertBox = document.createElement("div");
      alertBox.className = "form-status-alert";
      alertBox.setAttribute("role", "alert");
      form.insertBefore(alertBox, form.firstChild);
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      if (isSubmitting) return;

      const submitBtn = form.querySelector('button[type="submit"], .touch-submit-btn');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "<span>SUBMIT ENQUIRY</span>";

      // Hide prior alerts
      alertBox.className = "form-status-alert";
      alertBox.innerHTML = "";
      alertBox.style.display = "none";

      // Construct FormData and capture values
      const formData = new FormData(form);

      // Support input IDs if name attributes aren't present
      const nameVal = (form.querySelector("#touchName")?.value || formData.get("name") || "").trim();
      const phoneVal = (form.querySelector("#touchPhone")?.value || formData.get("phone") || "").trim();
      const emailVal = (form.querySelector("#touchEmail")?.value || formData.get("email") || "").trim();
      const companyVal = (form.querySelector("#touchCompany")?.value || formData.get("company") || "").trim();
      const messageVal = (form.querySelector("#touchMessage")?.value || formData.get("message") || "").trim();

      formData.set("name", nameVal);
      formData.set("phone", phoneVal);
      formData.set("email", emailVal);
      formData.set("company", companyVal);
      formData.set("message", messageVal);

      // Track document.title as page_source
      formData.set("page_source", document.title || "Leading Edge Vision Website");

      // Validate required fields on client side
      if (!nameVal || !emailVal || !phoneVal || !messageVal) {
        showAlert(alertBox, "error", "Please fill in all required fields marked with *.");
        return;
      }

      // Show button loading state and prevent double submission
      isSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="btn-spinner" aria-hidden="true"></span>
          <span>Sending...</span>
        `;
      }

      try {
        const response = await fetch("send_mail.php", {
          method: "POST",
          body: formData
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success) {
          showAlert(alertBox, "success", data.message || "Thank you! Your enquiry has been sent successfully.");
          form.reset();
        } else {
          const errorMsg = (data && data.message) ? data.message : "Something went wrong while submitting the form. Please try again.";
          showAlert(alertBox, "error", errorMsg);
        }
      } catch (err) {
        console.error("Contact Form Fetch Error:", err);
        showAlert(alertBox, "error", "Unable to connect to the mail server. Please check your network connection and try again.");
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });
}

function showAlert(container, type, message) {
  if (!container) return;

  // Clear any existing auto-hide timeout
  if (container._hideTimeout) {
    clearTimeout(container._hideTimeout);
    container._hideTimeout = null;
  }

  // Reset inline styles
  container.style.opacity = "";
  container.style.transform = "";
  container.style.transition = "";
  container.style.display = "";

  const isSuccess = type === "success";
  container.className = `form-status-alert show ${isSuccess ? "alert-success" : "alert-error"}`;

  const iconSvg = isSuccess
    ? `<svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`
    : `<svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" /></svg>`;

  container.innerHTML = `
    ${iconSvg}
    <div class="alert-content">
      <span>${message}</span>
    </div>
    <button type="button" class="alert-close" aria-label="Dismiss alert">&times;</button>
  `;

  const closeBtn = container.querySelector(".alert-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (container._hideTimeout) {
        clearTimeout(container._hideTimeout);
        container._hideTimeout = null;
      }
      container.className = "form-status-alert";
      container.style.display = "none";
    });
  }

  // Auto-hide the success message after 5 seconds with smooth fade-out
  if (isSuccess) {
    container._hideTimeout = setTimeout(() => {
      container.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      container.style.opacity = "0";
      container.style.transform = "translateY(-6px)";

      setTimeout(() => {
        container.className = "form-status-alert";
        container.style.display = "none";
        container.style.opacity = "";
        container.style.transform = "";
        container.style.transition = "";
        container._hideTimeout = null;
      }, 600);
    }, 5000);
  }

  // Scroll gently into view so the user immediately notices the alert
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
}




