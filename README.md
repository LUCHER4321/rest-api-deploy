# Documentación de la API RESTful de Películas

Esta API permite gestionar una colección de películas con operaciones CRUD (Crear, Leer, Actualizar, Eliminar). A continuación se detallan todos los endpoints disponibles y cómo utilizarlos.

## URL Base

Todos los endpoints parten de la siguiente URL base:
[https://rest-api-deploy-xi.vercel.app/](https://rest-api-deploy-xi.vercel.app/)

## Endpoints Disponibles

### 1. Bienvenida

- **Descripción**: Endpoint inicial que muestra un mensaje de bienvenida.
- **Método**: `GET`
- **URL**: `/`
- **Respuesta**:

```json
{ "message": "¡Hola, mundo! 👋" }
```

### 2. Obtener todas las películas

- **Descripción**: Devuelve un listado completo de todas las películas disponibles.
- **Método**: `GET`
- **URL**: `/movies`
- **Respuesta Ejemplo**:

```json
[
  {
    "id": "78940913-26c8-11f0-b05b-cecd02c812d5",
    "title": "The Shawshank Redemption",
    "year": 1994,
    "director": "Frank Darabont",
    "duration": 142,
    "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
    "rate": 9.3,
    "genre": ["Drama"]
  },
  ...
]
```

### 3. Filtrar películas por género

- **Descripción**: Permite obtener películas filtradas por un género específico.
- **Método**: `GET`
- **URL**: `/movies?genre=Drama`
- **Parámetro**:
  - `genre`: Género por el cual filtrar (ej: "Drama", "Action", etc.)
- **Respuesta Ejemplo**:

```json
[
  {
    "id": "78940913-26c8-11f0-b05b-cecd02c812d5",
    "title": "The Shawshank Redemption",
    "year": 1994,
    "director": "Frank Darabont",
    "duration": 142,
    "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
    "rate": 9.3,
    "genre": ["Drama"]
  },
  ...
]
```

### 4. Obtener película por ID

- **Descripción**: Devuelve los detalles de una película específica según su ID.
- **Método**: `GET`
- **URL**: `/movies/{id}`
- **Parámetro**:
  - `id`: Identificador único de la película.
- **Respuesta Ejemplo**:

```json
{
  "id": "78940913-26c8-11f0-b05b-cecd02c812d5",
  "title": "The Shawshank Redemption",
  "year": 1994,
  "director": "Frank Darabont",
  "duration": 142,
  "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
  "rate": 9.3,
  "genre": ["Drama"]
}
```

### 5. Crear una película

- **Descripción**: Permite agregar una nueva película a la colección.
- **Método**: POST
- **URL**: /movies
- **Cabeceras**:
  - `Content-Type: application/json`
- **Cuerpo de la Solicitud**:

```json
{
  "title": "Interstellar",
  "year": 2014,
  "director": "Christopher Nolan",
  "duration": 169,
  "poster": "https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg",
  "rate": 8.6,
  "genre": ["Sci-Fi", "Adventure"]
}
```

- **Respuesta Ejemplo**:

```json
{
  "id": "uuid-generado",
  "title": "Interstellar",
  "year": 2014,
  "director": "Christopher Nolan",
  "duration": 169,
  "poster": "https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg",
  "rate": 8.6,
  "genre": ["Sci-Fi", "Adventure"]
}
```

### 6. Actualizar una película

- **Descripción**: Permite modificar parcialmente los datos de una película existente.
- **Método**: `PATCH`
- **URL**: `/movies/{id}`
- **Cabeceras**:
  - `Content-Type: application/json`
- **Cuerpo de la Solicitud**:

```json
{
  "rate": 9.5,
  "year": 1995
}
```

- **Respuesta Ejemplo**:

```json
{
  "id": "78940913-26c8-11f0-b05b-cecd02c812d5",
  "title": "The Shawshank Redemption",
  "year": 1995,
  "director": "Frank Darabont",
  "duration": 142,
  "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
  "rate": 9.5,
  "genre": ["Drama"]
}
```

### 7. Eliminar una película

- **Descripción**: Elimina una película de la colección según su ID.
- **Método**: DELETE
- **URL**: /movies/{id}
- **Respuesta Ejemplo**:

```json
{ "message": "Movie deleted successfully ✅" }
```

## Consideraciones

- Todos los endpoints devuelven respuestas en formato JSON.
- Para operaciones que requieran cuerpo (POST, PATCH), asegúrese de incluir la cabecera `Content-Type: application/json`.

Este documento proporciona una guía completa para interactuar con la API.
