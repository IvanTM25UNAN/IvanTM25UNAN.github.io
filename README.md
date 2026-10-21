# Para Maria Asuncion

Página web romántica, de una sola página, minimalista y elegante en azul noche + plata.
Funciona sin base de datos, sin frameworks y sin servidor: son tres archivos.

```
maria-asuncion/
├── index.html
├── assets/
│   ├── styles.css
│   ├── app.js
│   └── fotos/          ← aquí van tus fotos (opcional)
├── .nojekyll
└── README.md
```

## Qué incluye

- **Portada** con luna, cielo de estrellas animado (canvas) y grano fino.
- **La carta**: tu mensaje completo, con revelado párrafo por párrafo al hacer scroll y capitular elegante.
- **Momentos**: seis tarjetas con arte de líneas en SVG (sin fotos, carga instantánea).
- **Recuerdos**: galería de fotos reemplazables. Si no hay fotos, la sección no aparece; si las hay, se ven con marco, pie de foto y se amplían al tocarlas.
- **Música**: reproductor de Spotify de *i miss you*, que **ella decide** si suena o no. Nada se reproduce solo.
- **Final**: "La quiero mucho." con corazón latiendo y botón para copiar el enlace.
- Navegación por puntos laterales, barra de progreso, botones suaves y desplazamiento animado.
- Diseño mobile-first (probado de 320 px a escritorio), con `safe-area` para iPhone.
- Respeta `prefers-reduced-motion`: si su teléfono tiene animaciones reducidas, todo se queda quieto y legible.
- La carta se imprime limpia (`Ctrl/Cmd + P`) si algún día quiere tenerla en papel.

## Ver la página en tu compu

Abre `index.html` con doble clic. Para probarla como se verá publicada (y que el botón de copiar enlace funcione bien), levanta un servidor local desde la carpeta:

```powershell
python -m http.server 8000
```

Y entra a `http://localhost:8000`.

## Cómo cambiar las cosas

### El nombre o el texto
Todo el contenido está en `index.html`. Busca y reemplaza ahí:
- `Maria Asuncion` → el nombre o apodo que quieras.
- Los párrafos dentro de `<article class="letter">` → tu mensaje.
- Las tarjetas de `<div class="grid">` → títulos y frases de cada momento.

> El mensaje ya está pasado por corrección ortográfica (tildes, "puntuables" → "puntuales", etc.)
> sin cambiar tus palabras ni el sentido. Si prefieres tus erratas originales, es solo reemplazar el texto.

### La canción
En `assets/app.js`, busca la constante `FUENTE`:

```js
const FUENTE = 'https://open.spotify.com/embed/track/65oSp7rdpLddlRGUgogU24?utm_source=generator&theme=0';
```

Para cambiarla: en Spotify, **Compartir → Copiar enlace de la canción**, y del enlace toma el ID
(`https://open.spotify.com/track/` **`ESTO_ES_EL_ID`** `?si=...`). Reemplaza el ID en la URL del `embed`.
Para que se vea más alto, cambia también el `height` de `.player-frame iframe` en `styles.css`.

### Fotos: la sección «Recuerdos»
Ya hay dos fotos puestas (`foto-1.jpg` y `foto-2.jpg`). Para agregar más, solo deja tus fotos en `assets/fotos/` con estos nombres:

```
assets/fotos/foto-1.jpg
assets/fotos/foto-2.jpg
assets/fotos/foto-3.jpg
assets/fotos/foto-4.jpg
assets/fotos/foto-5.jpg
assets/fotos/foto-6.jpg
```

- Se aceptan `.jpg`, `.webp` y `.png` (se buscan en ese orden).
- Las que falten simplemente no se muestran. Si no hay ninguna, la sección **no existe** (nadie ve marcos vacíos).
- Verticales se ven mejor: la tarjeta es 4:5. Ancho ideal 900–1200 px, menos de 500 KB.
- El texto debajo de cada foto se cambia en `index.html`, dentro de `<figcaption>`.
- Al tocar una foto se abre en grande (se cierra con la ×, tocando fuera o con `Esc`).

### Poner fotos en las tarjetas de «Momentos»
Si además quieres cambiar los dibujos de línea por fotos:
```html
<div class="card-art"><img src="assets/fotos/mar.jpg" alt="El mar" loading="lazy"></div>
```
```css
.card-art img{ width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:12px; opacity:.92; }
```
Para la portada, agrega la imagen bajo el `<h1>` o reemplaza `<div class="moon"></div>`.

### Después de editar, refresca la caché
Al final de `index.html` hay dos líneas con `?v=8`. Si cambias el CSS o el JS y no ves el cambio,
súbele el número (`?v=9`, `?v=10`...) para que los navegadores bajen la versión nueva.

### Colores y tipografía
Todo vive en `:root` al inicio de `assets/styles.css` (`--noche`, `--plata`, `--serif`, `--sans`).

---

## Publicarlo gratis con GitHub Pages (enlace permanente)

### Opción A — desde la web, sin instalar nada

1. Crea una cuenta en [github.com](https://github.com) si no tienes.
2. Botón **+ → New repository**. Nombre: `para-maria-asuncion`. Visibilidad: **Public**. Crea el repositorio.
3. En el repo vacío, clic en **uploading an existing file**.
4. Arrastra **el contenido de la carpeta** (`index.html`, `assets/`, `.nojekyll`, `README.md`).
   Ojo: debe quedar `index.html` en la raíz del repo, **no** dentro de otra carpeta.
5. **Commit changes**.
6. Ve a **Settings → Pages**.
   - *Source*: **Deploy from a branch**
   - *Branch*: **main** y carpeta **/ (root)**
   - **Save**
7. Espera 1–2 minutos y recarga Settings → Pages: aparecerá
   `https://TU-USUARIO.github.io/para-maria-asuncion/`

Ese es el enlace permanente que le compartes. Abre igual en el celular.

> Si nombras el repositorio exactamente `TU-USUARIO.github.io`, la dirección queda más corta:
> `https://TU-USUARIO.github.io/`

### Opción B — con git desde la terminal

```powershell
cd C:\Users\INFO-TIC\Documents\maria-asuncion
git init
git add .
git commit -m "Carta para Maria Asuncion"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/para-maria-asuncion.git
git push -u origin main
```

Luego activa Pages como en los pasos 6 y 7.

### Actualizar después
Edita los archivos y vuelve a subirlos (**Add file → Upload files** o `git add . ; git commit -m "cambio" ; git push`).
GitHub Pages publica el cambio en 1–2 minutos en el mismo enlace.

### Notas
- HTTPS gratis y certificado automático.
- El `.nojekyll` evita que GitHub procese los archivos con Jekyll; no lo borres.
- El reproductor de Spotify necesita internet. El resto de la página se ve perfecto sin conexión.
- Si algún día borras o haces privado el repositorio, el enlace deja de funcionar.

## Alternativa: Netlify Drop (30 segundos, sin repositorio)

Entra a [app.netlify.com/drop](https://app.netlify.com/drop), arrastra la carpeta `maria-asuncion`
completa y listo: te da un enlace `https://algo-random.netlify.app`. Puedes cambiarlo por algo
legible en *Site settings → Change site name*. Requiere una cuenta gratuita para conservarlo.

---

Hecho con calma. Solo para ella.
