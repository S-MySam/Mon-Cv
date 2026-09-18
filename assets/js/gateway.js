/* =========================================================
   MY SAM — Porte d'entrée : réaction du fond, clavier,
   sortie animée. Sans JS, les liens fonctionnent déjà.
   ========================================================= */
(function () {
  "use strict";

  var gate = document.getElementById("gateway");
  if (!gate) return;

  var rows = Array.prototype.slice.call(gate.querySelectorAll(".row"));
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var LABELS = {
    entreprises: "Entreprises",
    particuliers: "Particuliers",
    associations: "Associations"
  };

  /* --- Le fond prend la teinte du profil visé ----------------------- */
  function tone(name) {
    gate.dataset.tone = name || "none";
    gate.style.setProperty("--tone", "var(--tone-" + (name || "neutre") + ")");
  }
  tone(null);

  rows.forEach(function (row) {
    var key = row.dataset.profile;
    ["mouseenter", "focus"].forEach(function (evt) {
      row.addEventListener(evt, function () { tone(key); });
    });
    ["mouseleave", "blur"].forEach(function (evt) {
      row.addEventListener(evt, function () { tone(null); });
    });
    // Marque la ligne choisie : elle reste pendant que le reste s'efface
    row.addEventListener("click", function () {
      rows.forEach(function (r) { r.classList.remove("is-chosen"); });
      row.classList.add("is-chosen");
    });
  });

  /* --- Le halo suit le curseur (desktop uniquement) ------------------ */
  if (fine && !reduced) {
    var px = 50, py = 40, queued = false;
    gate.addEventListener("pointermove", function (e) {
      px = (e.clientX / window.innerWidth) * 100;
      py = (e.clientY / window.innerHeight) * 100;
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        gate.style.setProperty("--mx", px.toFixed(2) + "%");
        gate.style.setProperty("--my", py.toFixed(2) + "%");
      });
    }, { passive: true });
  }

  /* --- Clavier : 1/2/3 pour choisir, flèches pour parcourir ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;

    var index = rows.indexOf(document.activeElement);

    if (e.key >= "1" && e.key <= String(rows.length)) {
      e.preventDefault();
      rows[Number(e.key) - 1].click();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      var step = e.key === "ArrowDown" ? 1 : -1;
      var next = index === -1
        ? (step === 1 ? 0 : rows.length - 1)
        : (index + step + rows.length) % rows.length;
      rows[next].focus();
    }
  });

  /* --- Reprise discrète du parcours précédent ------------------------ */
  var resume = document.getElementById("gw-resume");
  if (resume && window.MySamProfile) {
    var last = window.MySamProfile.get();
    if (last && LABELS[last]) {
      resume.href = last + ".html";
      resume.dataset.profile = last;
      resume.dataset.ready = "true";
      var slot = resume.querySelector("b");
      if (slot) slot.textContent = LABELS[last];
    }
  }
})();
