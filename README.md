# Maxkodia Tamagotchi Alienígena

Este proyecto es una aplicación web interactiva tipo tamagotchi, donde interactuas con Amix, un alienígena del planeta Maxkodia del universo de NOXISTENCE que patrulla un escenario y reacciona a tus acciones. Puedes alimentarlo, interactuar con él y disfrutar de animaciones, sonidos y efectos visuales.

---

## 🚀 ¿Cómo funciona el proyecto?

### Estructura de carpetas

- **src/**  
  Código fuente principal (JS, CSS, HTML).
- **public/**  
  Archivos estáticos: sonidos, modelos 3D, fuentes, imágenes, etc.

### Principales funcionalidades

- **Amix (alienígena 3D):**
  - Patrulla automáticamente entre varios puntos del escenario (waypoints).
  - Puede hablar (IA local) cuando haces click sobre él, alternando sonidos de voz.
  - Cambia de animación según la acción: idle, run, dance, talk, eat.

- **Hojas (leaf.glb):**
  - Puedes arrastrar y soltar una hoja desde la esquina superior derecha hacia el escenario.
  - Solo puede haber una hoja a la vez en el tablero.
  - Al soltar la hoja, Amix interrumpe su patrulla, corre hacia la hoja y la “come” (la hoja desaparece y suena un efecto).
  - Tras comer, Amix reanuda su patrulla.

- **Sonidos:**
  - Al hablar, Amix alterna entre varios sonidos (`sound1.mp3`, `sound2.mp3`, `sound3.mp3`).
  - Al comer una hoja, suena `eating.mp3`.

- **Fuente alienígena:**
  - El texto de Amix aparece en una fuente especial y se “traduce” periódicamente a fuente normal.

- **Responsive y visual:**
  - El escenario y los paneles se adaptan a diferentes tamaños de pantalla.
  - El panel de respuesta mantiene su tamaño y proporción para evitar scrolls indeseados.

---

## 🛠️ ¿Cómo ejecutar el proyecto?

1. **Instala dependencias (si las hay):**
   ```bash
   npm install
   ```
2. **Ejecuta un servidor local:**
   ```bash
   npx serve public
   ```
   o
   ```bash
   python -m http.server 8000
   ```
   (Asegúrate de servir la carpeta raíz donde está el `public/`).

3. **Abre el navegador en**  
   `http://localhost:8000`  
   o la URL que te indique tu servidor.

---

## 📦 Despliegue en producción (Netlify, Vercel, etc.)

- **Mueve todos los archivos estáticos** (sonidos, modelos, fuentes, imágenes) a la carpeta `public/`.
- **Usa rutas absolutas** (por ejemplo, `/sound1.mp3`, `/leaf.glb`).
- **No dejes archivos estáticos en `src/`** al desplegar.
- **Verifica que puedes acceder a los archivos desde la URL pública** después del deploy.

---

## 🧑‍💻 Estructura de código relevante

- **main.js**  
  Lógica principal de la app, animaciones, movimiento, interacción, sonidos.
- **style.css**  
  Estilos visuales, responsive, fuentes.
- **index.html**  
  Estructura base de la app.
- **public/**  
  Recursos estáticos (modelos, sonidos, fuentes).

---

## 📝 Prompt de resumen para retomar el proyecto

> **Prompt para retomar el proyecto:**
>
> “Este proyecto es un tamagotchi alienígena 3D interactivo en web. Amix patrulla el escenario, puede hablar (con sonidos alternos), comer hojas que el usuario arrastra y suelta, y reacciona con animaciones y sonidos. Los recursos estáticos están en `public/` y las rutas son absolutas. El movimiento y la lógica de interacción están centralizados en `main.js`. El despliegue requiere que todo lo estático esté en `public/` y que las rutas sean absolutas. Retoma el desarrollo agregando nuevas interacciones, mejoras visuales o guardado de progreso.”

---

## ✨ Sugerencias para futuras mejoras

- Contador de hojas comidas.
- Animaciones especiales al comer o hablar.
- Guardado de progreso en localStorage.
- Personalización de Amix y del escenario.
- Mini-juegos o retos.

---
