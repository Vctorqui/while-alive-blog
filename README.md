# while(alive) – Blog de cuentos cortos y pensamientos

> **while(alive)** – un refugio minimalista donde la literatura y el código convergen.  
> En *Modo Cuaderno* el sitio se viste de papel y tinta; en *Modo Terminal* adopta la estética de un editor de código, pero siempre mantiene la claridad y accesibilidad para cualquier lector.

---

## Tabla de contenidos

- [Visión general](#visión-general)  
- [Características principales](#características-principales)  
- [Modo Cuaderno vs. Modo Terminal](#modo-cuaderno-vs-modo-terminal)  
- [Instalación y desarrollo](#instalación-y-desarrollo)  
- [Contribución](#contribución)  

---

## Visión general

**while(alive)** es una aplicación web **Next.js** (v16) diseñada para compartir cuentos cortos, pensamientos y preguntas en formato de texto plano.  
El proyecto prioriza una experiencia de lectura limpia y accesible, al mismo tiempo que ofrece a los usuarios más técnicos la posibilidad de interactuar con una interfaz que evoca la línea de comandos.

---

## Características principales

- **Dual experience**: cambia entre *Modo Cuaderno* (serif, literario) y *Modo Terminal* (monoespaciado, estilo consola) con un toggle en el Header.  
- **Persistencia de tema** en `localStorage`.  
- **Feed filtrable** con etiquetas literarias o comandos de terminal (`ls --all`, `ls --stories`, `cat logs/`).  
- **Micro‑manifiesto** dinámico bajo el Header, adaptado al modo activo.  
- **Formulario de creación** de historias y micro‑posts, con validación y UI coherente a cada modo.  
- **SEO**: título, descripción y metadatos optimizados.  
- **Tema responsive** y soporte para modo claro/oscuro mediante `next-themes`.  

---

## Modo Cuaderno vs. Modo Terminal

| Aspecto | Modo Cuaderno (predeterminado) | Modo Terminal |
|--------|--------------------------------|--------------|
| **Tipografía** | `font-serif` (Lora) en itálicas para el logo `*while alive.*` | `font-mono` (Geist Mono) para el logo ``while(alive) { … }`` |
| **Etiquetas de filtro** | “Todo”, “Cuentos”, “Pensamientos” | `ls --all`, `ls --stories`, `cat logs/` |
| **Micro‑manifiesto** | “Entre la precisión de las ideas y la imperfección de la palabra escrita…” | `// Compilando ideas en prosa…` (texto con opacidad `text-stone-500`) |
| **Prefijos** | Sin símbolos `$`, `~` o `//` | Prefijo visual `$` solo en comandos, sin símbolos en contenido. |
| **Estética** | Paleta cálida, papel/ink, bordes suaves | Paleta fría, colores del código, cursor intermitente. |

El toggle está junto al control de modo claro/oscuro en el Header y guarda la preferencia bajo la clave `experience` en `localStorage`.

---

## Instalación y desarrollo

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/while-alive-blog.git
cd while-alive-blog

# Instala dependencias (Yarn recomendado)
yarn install

# Copia variables de entorno (si existen)
cp .env.example .env.local

# Ejecuta el servidor de desarrollo
yarn dev
```

##  Contribución

- Forkea el repositorio.
- Crea una rama descriptiva (feature/dual-mode, bugfix/logo‑terminal, etc.).
- Asegúrate que los tests pasen: `yarn lint && yarn type-check`.
- Abre un Pull Request con una descripción clara de los cambios.
