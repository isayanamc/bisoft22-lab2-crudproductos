# Laboratorio 2 – CRUD front-end

**Estudiante:** Isayana Mariel Murillo Calderón
**Curso:** BISOFT-22 Proyecto de Ingeniería del Software 3

Front-end en Angular que consume la API del Laboratorio 1 para administrar productos y categorías, con inicio de sesión, registro y roles.

API (Laboratorio 1): https://github.com/isayanamc/bisoft22-lab1-crudproductos

## Cómo correrlo

### 1. Back-end (repositorio del Lab 1)

```bash
cd docker
docker compose up -d
```

Después correr `Lab1Application` en IntelliJ. La API queda en `http://localhost:8080`.

> La primera vez, si Keycloak ya existía de antes, hay que correr `docker compose down -v` antes del `up -d` para que cargue el realm actualizado.

### 2. Front-end (este repositorio)

```bash
npm install
npm start
```

Abrir `http://localhost:4200`.

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | SUPER-ADMIN-ROLE |
| usuario | usuario123 | USER |

Los usuarios que se crean desde **Registrarse** quedan con rol USER.

## Qué puede hacer cada rol

| Acción | USER | SUPER-ADMIN-ROLE |
|---|---|---|
| Ver productos y categorías | Sí | Sí |
| Crear, editar y eliminar | No | Sí |
| Ver la página de usuarios | No | Sí |

El USER ve las listas sin los botones de acciones. La página de usuarios está restringida por el menú (no aparece el enlace) y por URL (si se escribe a mano, lleva a "Acceso restringido"). La API también lo valida con `@PreAuthorize`.

## Estructura

- `interfaces/` – modelos de datos (iguales a los DTO de la API)
- `services/` – llamadas HTTP a la API y manejo de la sesión
- `interceptors/` – agrega el token a cada petición
- `guards/` – restringen las rutas según el rol
- `productos/`, `categorias/` – listas
- `producto-form/`, `categoria-form/` – un solo componente para crear y editar
- `login/`, `registro/`, `usuarios/`, `no-autorizado/`
