# Atómica 1 Radio - Web Player Oficial

Reproductor web moderno, responsivo y de alto rendimiento para **Atómica 1 Radio** (*"La Descubre Bombazos"*), diseñado para el repositorio GitHub `atomicauno`.

Inspirado en la estética visual del logo oficial: anillos orbitales atómicos interactivos, tonos neón magenta, cian eléctrico, verde lima y cromo sobre fondo de alto contraste.

---

## ⚡ Características Principales

- **Transmisión de Audio Continua y de Baja Latencia**:
  - Servidor Icecast HTTPS con codificación AAC a 128 Kbps en directo (`https://str1.mediatelekom.net:8049/stream`).
  - Reconexión inteligente ante fluctuaciones de red.
  - Soporte de metadatos del sistema con `navigator.mediaSession` (muestra título, artista y carátula en pantallas de bloqueo y mandos de coche por Bluetooth).
- **Metadatos en Tiempo Real Replicados en el Player**:
  - Consulta automática de la emisión en directo para mostrar el artista y título de la pista que suena en cada instante.
  - Slogan oficial: *"La Descubre Bombazos"*.
- **Historial de Canciones Recientes con Carátulas Dinámicas**:
  - Sistema de colores de alto contraste optimizado para máxima legibilidad.
  - Búsqueda y descarga automática de carátulas en alta resolución (600x600 px) mediante la API pública y gratuita de iTunes (sin coste mensual ni claves privadas).
  - Botón para copiar el título de cualquier canción emitida.
- **Mensaje en Tiempo Real a Cabina (`programacion@atomica.uno`)**:
  - Botón integrado en el reproductor para enviar saludos, dedicatorias o peticiones musicales directamente a la radio sin interrumpir la música ni la experiencia visual.
- **Visualizador de Audio Espectral**:
  - Anillos orbitales atómicos que reaccionan a la amplitud de la señal.
  - Espectro de frecuencias con gradiente neón reactivo.
- **Modo Oscuro Automático y Manual**:
  - Detección automática según la configuración del sistema operativo (`prefers-color-scheme`).
  - Selector manual: *Automático (SO)*, *Oscuro*, *Claro*.
- **Herramientas de Control**:
  - Control de volumen y silenciado rápido.
  - Temporizador de apagado automático (*Sleep Timer* de 15, 30, 45, 60, 90 minutos).
- **100% Gratuito y de Código Abierto**:
  - No consume créditos de Google Cloud ni requiere APIs de facturación mensual.
  - Listo para hospedar de manera gratuita en GitHub Pages, Vercel, Netlify o Cloudflare Pages.

---

## 🚀 Despliegue en GitHub Pages (atomicauno)

Para alojar esta aplicación de forma 100% gratuita en tu repositorio `atomicauno` de GitHub:

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Probar en local**:
   ```bash
   npm run dev
   ```

3. **Compilar para producción**:
   ```bash
   npm run build
   ```
   La carpeta `dist/` contendrá todos los archivos estáticos listos para desplegar en GitHub Pages.

---

## 📄 Licencia

Código abierto bajo licencia Apache 2.0. Desarrollado para Atómica 1 Radio.
