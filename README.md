# Maxkodia Tamagotchi Alienígena 🛸

Una aplicación web interactiva de tamagotchi con un personaje 3D alienígena animado, desarrollada con Three.js y JavaScript puro.

## 🚀 Características

- **Personaje 3D animado** con modelo GLB exportado desde Blender
- **Animaciones múltiples**: Idle (reposo) y Run (correr)
- **Interfaz interactiva** con controles para animar al personaje
- **Sistema de IA local** con respuestas contextuales y personalidad
- **Diseño responsive** y moderno
- **Controles de cámara** para inspeccionar el modelo 3D

## 📁 Estructura del Proyecto

```
Maxkodia-tamagotchi/
├── src/
│   ├── index.html          # Página principal
│   ├── main.js            # Lógica de Three.js y aplicación
│   ├── style.css          # Estilos CSS
│   ├── alien.glb          # Modelo 3D del alienígena
│   └── README.md          # Instrucciones del modelo
├── public/
│   └── README.md          # Instrucciones adicionales
└── README.md              # Este archivo
```

## 🛠️ Instalación y Configuración

### 1. Preparar el modelo 3D

1. **Exporta tu modelo desde Blender**:
   - Selecciona tu modelo alienígena
   - Ve a `File > Export > glTF 2.0 (.glb/.gltf)`
   - Marca las opciones: "Include Selected Objects", "Include Animations", "Include Textures"
   - Guarda como `alien.glb` en la carpeta `src/`

2. **Asegúrate de que las animaciones tengan los nombres correctos**:
   - `"Idle"` - Animación de reposo
   - `"Run"` - Animación de correr

### 2. Personalizar el Sistema de IA Local

El alienígena ya viene con un sistema de IA local configurado. Para personalizarlo:

1. **Modificar la personalidad**:
   - Abre `src/main.js`
   - Busca la sección `this.alienLore`
   - Modifica el nombre, especie, planeta de origen y personalidad

2. **Agregar nuevas respuestas**:
   - Busca `this.responseBank`
   - Agrega respuestas en las categorías existentes o crea nuevas

3. **Consultar la guía completa**:
   - Lee `src/ai-system-guide.md` para instrucciones detalladas

### 3. Ejecutar la aplicación

#### Opción A: Servidor local (recomendado)
```bash
# Instalar un servidor HTTP simple
npm install -g http-server

# Navegar al directorio src
cd src

# Iniciar el servidor
http-server -p 8080

# Abrir en el navegador: http://localhost:8080
```

#### Opción B: Python (si tienes Python instalado)
```bash
# Navegar al directorio src
cd src

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# Abrir en el navegador: http://localhost:8080
```

#### Opción C: Live Server (VS Code)
- Instala la extensión "Live Server" en VS Code
- Click derecho en `index.html`
- Selecciona "Open with Live Server"

## 🎮 Uso de la Aplicación

1. **Cargar el modelo**: El alienígena aparecerá automáticamente en la escena 3D
2. **Controles de cámara**: 
   - Click y arrastrar para rotar la vista
   - Scroll para hacer zoom
3. **Botón "¡Hacer Correr!"**: Cambia temporalmente a la animación de correr
4. **Botón "¡Hacer Hablar!"**: Genera una respuesta usando el sistema de IA local

## 🌐 Despliegue en Netlify

1. **Preparar para Netlify**:
   - Asegúrate de que tu modelo `alien.glb` esté en la carpeta `src/`
   - Personaliza el sistema de IA local si lo deseas

2. **Desplegar**:
   - Ve a [Netlify](https://netlify.com)
   - Arrastra la carpeta `src/` al área de deploy
   - Tu aplicación estará disponible en una URL de Netlify

3. **Configurar variables de entorno** (opcional):
   - En Netlify, ve a Site settings > Environment variables
   - Agrega `HUGGING_FACE_API_KEY` con tu API key
   - Modifica el código para usar `process.env.HUGGING_FACE_API_KEY`

## 🔧 Personalización

### Cambiar el modelo 3D
- Reemplaza `src/alien.glb` con tu nuevo modelo
- Asegúrate de que tenga las animaciones "Idle" y "Run"

### Modificar animaciones
- En `main.js`, busca la función `playAnimation()`
- Puedes agregar más animaciones modificando el objeto `this.animations`

### Personalizar el sistema de IA
- Lee `src/ai-system-guide.md` para instrucciones completas
- Modifica `this.alienLore` para cambiar la personalidad
- Agrega respuestas en `this.responseBank`

### Personalizar la interfaz
- Modifica `style.css` para cambiar colores, fuentes y layout
- Edita `index.html` para agregar más controles o información

## 🐛 Solución de Problemas

### El modelo no se carga
- Verifica que `alien.glb` esté en la carpeta `src/`
- Abre la consola del navegador (F12) para ver errores
- Asegúrate de que el archivo no esté corrupto

### Las animaciones no funcionan
- Verifica que las animaciones se llamen exactamente "Idle" y "Run"
- Revisa la consola del navegador para mensajes de error
- Asegúrate de que las animaciones estén configuradas para loop en Blender

### El sistema de IA no funciona
- Verifica que no haya errores en la consola del navegador
- Asegúrate de que las respuestas en `this.responseBank` estén bien formateadas
- Revisa que las variables `{name}`, `{species}`, etc. estén correctamente definidas

### Problemas de rendimiento
- Reduce la calidad de las sombras en `main.js`
- Optimiza tu modelo 3D en Blender
- Considera usar un modelo más simple para dispositivos móviles

## 📝 Tecnologías Utilizadas

- **Three.js** - Renderizado 3D en el navegador
- **JavaScript ES6+** - Lógica de la aplicación
- **HTML5** - Estructura de la página
- **CSS3** - Estilos y animaciones
- **Sistema de IA local** - Respuestas contextuales y personalidad

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

¡Disfruta tu tamagotchi alienígena! 👽✨ 