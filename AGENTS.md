<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reglas de diseño de este sitio

Estas reglas las fijó Robert y valen para toda página nueva o rediseñada.

## 1. Ninguna página se entrega solo con texto

Antes de dar una página por terminada, cuenta las imágenes. Cero es un error.

- Una imagen real cada dos o tres secciones. El pool vive en `public/paginas/`,
  `public/capacitacion/`, `public/nosotros/` y `public/blog/`.
- Si ninguna foto sirve para lo que estás explicando, construye el visual: mock
  del comprobante, comparación de barras, tarjeta de reporte. No dejes el hueco.
- Toda foto entra por `next/image` con `sizes` y `alt` descriptivo.
- Ninguna foto puede insinuar que es la instalación de un cliente.

## 2. El color hace trabajo semántico, no decorativo

El costo va en rojo o ámbar (`#E11D48`, `#F59E0B`), el alivio en verde
(`#16A34A`), el CTA en lima (`#D4F040`) sobre fondo oscuro. Cuatro secciones
seguidas del mismo azul se leen como una sola: alterna claro y oscuro y deja un
acento distinto por bloque.

## 3. Sin animaciones de entrada

La velocidad de carga es el argumento de venta. Nada de `initial`/`whileInView`
en framer-motion. `whileHover` sí. Las imágenes bajo el pliegue van perezosas,
que es el comportamiento por defecto de `next/image`.

## 4. Sin nombres de clientes

Ni en copy, ni en `alt`, ni en JSON-LD, ni en `llms.txt`. Se reemplazan por
industria más cifra verificable.

## 5. Deploy

`git push origin main`. Nunca `vercel --prod`: el `.vercel/project.json` local
apunta a un proyecto borrado.
