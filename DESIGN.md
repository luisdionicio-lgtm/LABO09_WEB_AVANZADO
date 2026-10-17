# Diseño de Cuaderno

Presentación editorial clara elegida por el usuario. Marfil #f7f6f0, texto #242d27, verde #264d3c. Libre Baskerville para títulos; Geist para navegación, controles y datos.

Navegación horizontal común; índice editorial de ejercicios; ficha Pokémon en dos columnas; clima local sobre verde y consulta internacional sobre marfil. Líneas finas, sin degradados ni emojis. Móvil: una columna y navegación visible.

Movimiento: aparición de resultados con opacidad y desplazamiento de 7 px en 240 ms; curva cubic-bezier(0.23,1,0.32,1). Feedback de controles entre 140 y 180 ms. Indicador de consulta mientras hay peticiones. Sin movimiento decorativo continuo. prefers-reduced-motion elimina desplazamientos e indicadores animados.

Datos reales de PokeAPI y Open-Meteo; errores con reintento. CSR conserva useEffect; SSR conserva connection y Suspense. La navegación tiene aria-current y enlaces sin precarga para facilitar la comparación del laboratorio.
