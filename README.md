# VelvetSPA

> `Velvet` significa `terciopelo`

Monorepositorio para el proyecto de convalidación de la asignatura Programación Web del Tercer Año de Ingenieria Informática
curso 2026-2027 - CUJAE

> Estado actual: API en desarrollo

## Desarrollo

### Instalación

Primero instalar las dependencias de todo el proyecto:

```shell
pnpm install
```

Se puede utilizar la base de datos postgres definida en `docker/docker-compose.yml`.
Iniciarla de la siguiente manera:

```shell
sudo docker compose -f docker/docker-compose.yml up
```

De no ser el caso, es necesario definir la variable de entorno `DATABASE_URL` con la uri de la ruta de la base de datos de postgres que se esté
utilizando.

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

Esto iniciara el servidor en el puerto 3000 y sera accesible en http://localhost:3000/docs para ver las especificaciones OpenAPI

## Otros comandos

```shell
# formatear con prettier
pnpm format

# formatear solo la api
pnpm api:format
```
