/* ============================================================
   Para Maria Asuncion
   Cielo animado, revelado al hacer scroll, navegación y música.
   ============================================================ */

const MENOS_MOVIMIENTO = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ── 1. Cielo de estrellas ──────────────────────────────── */
(function cielo() {
  const lienzo = document.getElementById('cielo');
  if (!lienzo) return;
  const ctx = lienzo.getContext('2d');
  if (!ctx) return;

  let ancho = 0;
  let alto = 0;
  let estrellas = [];
  let fugaz = null;
  let t = 0;
  let raf = null;

  function crearEstrellas() {
    const total = Math.round(Math.min(170, (ancho * alto) / 11000));
    estrellas = Array.from({ length: total }, () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: Math.random() * 1.05 + 0.35,
      fase: Math.random() * Math.PI * 2,
      vel: 0.25 + Math.random() * 0.85,
      prof: 0.3 + Math.random() * 0.7
    }));
  }

  function medir() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    lienzo.width = Math.floor(ancho * dpr);
    lienzo.height = Math.floor(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    crearEstrellas();
  }

  function dibujar(conTiempo) {
    ctx.clearRect(0, 0, ancho, alto);
    const desplazamiento = window.scrollY * 0.03;

    for (const e of estrellas) {
      const y = (((e.y - desplazamiento * e.prof) % alto) + alto) % alto;
      const brillo = conTiempo
        ? 0.2 + 0.55 * (0.5 + 0.5 * Math.sin(t * e.vel * 0.001 + e.fase))
        : 0.42;
      ctx.beginPath();
      ctx.arc(e.x, y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,224,252,${brillo.toFixed(3)})`;
      ctx.fill();
    }

    if (fugaz) {
      const grad = ctx.createLinearGradient(fugaz.x, fugaz.y, fugaz.x - fugaz.largo, fugaz.y - fugaz.largo * 0.45);
      grad.addColorStop(0, `rgba(255,255,255,${fugaz.alfa})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(fugaz.x, fugaz.y);
      ctx.lineTo(fugaz.x - fugaz.largo, fugaz.y - fugaz.largo * 0.45);
      ctx.stroke();
    }
  }

  function animar(ts) {
    t = ts || 0;

    if (!MENOS_MOVIMIENTO.matches) {
      if (!fugaz && Math.random() < 0.0035) {
        fugaz = {
          x: Math.random() * ancho * 0.8 + ancho * 0.2,
          y: Math.random() * alto * 0.45,
          largo: 90 + Math.random() * 70,
          alfa: 0.9
        };
      }
      if (fugaz) {
        fugaz.x -= 3.4;
        fugaz.y += 1.5;
        fugaz.alfa -= 0.012;
        if (fugaz.alfa <= 0) fugaz = null;
      }
    }

    dibujar(!MENOS_MOVIMIENTO.matches);
    if (!MENOS_MOVIMIENTO.matches) raf = requestAnimationFrame(animar);
  }

  function arrancar() {
    cancelAnimationFrame(raf);
    if (MENOS_MOVIMIENTO.matches) {
      dibujar(false);
    } else {
      raf = requestAnimationFrame(animar);
    }
  }

  medir();
  arrancar();

  let temporizador;
  window.addEventListener('resize', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      medir();
      arrancar();
    }, 180);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      arrancar();
    }
  });

  MENOS_MOVIMIENTO.addEventListener?.('change', arrancar);
})();

/* ── 2. Revelado al hacer scroll ────────────────────────── */
(function revelar() {
  const elementos = Array.from(document.querySelectorAll('.reveal'));
  if (!elementos.length) return;

  // escalonado dentro de cada bloque
  document.querySelectorAll('.hero-inner, .letter, .grid, .galeria, .final-inner, .section-head').forEach((grupo) => {
    grupo.querySelectorAll(':scope > .reveal').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 110, 660)}ms`;
    });
  });

  if (MENOS_MOVIMIENTO.matches) {
    elementos.forEach((el) => el.classList.add('en-vista'));
    return;
  }

  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('en-vista'));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('en-vista');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  elementos.forEach((el) => observador.observe(el));
})();

/* ── 3. Progreso y puntos de navegación ─────────────────── */
(function navegacion() {
  const barra = document.getElementById('progressBar');
  const secciones = Array.from(document.querySelectorAll('main section[id]'));
  const puntos = Array.from(document.querySelectorAll('.dots a'));
  let pendiente = false;

  function actualizar() {
    pendiente = false;

    if (barra) {
      const recorrido = document.documentElement.scrollHeight - window.innerHeight;
      const avance = recorrido > 0 ? window.scrollY / recorrido : 0;
      barra.style.width = `${Math.min(100, Math.max(0, avance * 100))}%`;
    }

    const referencia = window.innerHeight * 0.4;
    let visible = secciones[0]?.id;

    for (const seccion of secciones) {
      if (seccion.getBoundingClientRect().top <= referencia) visible = seccion.id;
    }

    puntos.forEach((punto) => {
      punto.classList.toggle('activo', punto.getAttribute('href') === `#${visible}`);
    });
  }

  window.addEventListener('scroll', () => {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(actualizar);
    }
  }, { passive: true });

  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();
})();

