/* Tensor Engineering Solutions — shared site behavior */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");
  var closeBtn = document.querySelector("[data-menu-close]");

  function openMenu() {
    if (!panel) return;
    panel.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    var firstLink = panel.querySelector("a");
    if (firstLink) firstLink.focus();
  }
  function closeMenu() {
    if (!panel) return;
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });
  }
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (panel) {
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shrink-on-scroll ---------- */
  var header = document.querySelector("[data-site-header]");
  if (header) {
    var lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        header.style.boxShadow = y > 8 ? "0 1px 0 var(--line)" : "none";
        lastY = y;
      },
      { passive: true }
    );
  }

  /* ---------- Active nav link ---------- */
  var here = document.body.getAttribute("data-page");
  if (here) {
    document.querySelectorAll("[data-nav-link]").forEach(function (a) {
      if (a.getAttribute("data-nav-link") === here) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Project / service filter ---------- */
  var filterRow = document.querySelector("[data-filter-row]");
  if (filterRow) {
    var buttons = Array.prototype.slice.call(
      filterRow.querySelectorAll("[data-filter]")
    );
    var items = document.querySelectorAll("[data-category]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        btn.setAttribute("aria-pressed", "true");
        var value = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-category") || "").split(" ");
          var match = value === "all" || cats.indexOf(value) !== -1;
          item.hidden = !match;
          if (!match) {
            var detail = item.querySelector("[data-project-detail]");
            if (detail) closeDetail(item);
          }
        });
      });
    });
  }

  /* ---------- Project detail expand (hash-routable) ---------- */
  function closeDetail(row) {
    var detail = document.getElementById(
      row.getAttribute("data-detail-target")
    );
    var trigger = row.querySelector("[data-project-trigger]");
    if (detail) detail.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }
  function openDetail(row) {
    document.querySelectorAll("[data-category]").forEach(function (r) {
      if (r !== row) closeDetail(r);
    });
    var detail = document.getElementById(
      row.getAttribute("data-detail-target")
    );
    var trigger = row.querySelector("[data-project-trigger]");
    if (detail) detail.classList.add("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }
  document.querySelectorAll("[data-project-trigger]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("[data-category]");
      var detail = document.getElementById(
        row.getAttribute("data-detail-target")
      );
      var isOpen = detail && detail.classList.contains("is-open");
      if (isOpen) {
        closeDetail(row);
        history.replaceState(null, "", window.location.pathname);
      } else {
        openDetail(row);
        history.replaceState(
          null,
          "",
          "#" + row.getAttribute("data-detail-target")
        );
        detail.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
  if (window.location.hash) {
    var targetId = window.location.hash.slice(1);
    var targetDetail = document.getElementById(targetId);
    if (targetDetail) {
      var row = targetDetail.closest("[data-category]");
      if (row) {
        openDetail(row);
        window.addEventListener("load", function () {
          targetDetail.scrollIntoView({ block: "start" });
        });
      }
    }
  }

  /* ---------- Reveal-on-load hero (single orchestrated moment) ---------- */
  var hero = document.querySelector("[data-hero-reveal]");
  if (hero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hero.classList.add("is-ready");
  } else if (hero) {
    hero.classList.add("is-ready");
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

//footer reuseability 
document.addEventListener("DOMContentLoaded", function () {
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("site-footer").innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading footer:", error);
        });
});