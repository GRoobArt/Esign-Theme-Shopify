# AGENTS.md

## Objetivo
Guia breve para agentes en este repositorio (Shopify theme).

## Reglas generales
- Respeta cambios existentes; no reviertas trabajo ajeno.
- Prefiere ediciones pequenas y revisables.
- Evita agregar dependencias o comandos de red sin pedir permiso.
- Mantiene el contenido en ASCII salvo que el archivo ya use Unicode.

## Ubicacion del codigo
- `layout/`, `templates/`, `sections/`, `snippets/`: Liquid y estructura del theme.
- `assets/`: CSS, JS, imagenes.
- `locales/`: traducciones.
- `config/`: ajustes del theme.

## Convenciones
- No rompas el estilo existente del theme.
- Comentarios solo si hay logica no obvia.
- Evita duplicar estilos; reutiliza clases existentes cuando sea posible.

## Pruebas y validacion
- No hay test runner configurado. Valida cambios revisando el markup y la coherencia de estilos.
- Si propones ejecutar comandos, pregunta antes.

## Entrega
- Resume cambios con rutas de archivo.
- Propone pasos siguientes (p. ej. revisar en preview del theme).
