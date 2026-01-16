# AGENTS.md

## Objetivo

Guia breve para agentes en este repositorio (Shopify theme).

## Reglas generales

- Respeta cambios existentes; no reviertas trabajo ajeno.
- Prefiere ediciones pequenas y revisables.
- Evita agregar dependencias o comandos de red sin pedir permiso.
- Mantiene el contenido en ASCII salvo que el archivo ya use Unicode.
- Prioriza codigo limpio: legible, consistente y facil de mantener.

## Ubicacion del codigo

- `layout/`, `templates/`, `sections/`, `snippets/`: Liquid y estructura del theme.
- `assets/`: CSS, JS, imagenes.
- `locales/`: traducciones.
- `config/`: ajustes del theme.
- `blocks/`: bloques Liquid reutilizables y configurables.

## Arquitectura y flujo

- Theme basado en Liquid: `layout/` define el marco principal, `templates/` enruta vistas, `sections/` compone paginas y `snippets/` contiene piezas reutilizables.
- La logica de UI vive en Liquid + JSON de schema; evita mover logica a JS si se puede resolver en Liquid.
- JS en `assets/` debe ser modular y no acoplado a una sola plantilla; prioriza eventos y data-atributos.
- CSS debe mantenerse cohesivo; prefiere estilos existentes antes de crear nuevos.

## Convenciones

- No rompas el estilo existente del theme.
- Comentarios solo si hay logica no obvia.
- Evita duplicar estilos; reutiliza clases existentes cuando sea posible.
- Nombra clases y selectores de forma consistente con el theme actual.
- Mantiene el markup semantico y accesible.

## Estilos

- Sigue la jerarquia visual y el espaciado ya definidos.
- Reutiliza clases utilitarias si existen; evita nuevas utilidades sin necesidad.
- No introduzcas resets o globales que puedan afectar otras vistas.

## Logica y JS

- Evita efectos colaterales globales; usa alcances por seccion o componente.
- Prefiere funciones pequenas y nombres descriptivos.
- No agregues dependencias externas sin permiso.

## Traducciones

- Usa `locales/` para textos visibles; no hardcodear strings en Liquid cuando sean editables.
- Mantiene consistencia de claves entre idiomas.
- Si agregas nuevas claves, actualiza los idiomas existentes.

## Pruebas y validacion

- No hay test runner configurado. Valida cambios revisando el markup y la coherencia de estilos.
- Si propones ejecutar comandos, pregunta antes.

## Entrega

- Resume cambios con rutas de archivo.
- Propone pasos siguientes (p. ej. revisar en preview del theme).
