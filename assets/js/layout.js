/* =====================================================================
   layout.js – the shared header + footer for EVERY page.
   Each page only contains:
       <div id="site-header"></div>  ...page content...  <div id="site-footer"></div>
   and this script fills them in. Edit the menu or footer HERE once and
   all pages update. (Works from a double-clicked file too, unlike fetch().)
   The <body data-page="..."> value decides which menu link is highlighted.
   ===================================================================== */
(function () {
  "use strict";

  // Tells CSS that JavaScript is running (used by the scroll-reveal animation)
  document.documentElement.classList.add("js");

  var page = document.body.getAttribute("data-page") || "";

  // [data-page value, file, label] – add a row here to add a menu link
  var links = [
    ["home", "index.html", "Home"],
    ["jobs", "jobs.html", "Jobs"],
    ["about", "about.html", "About"],
    ["contact", "contact.html", "Contact"]
  ];

  var menu = links.map(function (l) {
    var active = l[0] === page;
    return '<li class="nav-item"><a class="nav-link' + (active ? " active" : "") + '" href="' + l[1] + '"' +
      (active ? ' aria-current="page"' : "") + ">" + l[2] + "</a></li>";
  }).join("");

  var headerHTML =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<nav class="navbar navbar-expand-lg jp-navbar sticky-top" aria-label="Main navigation">' +
      '<div class="container">' +
        '<a class="navbar-brand" href="index.html"><img src="assets/img/logo.jpeg" alt="JOB PATH – your career, one step ahead" class="brand-logo"></a>' +
        '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>' +
        '<div class="collapse navbar-collapse" id="mainNav">' +
          '<ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">' + menu +
            '<li class="nav-item ms-lg-3 mt-2 mt-lg-0"><a class="uv-btn-outline" href="login.html">Log in</a></li>' +
            '<li class="nav-item mt-2 mt-lg-0"><a class="uv-btn" href="register.html">Sign up</a></li>' +
          "</ul>" +
        "</div>" +
      "</div>" +
    "</nav>";

  var footerHTML =
    '<footer class="jp-footer">' +
      '<div class="container">' +
        '<div class="row g-4">' +
          '<div class="col-lg-5">' +
            '<img src="assets/img/logo.jpeg" alt="JOB PATH logo" class="footer-logo mb-3">' +
            '<p class="small mb-3">Discover exciting new opportunities in top industries and companies.</p>' +
            '<div class="footer-social">' +
              // TODO: replace each "#" with your real profile link
              '<a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>' +
              '<a href="#" aria-label="X (Twitter)"><i class="bi bi-twitter-x"></i></a>' +
              '<a href="mailto:info@jobpath.example" aria-label="Email us"><i class="bi bi-envelope"></i></a>' +
            "</div>" +
          "</div>" +
          '<div class="col-6 col-lg-3"><h6>Explore</h6><ul class="list-unstyled small">' +
            links.map(function (l) { return '<li class="mb-2"><a href="' + l[1] + '">' + l[2] + "</a></li>"; }).join("") +
          "</ul></div>" +
          '<div class="col-6 col-lg-4"><h6>Get started</h6><ul class="list-unstyled small">' +
            '<li class="mb-2"><a href="register.html">Register as a Job Seeker</a></li>' +
            '<li class="mb-2"><a href="register-employer.html">Register as an Employer</a></li>' +
            '<li class="mb-2"><a href="login.html">Log in</a></li>' +
          "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom text-center">&copy; <span id="year">2026</span> JOB PATH. All rights reserved.</div>' +
      "</div>" +
    "</footer>" +
    '<button class="back-to-top" id="backToTop" type="button" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>';

  var h = document.getElementById("site-header");
  var f = document.getElementById("site-footer");
  if (h) h.innerHTML = headerHTML;
  if (f) f.innerHTML = footerHTML;

  // Always show the current year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Back-to-top button appears after scrolling down
  var btt = document.getElementById("backToTop");
  if (btt) {
    window.addEventListener("scroll", function () {
      btt.classList.toggle("show", window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Fade-in on scroll for any element with class "reveal"
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in-view"); });
  }
})();
