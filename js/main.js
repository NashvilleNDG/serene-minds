/**
 * SereneMind Therapy – Main JavaScript
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

    // Close menu when clicking a nav link (for anchor or same-page)
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

  /* --- Inquiry form (static: prevent submit, show message) --- */
  function initInquiryForm() {
    var form = document.querySelector(".inquiry-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var origHtml = btn.innerHTML;
        btn.innerHTML = '<span class="btn-icon" aria-hidden="true">✈</span> Message sent — we\'ll be in touch!';
        btn.disabled = true;
        setTimeout(function () {
          btn.innerHTML = origHtml;
          btn.disabled = false;
        }, 4000);
      }
    });
  }

  /* --- Contact form (validation + success message) --- */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

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

      if (successEl) {
        successEl.hidden = false;
        successEl.setAttribute("role", "status");
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Message sent";
      }
      form.reset();
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
