# VelvetSPA

> `Velvet` significa `terciopelo`, y no confundir `SPA` con `Single Page Application`, este `SPA` significa
> `salus per aquam`, o sea, los spa de salones de belleza

Monorepositorio para el proyecto de convalidación de la asignatura Programación Web del Tercer Año de Ingenieria
Informática curso 2026-2027 - CUJAE

> Estado actual: API en desarrollo

## Desarrollo

### Tooling

Monorepositorio con lo siguiente:

- `packages/api`:
  - Backend creado con `@nestjs/cli`
  - Framework `NestJS`
  - Usa `DrizzleORM` con el driver de `PostgreSQL`

- `packages/web`:
  - Frontend creado con `create-vite`
  - Framework `React` usando `Vite/Typescript`
  - Usa `@tanstack/react-query` para gestión de los datos de la API
  - Usa `TailwindCSS v4` para la gestión de estilos css (Nota: está limitado solo a navegadores modernos, ojo)

### Instalación

Primero instalar las dependencias de todo el proyecto:

```shell
pnpm install
```

Se puede utilizar la base de datos postgres definida en `docker/docker-compose.yml`. Iniciarla de la siguiente manera:

```shell
docker compose -f docker/docker-compose.yml up
```

De no ser el caso, es necesario definir la variable de entorno `DATABASE_URL` con la uri de la ruta de la base de datos
de postgres que se esté utilizando.

A continuación es necesario preparar las migraciones, ejecuta:

```shell
pnpm db:push
```

Todo listo

## Uso

Iniciar la api:

```shell
pnpm api:dev
```

Esto iniciara el servidor en el puerto 3000 y sera accesible en http://localhost:3000/docs para ver las especificaciones
OpenAPI

Iniciar la web:

```shell
pnpm web:dev
```

Esto iniciara un servidor vite que renderizara la pagina web, es accesible via http://localhost:5173/

## Otros comandos

```shell
# formatear con prettier
pnpm format

# formatear solo la api
pnpm api:format
```
