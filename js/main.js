/**
 * Serene Minds Psychotherapy – Main JavaScript
 * Accordion (FAQ) and mobile navigation (hamburger)
 * Vanilla JS, no frameworks.
 */

(function () {
  "use strict";

  /* --- Accordion (smooth open/close) --- */
  function initAccordion() {
    var triggers = document.querySelectorAll("[data-accordion-trigger]");
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var isExpanded = this.getAttribute("aria-expanded") === "true";
        var panelId = this.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        var item = this.closest(".accordion-item");

        if (isExpanded) {
          this.setAttribute("aria-expanded", "false");
          if (panel) panel.setAttribute("hidden", "");
          if (item) item.classList.remove("is-open");
        } else {
          this.setAttribute("aria-expanded", "true");
          if (item) item.classList.add("is-open");
          if (panel) panel.removeAttribute("hidden");
        }
      });
    });
  }

  /* --- Mobile nav (hamburger) --- */
  function initNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector("#main-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      nav.classList.toggle("is-open", !isOpen);
      this.setAttribute("aria-expanded", !isOpen);
      this.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      document.body.style.overflow = isOpen ? "" : "hidden";
    });

    var closeBtn = document.querySelector(".nav-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      });
    }

    // Close menu when clicking a nav link
    nav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      });
    });

    // Close on escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      }
    });
  }

  /* --- Inquiry form (Formspree submit + validation + success/error message) --- */
  function initInquiryForm() {
    var form = document.querySelector(".inquiry-form");
    if (!form) return;

    var formEndpoint = form.getAttribute("action");
    if (!formEndpoint || formEndpoint === "#") return;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function validateEmail(email) {
      return email && emailRegex.test(email.trim());
    }
    function showError(input) {
      input.classList.add("error");
      input.setAttribute("aria-invalid", "true");
    }
    function clearErrors() {
      form.querySelectorAll(".error").forEach(function (el) {
        el.classList.remove("error");
        el.removeAttribute("aria-invalid");
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var nameEl = form.querySelector("#inquiry-name");
      var emailEl = form.querySelector("#inquiry-email");
      var messageEl = form.querySelector("#inquiry-message");
      var successEl = form.querySelector("#inquiry-form-success");
      var submitBtn = form.querySelector('button[type="submit"]');

      var valid = true;
      if (!nameEl || !nameEl.value.trim()) {
        if (nameEl) showError(nameEl);
        valid = false;
      }
      if (!emailEl || !emailEl.value.trim()) {
        if (emailEl) showError(emailEl);
        valid = false;
      } else if (emailEl && !validateEmail(emailEl.value)) {
        showError(emailEl);
        valid = false;
      }
      if (!messageEl || !messageEl.value.trim()) {
        if (messageEl) showError(messageEl);
        valid = false;
      }
      if (!valid) {
        var firstInvalid = form.querySelector(".error");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-icon" aria-hidden="true">✈</span> Sending...';
      }
      if (successEl) {
        successEl.hidden = true;
        successEl.classList.remove("contact-form-success--error");
        successEl.textContent = "";
      }

      fetch(formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            if (successEl) {
              successEl.textContent = "Message sent — we'll be in touch within 24 hours.";
              successEl.hidden = false;
              successEl.setAttribute("role", "status");
            }
            if (submitBtn) {
              submitBtn.innerHTML = '<span class="btn-icon" aria-hidden="true">✈</span> Send Inquiry';
              submitBtn.disabled = false;
              submitBtn.textContent = "Message sent";
            }
            form.reset();
          } else {
            throw new Error("Form submission failed");
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-icon" aria-hidden="true">✈</span> Send Inquiry';
          }
          if (successEl) {
            successEl.textContent = "Something went wrong. Please try again or call (786) 972-7110.";
            successEl.classList.add("contact-form-success--error");
            successEl.hidden = false;
          }
        });
    });
  }

  /* --- Contact form (validation + Formspree submit + success message) --- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var formEndpoint = form.getAttribute("action");
    if (!formEndpoint) return;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateEmail(email) {
      return email && emailRegex.test(email.trim());
    }

    function showError(input) {
      input.classList.add("error");
      input.setAttribute("aria-invalid", "true");
    }

    function clearErrors() {
      form.querySelectorAll(".error").forEach(function (el) {
        el.classList.remove("error");
        el.removeAttribute("aria-invalid");
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var nameEl = form.querySelector("#contact-name");
      var emailEl = form.querySelector("#contact-email");
      var messageEl = form.querySelector("#contact-message");
      var successEl = form.querySelector("#contact-form-success");
      var submitBtn = form.querySelector('button[type="submit"]');

      var valid = true;
      if (!nameEl.value.trim()) {
        showError(nameEl);
        valid = false;
      }
      if (!emailEl.value.trim()) {
        showError(emailEl);
        valid = false;
      } else if (!validateEmail(emailEl.value)) {
        showError(emailEl);
        valid = false;
      }
      if (!messageEl.value.trim()) {
        showError(messageEl);
        valid = false;
      }

      if (!valid) {
        var firstInvalid = form.querySelector(".error");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      var originalSuccessText = successEl ? successEl.textContent : "";
      if (successEl) {
        successEl.hidden = true;
        successEl.classList.remove("contact-form-success--error");
      }

      fetch(formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            if (successEl) {
              successEl.textContent = originalSuccessText;
              successEl.hidden = false;
              successEl.setAttribute("role", "status");
            }
            if (submitBtn) {
              submitBtn.textContent = "Message sent";
            }
            form.reset();
          } else {
            throw new Error("Form submission failed");
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-icon" aria-hidden="true">✈</span> Send Message';
          }
          if (successEl) {
            successEl.textContent = "Something went wrong. Please try again or call (786) 972-7110.";
            successEl.classList.add("contact-form-success--error");
            successEl.hidden = false;
          }
        });
    });
  }

  /* --- Run on DOM ready --- */
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    initAccordion();
    initNavToggle();
    initInquiryForm();
    initContactForm();
  });
})();