/* ── 4. Reproductor ─────────────────────────────────────── */
(function musica() {
  const marco = document.getElementById('playerFrame');
  const boton = document.getElementById('playSong');
  const atajo = document.getElementById('musicJump');
  const FUENTE = 'https://open.spotify.com/embed/track/65oSp7rdpLddlRGUgogU24?utm_source=generator&theme=0';
  let cargado = false;

  function cargar() {
    if (cargado || !marco) return;
    cargado = true;

    const reproductor = document.createElement('iframe');
    reproductor.src = FUENTE;
    reproductor.title = 'i miss you — reproductor de Spotify';
    reproductor.loading = 'lazy';
    reproductor.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';

    marco.replaceChildren(reproductor);
    marco.classList.add('sonando');
  }

  boton?.addEventListener('click', cargar);

  atajo?.addEventListener('click', () => {
    const destino = document.getElementById('musica');
    if (!destino) return;
    destino.scrollIntoView({ behavior: MENOS_MOVIMIENTO.matches ? 'auto' : 'smooth', block: 'start' });
    cargar();
    boton?.classList.add('pulse');
    setTimeout(() => boton?.classList.remove('pulse'), 2400);
  });
})();

/* ── 5. Copiar enlace y avisos ──────────────────────────── */
(function compartir() {
  const aviso = document.getElementById('toast');
  let temporizador;

  function mostrar(mensaje) {
    if (!aviso) return;
    aviso.textContent = mensaje;
    aviso.classList.add('visible');
    clearTimeout(temporizador);
    temporizador = setTimeout(() => aviso.classList.remove('visible'), 2600);
  }

  async function copiar(texto) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(texto);
        return true;
      }
    } catch (error) { /* seguimos con el respaldo */ }

    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(area);
    area.select();

    let listo = false;
    try { listo = document.execCommand('copy'); } catch (error) { listo = false; }

    area.remove();
    return listo;
  }

  document.getElementById('copyLink')?.addEventListener('click', async () => {
    const listo = await copiar(window.location.href);
    mostrar(listo ? 'Enlace copiado' : 'No se pudo copiar, pero puede copiarlo de la barra');
  });
})();

/* ── 6. Recuerdos: fotos reemplazables ──────────────────── */
(function recuerdos() {
  const seccion = document.getElementById('recuerdos');
  const galeria = document.getElementById('galeria');
  if (!seccion || !galeria) return;

  const extensiones = (galeria.dataset.extensiones || 'jpg,webp,png')
    .split(',')
    .map((ext) => ext.trim())
    .filter(Boolean);

  const figuras = Array.from(galeria.querySelectorAll('.foto'));

  function buscarFoto(figura) {
    return new Promise((resolver) => {
      const imagen = figura.querySelector('img');
      if (!imagen) { resolver(false); return; }

      // la sección empieza oculta: con lazy el navegador nunca intentaría cargar
      imagen.loading = 'eager';
      let intento = 0;

      const probar = () => {
        if (intento >= extensiones.length) {
          figura.remove();
          resolver(false);
          return;
        }
        imagen.src = `assets/fotos/${figura.dataset.archivo}.${extensiones[intento]}`;
        intento += 1;
      };

      imagen.addEventListener('load', () => resolver(true), { once: true });
      imagen.addEventListener('error', probar);
      probar();
    });
  }

  Promise.all(figuras.map(buscarFoto)).then((resultados) => {
    // sin fotos, la sección no existe: nada de marcos vacíos
    if (!resultados.some(Boolean)) {
      seccion.remove();
      return;
    }

    seccion.hidden = false;
    figuras.forEach((figura) => {
      figura.querySelector('img')?.addEventListener('click', () => abrirVisor(figura));
    });
  });

  let visor = null;

  function crearVisor() {
    visor = document.createElement('div');
    visor.className = 'visor';
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');
    visor.setAttribute('aria-label', 'Foto ampliada');
    visor.innerHTML = '<button class="visor-cerrar" type="button" aria-label="Cerrar">&times;</button><img alt="">';
    visor.querySelector('.visor-cerrar').addEventListener('click', cerrarVisor);
    visor.addEventListener('click', (evento) => {
      if (evento.target === visor) cerrarVisor();
    });
    document.body.appendChild(visor);
  }

  function abrirVisor(figura) {
    if (!visor) crearVisor();
    const imagen = figura.querySelector('img');
    const grande = visor.querySelector('img');
    grande.src = imagen.src;
    grande.alt = imagen.alt;
    visor.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    visor.querySelector('.visor-cerrar').focus();
  }

  function cerrarVisor() {
    if (!visor) return;
    visor.classList.remove('abierto');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && visor?.classList.contains('abierto')) cerrarVisor();
  });
})();
