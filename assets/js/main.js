/* =====================================================================
   main.js – page behaviour for JOB PATH
   1. Toast helper          4. Password show/hide + confirm-match
   2. Form validation       5. Jobs page (data, render, filter, save, apply)
   3. File checks
   Everything is wrapped in a function so no variables leak globally.
   NOTE: there is no server yet – forms are validated and show a success
   message, but nothing is stored or sent. See GUIDE.md "Next steps".
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. TOAST HELPER ---------- */
  // showToast("Saved!", "success")  → small popup bottom-right (Bootstrap Toast)
  function showToast(message, type) {
    var box = document.getElementById("toastBox");
    if (!box) {
      box = document.createElement("div");
      box.id = "toastBox";
      box.className = "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(box);
    }
    var el = document.createElement("div");
    el.className = "toast text-bg-" + (type || "success") + " border-0";
    el.setAttribute("role", "status");
    el.innerHTML = '<div class="d-flex"><div class="toast-body"></div>' +
      '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>';
    el.querySelector(".toast-body").textContent = message;   // textContent = safe from HTML injection
    box.appendChild(el);
    var t = new bootstrap.Toast(el, { delay: 4000 });
    el.addEventListener("hidden.bs.toast", function () { el.remove(); });
    t.show();
  }

  /* ---------- 2. FORM VALIDATION ----------
     Any <form class="needs-validation" novalidate> is checked with the
     browser's built-in rules (required, type=email, minlength, pattern…).
     Optional attributes on the form:
       data-success="message to show"   data-redirect="page.html"          */
  document.querySelectorAll("form.needs-validation").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        var firstBad = form.querySelector(":invalid");
        if (firstBad) firstBad.focus();
        return;
      }
      if (form.id === "applyForm") return;            // handled in section 5
      showToast(form.dataset.success || "Done!", "success");
      form.reset();
      form.classList.remove("was-validated");
      if (form.dataset.redirect) {
        setTimeout(function () { window.location.href = form.dataset.redirect; }, 1500);
      }
    });
  });

  /* ---------- 3. FILE CHECKS (CV upload: pdf/doc/docx, max 5 MB) ---------- */
  document.querySelectorAll('input[type="file"][data-max-mb]').forEach(function (input) {
    input.addEventListener("change", function () {
      var f = input.files[0];
      var max = parseFloat(input.dataset.maxMb) * 1024 * 1024;
      input.setCustomValidity(f && f.size > max ? "File is too large" : "");
      if (f && f.size > max) showToast("That file is over " + input.dataset.maxMb + " MB.", "danger");
    });
  });

  /* ---------- 4. PASSWORD SHOW/HIDE + CONFIRM MATCH ---------- */
  document.querySelectorAll(".password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.querySelector(btn.dataset.target);
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = '<i class="bi ' + (show ? "bi-eye-slash" : "bi-eye") + '"></i>';
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  // <input data-match="#password"> must equal the field it points to
  document.querySelectorAll("input[data-match]").forEach(function (confirmInput) {
    var original = document.querySelector(confirmInput.dataset.match);
    function check() {
      confirmInput.setCustomValidity(confirmInput.value === original.value ? "" : "Passwords do not match");
    }
    confirmInput.addEventListener("input", check);
    original.addEventListener("input", check);
  });

  /* ---------- 5. JOBS PAGE ---------- */
  var grid = document.getElementById("jobGrid");
  if (!grid) return;                                   // not the jobs page → stop here

  // ADD A JOB: copy one object below. "category" must match a filter pill's data-filter.
  var JOBS = [
    { id: "ai-engineer", title: "AI Engineer", icon: "bi-cpu", category: "tech", categoryLabel: "Tech",
      mode: "Remote", modeTip: "Work from anywhere", type: "Full Time",
      duties: ["Prepare data pipelines", "Evaluate models for production", "Integrate models into applications"] },
    { id: "data-scientist", title: "Data Scientist", icon: "bi-graph-up-arrow", category: "tech", categoryLabel: "Tech",
      mode: "Hybrid", modeTip: "Part remote, part on-site", type: "Full Time",
      duties: ["Analyze data and frame business questions", "Explore data and analyze experiments", "Communicate findings"] },
    { id: "cyber-security-engineer", title: "Cyber Security Engineer", icon: "bi-shield-lock", category: "security", categoryLabel: "Security",
      mode: "On-site", modeTip: "Office based", type: "Full Time",
      duties: ["Design security controls", "Strengthen and harden systems", "Monitor, detect threats and respond to incidents"] },
    { id: "project-manager", title: "Project Manager", icon: "bi-kanban", category: "management", categoryLabel: "Management",
      mode: "On-site", modeTip: "Office based", type: "Full Time",
      duties: ["Build plans, manage budget and resources", "Coordinate people and make reports", "Monitor progress and define goals"] },
    { id: "web-developer", title: "Web Developer", icon: "bi-code-slash", category: "tech", categoryLabel: "Tech",
      mode: "Remote", modeTip: "Work from anywhere", type: "Full Time",
      duties: ["Build interfaces and write back-end logic", "Test and debug code", "Deploy, maintain and collaborate with designers and engineers"] }
  ];

  var MODE_BADGE = { "Remote": "bg-success", "Hybrid": "bg-warning text-dark", "On-site": "bg-secondary" };
  var activeFilter = "all";
  var searchInput = document.getElementById("searchInput");
  var noResults = document.getElementById("noResults");
  var countEl = document.getElementById("jobCount");

  // Saved jobs live in the browser (localStorage). try/catch because private
  // windows can block storage.
  function getSaved() { try { return JSON.parse(localStorage.getItem("jp_saved")) || []; } catch (e) { return []; } }
  function setSaved(list) { try { localStorage.setItem("jp_saved", JSON.stringify(list)); } catch (e) { /* ignore */ } }

  function renderJobs() {
    var saved = getSaved();
    grid.innerHTML = JOBS.map(function (j) {
      var isSaved = saved.indexOf(j.id) !== -1;
      return '<div class="col-lg-4 col-md-6 job-item" data-id="' + j.id + '" data-category="' + j.category + '">' +
        '<div class="uv-card job-card d-flex flex-column">' +
          '<div class="d-flex justify-content-between align-items-start mb-2">' +
            '<h2 class="card-title fw-bold mb-0 h5"><i class="bi ' + j.icon + ' text-primary me-2"></i>' + j.title + '</h2>' +
            '<button class="save-btn' + (isSaved ? " saved" : "") + '" type="button" aria-pressed="' + isSaved + '" aria-label="Save ' + j.title + '">' +
              '<i class="bi ' + (isSaved ? "bi-bookmark-fill" : "bi-bookmark") + '"></i></button>' +
          '</div>' +
          '<div class="mb-3">' +
            '<span class="badge ' + MODE_BADGE[j.mode] + ' me-1" title="' + j.modeTip + '">' + j.mode + '</span>' +
            '<span class="badge bg-primary-subtle text-primary me-1">' + j.categoryLabel + '</span>' +
            '<span class="badge bg-danger-subtle text-danger">' + j.type + '</span>' +
          '</div>' +
          '<ul class="list-group list-group-flush mb-3 flex-grow-1">' +
            j.duties.map(function (d) { return '<li class="list-group-item"><i class="bi bi-check2-circle text-success me-2"></i>' + d + '</li>'; }).join("") +
          '</ul>' +
          '<button class="uv-btn uv-btn-block apply-btn" type="button" data-bs-toggle="modal" data-bs-target="#applyModal" data-job="' + j.title + '">Apply Now</button>' +
        '</div></div>';
    }).join("");
    applyFilters();
  }

  function applyFilters() {
    var q = searchInput.value.trim().toLowerCase();
    var saved = getSaved();
    var visible = 0;
    grid.querySelectorAll(".job-item").forEach(function (item) {
      var okCat = activeFilter === "all" ||
        (activeFilter === "saved" ? saved.indexOf(item.dataset.id) !== -1 : item.dataset.category === activeFilter);
      var okSearch = item.textContent.toLowerCase().indexOf(q) !== -1;
      var show = okCat && okSearch;
      item.classList.toggle("d-none", !show);
      if (show) visible++;
    });
    noResults.classList.toggle("d-none", visible > 0);
    countEl.textContent = "Showing " + visible + " of " + JOBS.length + " jobs";
  }

  searchInput.addEventListener("input", applyFilters);

  document.querySelectorAll("#filterPills .nav-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#filterPills .nav-link").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  // One listener on the grid handles every bookmark button (event delegation)
  grid.addEventListener("click", function (e) {
    var btn = e.target.closest(".save-btn");
    if (!btn) return;
    var id = btn.closest(".job-item").dataset.id;
    var saved = getSaved();
    var i = saved.indexOf(id);
    if (i === -1) { saved.push(id); showToast("Job saved.", "primary"); } else { saved.splice(i, 1); }
    setSaved(saved);
    renderJobs();
  });

  // Apply modal: fill the position dropdown, pre-select the clicked job
  var applyModalEl = document.getElementById("applyModal");
  var jobSelect = document.getElementById("jobSelect");
  jobSelect.innerHTML = JOBS.map(function (j) { return "<option>" + j.title + "</option>"; }).join("");

  applyModalEl.addEventListener("show.bs.modal", function (event) {
    var job = event.relatedTarget && event.relatedTarget.dataset.job;
    if (job) {
      document.getElementById("modalJobTitle").textContent = job;
      jobSelect.value = job;
    }
  });
  jobSelect.addEventListener("change", function () {
    document.getElementById("modalJobTitle").textContent = jobSelect.value;
  });

  // Successful application: close modal, reset, toast
  var applyForm = document.getElementById("applyForm");
  applyForm.addEventListener("submit", function () {
    if (!applyForm.checkValidity()) return;           // validation section already flagged it
    bootstrap.Modal.getInstance(applyModalEl).hide();
    applyForm.reset();
    applyForm.classList.remove("was-validated");
    showToast("Application submitted successfully!", "success");
  });

  renderJobs();
})();
