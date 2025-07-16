# Backend Chrono-POS 🏗️

Backend desarrollado con NestJS para el sistema Chrono-POS, implementando arquitectura hexagonal y multi-tenant.

## 🚀 Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación tipado
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **Redis** - Cache y sesiones
- **JWT** - Autenticación y autorización
- **Docker** - Contenedorización
- **Swagger** - Documentación de API
- **Azure Storage** - Almacenamiento en la nube

## 📋 Prerrequisitos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🛠️ Configuración e Instalación

### 1. Clonar el proyecto

```bash
git clone [URL_DEL_REPOSITORIO]
cd backend-chronos-pos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de template y configura las variables de entorno:

```bash
cp .env.template .env
```

Edita el archivo `.env` con tus configuraciones específicas.

### 4. Iniciar servicios Docker

Levanta los servicios de base de datos y Redis:

```bash
docker-compose up -d
```

> **Nota:** Si necesitas cambiar el puerto de PostgreSQL, modifica las siguientes variables en tu `.env`:
>
> - `DB_PORT`
> - `PRINCIPAL_DATABASE_URL`
> - `TENANT_BASE_DATABASE_URL`

### 5. Ejecutar migraciones

Aplica las migraciones a las bases de datos:

```bash
npm run deploy
```

### 6. Generar tipos de Prisma

Genera los tipos de TypeScript para Prisma:

```bash
npm run generate
```

### 7. Sincronizar tenants

Sincroniza los tenants con respecto a la base de datos base:

```bash
npm run sync-tenants
```

### 8. Ejecutar seeds

Ejecuta los seeds para cargar la información base:

```bash
# Seed para la base de datos principal
npm run seed:principal

# Seed para la base de datos de tenants
npm run seed:tenant
```

### 9. Iniciar el servidor

Ejecuta el proyecto en modo desarrollo:

```bash
npm run start:dev
```

¡Listo! El servidor estará ejecutándose en `http://localhost:3000`

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia el servidor en modo desarrollo
npm run start:debug        # Inicia el servidor en modo debug

# Producción
npm run build              # Construye la aplicación
npm run start:prod         # Inicia el servidor en modo producción

# Base de datos
npm run generate           # Genera tipos de Prisma
npm run migrate           # Ejecuta migraciones en desarrollo
npm run deploy            # Ejecuta migraciones en producción
npm run sync-tenants      # Sincroniza las bases de datos de tenants

# Seeds
npm run seed:principal    # Ejecuta seeds de la DB principal
npm run seed:tenant       # Ejecuta seeds de la DB de tenants

# Calidad de código
npm run lint              # Ejecuta el linter
npm run format            # Formatea el código con Prettier
npm run test              # Ejecuta las pruebas
```

## 📚 Documentación API

Una vez iniciado el proyecto, puedes acceder a la documentación Swagger en:

```
http://localhost:8443/api/docs
```
