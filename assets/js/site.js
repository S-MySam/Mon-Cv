/* =========================================================
   MY SAM — Comportements communs à toutes les pages.
   Aucune dépendance. Tout dégrade proprement sans JS.
   ========================================================= */
(function () {
  "use strict";

  var cfg = window.MY_SAM || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STORE_KEY = "mysam.profile";

  /* --- Mémoire du profil (localStorage peut être bloqué) ------------- */
  var store = {
    get: function () {
      try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; }
    },
    set: function (v) {
      try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* mode privé */ }
    }
  };
  window.MySamProfile = store;

  if (document.body.dataset.profile) store.set(document.body.dataset.profile);

  /* --- Transition de page : voile d'encre --------------------------- */
  function leaveTo(href) {
    if (reduced) { window.location.href = href; return; }
    document.body.classList.add("is-leaving");
    var done = false;
    var go = function () { if (!done) { done = true; window.location.href = href; } };
    window.setTimeout(go, 460);           // durée de l'animation
    window.setTimeout(go, 1200);          // filet de sécurité
  }
  window.MySamLeave = leaveTo;

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition === "true") return;
    var url;
    try { url = new URL(a.href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;   // ancre interne
    if (!/\.html?$|\/$/.test(url.pathname)) return;                      // fichiers bruts

    e.preventDefault();
    if (a.dataset.profile) store.set(a.dataset.profile);
    leaveTo(url.href);
  });

  // Retour arrière (bfcache) : on nettoie l'état de sortie
  window.addEventListener("pageshow", function (ev) {
    if (ev.persisted) document.body.classList.remove("is-leaving");
  });

  /* --- Révélation au défilement -------------------------------------- */
  var targets = document.querySelectorAll(".reveal");
  if (targets.length && !reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    targets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* --- En-tête : filet au défilement --------------------------------- */
  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () {
      head.dataset.stuck = window.scrollY > 8 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Menu mobile ---------------------------------------------------- */
  var burger = document.querySelector(".burger");
  if (burger) {
    var nav = document.getElementById("site-menu");
    var toggle = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      document.body.dataset.menu = open ? "open" : "closed";
      if (open && nav) {
        var first = nav.querySelector("a");
        if (first) window.setTimeout(function () { first.focus(); }, 180);
      }
    };
    burger.addEventListener("click", function () {
      toggle(burger.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        toggle(false);
        burger.focus();
      }
    });
    if (nav) nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) toggle(false);
    });
  }

  /* --- Coordonnées : rendues depuis la configuration ------------------ */
  function renderCoord(node) {
    var key = node.dataset.coord;
    var value = (cfg[key] || "").trim();
    if (!value) {
      node.innerHTML = '<span class="todo">À compléter</span>';
      return;
    }
    var href = key === "email" ? "mailto:" + value
             : key === "phone" ? "tel:" + value.replace(/[^+\d]/g, "")
             : value;
    var label = key === "linkedin" ? "LinkedIn" : value;
    var link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    link.dataset.noTransition = "true";
    if (key === "linkedin") { link.target = "_blank"; link.rel = "noopener"; }
    node.replaceChildren(link);
  }
  document.querySelectorAll("[data-coord]").forEach(renderCoord);

  /* --- Pré-sélection du profil déjà choisi dans le parcours ----------- */
  var prefill = document.querySelector("[data-prefill-profile]");
  if (prefill) {
    var map = {
      entreprises: "entreprise",
      particuliers: "particulier",
      associations: "association",
      autre: "autre"
    };
    var known = map[store.get()];
    if (known) prefill.value = known;
  }

  /* --- Formulaire : actif seulement si un point de collecte existe ---- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var status = form.querySelector(".form__status");
    var submit = form.querySelector("button[type=submit]");
    var endpoint = (cfg.formEndpoint || "").trim();

    if (!endpoint) {
      form.querySelectorAll("input, textarea, select, button").forEach(function (el) {
        el.disabled = true;
      });
      if (status) {
        var mail = (cfg.email || "").trim();
        if (mail) {
          status.innerHTML = 'Le formulaire n’est pas encore relié à une boîte de réception. ' +
            'En attendant, écrivez directement à <a href="mailto:' + mail +
            '" data-no-transition="true" style="border-bottom:1px solid var(--hair-paper);">' + mail + '</a>.';
        } else {
          status.textContent = 'Le formulaire et les coordonnées s’activeront dès que l’adresse ' +
            'de contact de My Sam sera renseignée dans assets/js/config.js.';
        }
      }
      return;
    }

    form.setAttribute("action", endpoint);
    form.setAttribute("method", "POST");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submit) { submit.disabled = true; submit.textContent = "Envoi…"; }
      if (status) { status.removeAttribute("data-state"); status.textContent = ""; }

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        if (status) status.textContent = "Message reçu. Nous revenons vers vous rapidement.";
        if (submit) submit.textContent = "Envoyé";
      }).catch(function () {
        if (status) {
          status.dataset.state = "error";
          status.textContent = "L’envoi a échoué. Réessayez, ou écrivez-nous directement par e-mail.";
        }
        if (submit) { submit.disabled = false; submit.textContent = "Envoyer"; }
      });
    });
  }
})();
