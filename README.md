# Cuaderno

Laboratorio de Next.js sobre renderizado CSR y SSR.

Versión pública: [Cuaderno](https://labo09-web-avanzado.vercel.app) · [Cartelera de cine y series](https://labo09-web-avanzado.vercel.app/cine).

## Ejecutar

```sh
npm install
npm run dev
```

## Ejercicios

- `/pokemon-csr`: consulta PokeAPI desde el navegador con useEffect y Axios.
- `/pokemon-ssr`: consulta PokeAPI en el servidor, al recibir una visita.
- `/weather`: Lima desde el servidor y cuatro ciudades consultadas en el cliente.

La tarea integradora está en `/cine`: películas y series con TMDB, catálogo SSR, búsqueda CSR y detalles sin recargar. Configurar `TMDB_API_KEY` en `.env.local` tomando `.env.example` como referencia. La clave privada no se publica. Documentación: [Tarea de cine](docs/tarea-cine.md).

## Verificar

```sh
npm run lint
npm run build
```

Observaciones y capturas: [Laboratorio 09](docs/laboratorio-09.md).
