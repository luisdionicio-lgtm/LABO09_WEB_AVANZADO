# Diseño de Cuaderno

Presentación editorial clara elegida por el usuario. Marfil #f7f6f0, texto #242d27, verde #264d3c. Libre Baskerville para títulos; Geist para navegación, controles y datos.

Navegación horizontal común; índice editorial de ejercicios; ficha Pokémon en dos columnas; clima local sobre verde y consulta internacional sobre marfil. Líneas finas, sin degradados ni emojis. Móvil: una columna y navegación visible.

Movimiento: aparición de resultados con opacidad y desplazamiento de 7 px en 240 ms; curva cubic-bezier(0.23,1,0.32,1). Feedback de controles entre 140 y 180 ms. Indicador de consulta mientras hay peticiones. Sin movimiento decorativo continuo. prefers-reduced-motion elimina desplazamientos e indicadores animados.

Datos reales de PokeAPI y Open-Meteo; errores con reintento. CSR conserva useEffect; SSR conserva connection y Suspense. La navegación tiene aria-current y enlaces sin precarga para facilitar la comparación del laboratorio.

## Colección y recorrido de datos

Portada con carrusel nativo scroll-snap: tres Pokémon iniciales, flechas, indicadores, navegación con teclas izquierda/derecha y gesto de desplazamiento. No hay reproducción automática. Los elementos de las diapositivas fuera de vista usan inert para no entrar en el orden de foco. prefers-reduced-motion usa desplazamiento inmediato. Las ilustraciones provienen del repositorio oficial de sprites de PokeAPI.

La comparación Navegador/Servidor cambia los pasos y el enlace del ejercicio. No genera consultas a APIs. Las fichas prefieren official-artwork y conservan el sprite como alternativa. El clima incorpora accesos directos a las cuatro ciudades.

Verificación: lint y build correctos. Navegador de escritorio: flechas del carrusel, actualización de indicadores y comparación interactiva. La adaptación móvil usa una columna y desplazamiento nativo; el gesto táctil requiere comprobación en un teléfono real.

## Movimiento y selección visual

Se añadieron miniaturas seleccionables para los Pokémon iniciales y transición de las ilustraciones al entrar en la diapositiva. Las secciones de la portada aparecen una sola vez al entrar en el área visible; sin JavaScript o con movimiento reducido, siguen visibles.

El recorrido CSR/SSR se reproduce manualmente con tres pasos, permite detenerse y reiniciarse, y limpia sus temporizadores al desmontar el componente o cambiar de estrategia. Con movimiento reducido muestra el resultado de inmediato. Un indicador de lectura usa la animación nativa de scroll cuando el navegador la admite.

## Cuaderno cinema

Apartado independiente /cine: tinta #101017, panel ciruela #1c1b26, texto marfil #f6f0e8, cobre #ffbc91 y aguamarina #a5dcd7. Geist para titulares y catálogo; Libre Baskerville en la firma editorial. Cartelera con destacados seleccionables, ranking de películas, series panorámicas, búsqueda y ficha dentro de la página.

Motion según Emil Kowalski: feedback de presión 140 ms, escala de póster en hover de 240 ms, apertura del detalle 240 ms, propiedades explícitas y movimiento reducido. Sin autoplay ni controles de reproducción ficticios. Las búsquedas se esperan 450 ms y se cancelan cuando cambia el término. Navegación y foco permanecen accesibles.

## Cartelera cinematográfica

Nueva identidad del apartado de cine: tinta #101017, panel ciruela #1c1b26, cobre #ffbc91, marfil #f6f0e8 y aguamarina #a5dcd7. Inspiración funcional en las plataformas de catálogo, con marca y colores propios.

La portada se separa en CinemaHero y permite elegir entre cuatro películas populares sin autoplay. La navegación Descubrir/Películas/Series utiliza los filtros existentes. Las películas populares muestran su posición en la respuesta de TMDB; las series usan tarjetas panorámicas. Las flechas de las filas se deshabilitan al llegar a los extremos. Todos los títulos abren la ficha existente.

El encabezado principal usa Geist con peso alto para que el cartel destaque. Libre Baskerville queda en la firma cinema y las notas editoriales. Se conservan el catálogo SSR, la búsqueda CSR, las credenciales privadas y el movimiento reducido.
