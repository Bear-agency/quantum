(function () {
  "use strict";

  function scrollToHash(href) {
    var id = href.replace(/^#/, "");
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initNav() {
    var root = document.getElementById("page-root");
    if (!root) return;

    root.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (!href || href === "#") return;
        e.preventDefault();
        closeMobileMenu();
        scrollToHash(href);
      });
    });

    document.querySelectorAll('[data-scroll-to]').forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-scroll-to");
        if (target) {
          closeMobileMenu();
          scrollToHash(target);
        }
      });
    });
  }

  var mobileMenuEl = null;
  var mobileToggleEl = null;
  var topNavEl = null;
  var mobileMenuBreakpoint = 900;

  function closeMobileMenu() {
    if (!mobileMenuEl || !mobileToggleEl) return;
    mobileMenuEl.classList.remove("is-open");
    mobileMenuEl.setAttribute("aria-hidden", "true");
    mobileToggleEl.setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-menu-open");
    if (topNavEl) topNavEl.classList.remove("mobile-open");
    var label = mobileToggleEl.querySelector(".mobile-toggle-label");
    if (label) label.textContent = "☰";
  }

  function initMobileMenu() {
    mobileMenuEl = document.getElementById("mobile-menu");
    mobileToggleEl = document.getElementById("mobile-menu-toggle");
    topNavEl = document.querySelector(".topNav");
    if (!mobileMenuEl || !mobileToggleEl) return;

    mobileToggleEl.addEventListener("click", function () {
      var open = mobileMenuEl.classList.toggle("is-open");
      mobileMenuEl.setAttribute("aria-hidden", open ? "false" : "true");
      mobileToggleEl.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("mobile-menu-open", open);
      if (topNavEl) topNavEl.classList.toggle("mobile-open", open);
      var label = mobileToggleEl.querySelector(".mobile-toggle-label");
      if (label) label.textContent = open ? "X" : "☰";
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > mobileMenuBreakpoint) closeMobileMenu();
    });
  }

  function prefersReducedMotion() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /** Stagger scroll-reveal delays among siblings (same parent) for a cascading effect */
  function initRevealStagger(root) {
    if (prefersReducedMotion()) return;
    var parents = new Set();
    root.querySelectorAll("[data-reveal='true']").forEach(function (el) {
      if (el.parentElement) parents.add(el.parentElement);
    });
    parents.forEach(function (parent) {
      var staggered = Array.prototype.filter.call(parent.children, function (node) {
        return node.getAttribute("data-reveal") === "true";
      });
      staggered.forEach(function (node, i) {
        node.style.setProperty("--reveal-delay", Math.min(i, 12) * 58 + "ms");
      });
    });
  }

  function initReveal() {
    var root = document.getElementById("page-root");
    if (!root) return;

    var items = root.querySelectorAll("[data-reveal='true']");
    if (!items.length) return;

    initRevealStagger(root);

    items.forEach(function (el) {
      el.classList.add("reveal");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealVisible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  var testimonials = [
    {
      name: "Alex M.",
      subtitle: "Trader indépendant",
      avatar: "assets/testimonial-avatar-alex.png",
      quote:
        "Les sessions m'ont permis de mieux comprendre les mouvements du marché. Je ne regarde plus les graphiques de la même manière",
    },
    {
      name: "Daniel K.",
      subtitle: "Analyste marchés",
      avatar: "assets/testimonial-avatar-daniel.png",
      quote:
        "Le rythme des sessions m'aide à rester régulier et à structurer mon analyse semaine après semaine",
    },
    {
      name: "Sarah L.",
      subtitle: "Membre active",
      avatar: "assets/testimonial-avatar-sarah.png",
      quote:
        "Les échanges après les sessions apportent beaucoup de clarté. On gagne du temps et on évite de partir dans toutes les directions",
    },
    {
      name: "Marc B.",
      subtitle: "Trader swing",
      avatar: "assets/testimonial-avatar-marc.png",
      quote:
        "Les débriefs m'ont appris à relire mes décisions sans me juger. Je progresse sur la discipline et la clarté des critères.",
    },
    {
      name: "Léa T.",
      subtitle: "Étudiante en finance",
      avatar: "assets/testimonial-avatar-lea.png",
      quote:
        "L'académie m'a donné un cadre pour ne plus tout mélanger. Je comprends enfin comment structurer une analyse avant d'agir.",
    },
    {
      name: "Youssef A.",
      subtitle: "Entrepreneur",
      avatar: "assets/testimonial-avatar-youssef.png",
      quote:
        "Peu de bruit, beaucoup de fond. Les sessions live et les replays m'aident à tenir un rythme d'apprentissage réaliste.",
    },
  ];

  var testimonialPage = 0;

  function renderTestimonials() {
    var row = document.getElementById("testimonials-row");
    if (!row) return;

    var pageSize = 3;
    var pageCount = Math.ceil(testimonials.length / pageSize);
    var p = ((testimonialPage % pageCount) + pageCount) % pageCount;
    var start = p * pageSize;
    var slice = testimonials.slice(start, start + pageSize);
    if (slice.length < pageSize) {
      slice = slice.concat(testimonials.slice(0, pageSize - slice.length));
    }

    row.innerHTML = "";
    slice.forEach(function (t, idx) {
      var article = document.createElement("article");
      article.className = "card testimonialCard testimonialCard--enter";
      if (!prefersReducedMotion()) {
        article.style.animationDelay = idx * 0.075 + "s";
      }
      var avatarSrc = t.avatar ? escapeHtml(t.avatar) : "";
      var subtitleHtml = t.subtitle
        ? '<p class="testimonialSubtitle">' + escapeHtml(t.subtitle) + "</p>"
        : "";
      article.innerHTML =
        '<div class="testimonialTop">' +
        '<div class="testimonialAvatarWrap" aria-hidden="true">' +
        '<img class="testimonialAvatar" src="' +
        avatarSrc +
        '" alt="" width="96" height="96" decoding="async" />' +
        "</div>" +
        '<div class="testimonialHead">' +
        '<p class="testimonialName">' +
        escapeHtml(t.name) +
        "</p>" +
        subtitleHtml +
        "</div>" +
        "</div>" +
        '<p class="testimonialQuote">“' +
        escapeHtml(t.quote) +
        "”</p>";
      row.appendChild(article);
    });
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initTestimonials() {
    var prev = document.getElementById("testimonial-prev");
    var next = document.getElementById("testimonial-next");
    if (prev)
      prev.addEventListener("click", function () {
        testimonialPage -= 1;
        renderTestimonials();
      });
    if (next)
      next.addEventListener("click", function () {
        testimonialPage += 1;
        renderTestimonials();
      });
    renderTestimonials();
  }

  function initFaq() {
    var faqRoot = document.getElementById("faq");
    if (!faqRoot) return;

    function openPanel(panel) {
      if (!panel) return;
      panel.style.transition = "none";
      panel.style.maxHeight = panel.scrollHeight + "px";
      void panel.offsetHeight;
      panel.style.transition = "";
    }

    function syncOpenPanels() {
      faqRoot.querySelectorAll(".faqItem.faqOpen .faqPanel").forEach(function (panel) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      });
    }

    faqRoot.querySelectorAll(".faqItem").forEach(function (item) {
      var btn = item.querySelector(".faqButton");
      var panel = item.querySelector(".faqPanel");
      if (!btn || !panel) return;

      btn.addEventListener("click", function () {
        var wasOpen = item.classList.contains("faqOpen");
        faqRoot.querySelectorAll(".faqItem").forEach(function (other) {
          other.classList.remove("faqOpen");
          var b = other.querySelector(".faqButton");
          var p = other.querySelector(".faqPanel");
          if (b) b.setAttribute("aria-expanded", "false");
          if (p) p.style.maxHeight = "0px";
        });
        if (!wasOpen) {
          item.classList.add("faqOpen");
          btn.setAttribute("aria-expanded", "true");
          openPanel(panel);
        }
      });
    });

    faqRoot.querySelectorAll(".faqItem.faqOpen .faqPanel").forEach(openPanel);
    window.addEventListener("resize", syncOpenPanels);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initMobileMenu();
    initReveal();
    initTestimonials();
    initFaq();
  });
})();
