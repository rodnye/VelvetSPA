# Explicación del por que se usaron estas herramientas

## Gestor de paquetes: pnpm

Monorepositorio ligero y rápido. `pnpm-workspace.yaml` define `packages/*` como workspaces, y el filtrado (`-F`) permite
ejecutar scripts por paquete sin duplicar dependencias, muy importante por la mala conectividad de la que disponemos los
estudiantes.

## Backend: NestJS

Framework modular con inyección de dependencias, decoradores y estructura opinada. No tenemos que decidir con él un
método de diseño de arquitectura de backend ya que este viene con sus propios estándares de facto. Escalable, testeable
y con soporte nativo para OpenAPI vía `@nestjs/swagger`, lo que permite documentar la API automáticamente.

## ORM: Drizzle

Alternativa ligera y tipada a otros ORMs. Muy comodo para gestionar sql en typescript

## Base de datos: PostgreSQL

Motor relacional robusto y estándar. Se levanta en local con Docker Compose para evitar instalaciones manuales y
mantener paridad entre entornos.

## Frontend: React + Vite

React por su ecosistema y modelo basado en componentes. Vite por su arranque instantáneo, HMR rápido y configuración
mínima con TypeScript.

## Estado del servidor: TanStack Query

Maneja caché, reintentos, revalidación y estados de carga/error de las peticiones a la API sin reinventar la rueda.

## Estilos: TailwindCSS v4

Utilidades CSS directamente en el marcado, sin archivos de estilos .css por componente, nos deja solamente con los
archivos .tsx y .ts para trabajar. La desventaja es que v4 usa el motor Oxide y requiere navegadores modernos.

## Contenedores: Docker Compose

Solo para la base de datos. Evita que configure PostgreSQL a mano.

## Calidad de código: Prettier + ESLint

Prettier unifica el formato (comillas simples, punto y coma). ESLint detecta errores y malas prácticas; en la API se
integra con Prettier para evitar conflictos.
