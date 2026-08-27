/* ══════════════════════════════════════════════════════════════
   MOTO REFACCIONES KUALI — Interacciones de la landing
   Loader · Navbar · Menú móvil · Reveal · Contadores ·
   Marquee · Partículas del hero · Formulario → WhatsApp
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Número de WhatsApp de contacto — 52 + 10 dígitos */
  var WA_NUMBER = "526302016666";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Año dinámico en el footer ---------- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 2. Navbar: estado al hacer scroll ---------- */
    var navbar = document.getElementById("navbar");
    var onScroll = function () {
      if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- 3. Menú móvil ---------- */
    var hamburger = document.getElementById("hamburger");
    var mobMenu = document.getElementById("mob-menu");
    var toggleMenu = function (force) {
      var open = typeof force === "boolean" ? force : !hamburger.classList.contains("open");
      hamburger.classList.toggle("open", open);
      mobMenu.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    if (hamburger && mobMenu) {
      hamburger.addEventListener("click", function () { toggleMenu(); });
      mobMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { toggleMenu(false); });
      });
    }

    /* ---------- 4. Reveal al hacer scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
      var revObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { revObserver.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- 5. Animación del titular del hero ---------- */
    var heroTitle = document.getElementById("hero-heading");
    var heroBits = ["hero-sub", "hero-ctas", "hero-trust", "hero-badge"];
    window.setTimeout(function () {
      if (heroTitle) heroTitle.classList.add("in");
      heroBits.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add("in");
      });
    }, reduceMotion ? 0 : 350);

    /* ---------- 6. Contadores de estadísticas ---------- */
    var counters = document.querySelectorAll(".stat-num");
    var runCounter = function (el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (String(target).split(".")[1] || "").length;
      if (reduceMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }
      var dur = 1600, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var cObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cObserver.observe(el); });
    } else {
      counters.forEach(runCounter);
    }

    /* ---------- 7. Marquee de categorías ---------- */
    var marquee = document.getElementById("marquee");
    if (marquee) {
      var items = [
        "Cascos certificados", "Neumáticos", "Cámaras y corbatas", "Balatas y frenos",
        "Cadenas y kits de arrastre", "Aceites y lubricantes", "Baleros y retenes",
        "Espejos y micas", "Guardabarras", "Baúles y maletas", "Puños y manubrios",
        "Bujías", "Focos y LED", "Cables y chicotes", "Llantas para cuatrimoto"
      ];
      var buildRun = function () {
        var span = document.createElement("span");
        span.className = "marquee-item";
        span.textContent = items.join("  ·  ");
        return span;
      };
      // Se duplica el contenido para un bucle continuo
      marquee.appendChild(buildRun());
      marquee.appendChild(buildRun());
    }

    /* ---------- 8. Formulario de contacto → WhatsApp ---------- */
    var form = document.getElementById("wa-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (document.getElementById("f-name") || {}).value || "";
        var interest = (document.getElementById("f-interest") || {}).value || "";
        var msg = (document.getElementById("f-msg") || {}).value || "";

        if (!name.trim() || !msg.trim()) {
          form.querySelectorAll("[required]").forEach(function (el) {
            el.style.borderColor = el.value.trim() ? "" : "#ff6b6b";
          });
          return;
        }

        var text =
          "Hola Moto Refacciones Kuali, soy " + name.trim() + ".\n" +
          "Interés: " + interest + "\n" +
          "Mensaje: " + msg.trim();
        var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener");
      });

      form.querySelectorAll("[required]").forEach(function (el) {
        el.addEventListener("input", function () { el.style.borderColor = ""; });
      });
    }

    /* ---------- 9. Partículas del hero (orbes verdes) ---------- */
    initHeroCanvas();
  });

  /* ---------- Loader: se oculta cuando termina de cargar todo ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (!loader) return;
    window.setTimeout(function () {
      loader.classList.add("loaded");
      window.setTimeout(function () { loader.remove(); }, 700);
    }, 600);
  });

  /* ══════════════════════════════════════════════════════════
     Canvas del hero — orbes de luz verde a la deriva
     ══════════════════════════════════════════════════════════ */
  function initHeroCanvas() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var hero = document.getElementById("hero");
    var particles = [];
    var raf = null;

    function size() {
      var r = hero.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      build();
    }

    function build() {
      var count = Math.min(60, Math.floor(canvas.width / 26));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2.2 + 0.5,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          a: Math.random() * 0.5 + 0.1
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168, 225, 26, " + p.a + ")";
        ctx.shadowColor = "rgba(168, 225, 26, 0.8)";
        ctx.shadowBlur = 8;
        ctx.fill();

        // Líneas entre partículas cercanas
        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(168, 225, 26, " + (0.12 * (1 - dist / 120)) + ")";
            ctx.lineWidth = 0.6;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    size();
    tick();
    window.addEventListener("resize", function () {
      window.cancelAnimationFrame(raf);
      size();
      tick();
    });

    // Pausa el canvas cuando el hero no está visible
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!raf) tick();
          } else {
            window.cancelAnimationFrame(raf);
            raf = null;
          }
        });
      }, { threshold: 0.02 }).observe(hero);
    }
  }
})();
