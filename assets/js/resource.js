/* =========================================================
   MY SAM — Ressource « CV annoté ».
   Sans JS, toutes les fiches de conseils restent affichées.
   Avec JS, on n'en montre qu'une : celle de la section ouverte.
   ========================================================= */
(function () {
  "use strict";

  var notes = document.getElementById("notes");
  if (!notes) return;

  var pins = Array.prototype.slice.call(document.querySelectorAll("[data-pin]"));
  var cards = Array.prototype.slice.call(notes.querySelectorAll("[data-note]"));
  var intro = document.getElementById("notes-intro");
  var closeBtn = document.getElementById("note-close");
  var wide = window.matchMedia("(min-width: 1060px)");
  var current = null;

  function show(key) {
    current = key;
    cards.forEach(function (c) { c.hidden = c.dataset.note !== key; });
    pins.forEach(function (p) { p.setAttribute("aria-expanded", String(p.dataset.pin === key)); });
    if (intro) intro.hidden = key !== null;
    notes.classList.toggle("is-open", key !== null && !wide.matches);
    if (key !== null && !wide.matches) {
      window.setTimeout(function () { notes.scrollTop = 0; }, 20);
    }
  }

  // État initial : aucune fiche ouverte, l'intro explique le mécanisme.
  show(null);

  pins.forEach(function (pin) {
    pin.addEventListener("click", function () {
      show(pin.dataset.pin === current ? null : pin.dataset.pin);
      if (current && wide.matches) {
        var card = notes.querySelector('[data-note="' + current + '"]');
        if (card) card.setAttribute("tabindex", "-1"), card.focus({ preventScroll: true });
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", function () {
    var key = current;
    show(null);
    var pin = key && document.querySelector('[data-pin="' + key + '"]');
    if (pin) pin.focus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !current) return;
    var pin = document.querySelector('[data-pin="' + current + '"]');
    show(null);
    if (pin) pin.focus();
  });

  // Au passage desktop/mobile, on remet la présentation en cohérence
  var onChange = function () { show(current); };
  if (wide.addEventListener) wide.addEventListener("change", onChange);
  else if (wide.addListener) wide.addListener(onChange);
})();
