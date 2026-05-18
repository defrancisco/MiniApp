# Juego de Cálculos Mentales

## Documento de Entrega
Puedes revisar el informe completo con la descripción de funcionalidades y decisiones de diseño arquitectónico en el siguiente enlace:

[📄 Ver Informe de Entrega (Google Docs)](https://docs.google.com/document/d/1K5YCXpbXHLwz1FKn6H_22uyYWJFqGyMxr77wzyGaxlk/edit?usp=drive_web)


## Descripción General
Esta es una aplicación móvil desarrollada en React Native que implementa un juego de cálculo mental. El objetivo principal es evaluar la capacidad del usuario para resolver operaciones matemáticas bajo presión de tiempo, registrando el desempeño, la precisión y la velocidad de respuesta. El sistema presenta operaciones matemáticas generadas dinámicamente.

## Funcionalidades Implementadas
* **Dificultad y Rondas Configurables:** Cuenta con la configuración de niveles de dificultad (fácil, medio y difícil) y permite definir la cantidad de iteraciones por ronda (5, 10 o 15 preguntas).
* **Modos de Juego:** * Modo clásico de respuesta directa.
  * Modo verdadero / falso.
  * Modo múltiple choice con 4 opciones.
  * Modo contra reloj continuo.
* **Sistema de Puntajes y Estadísticas:** Realiza un cálculo de puntaje basado en la precisión y la velocidad (bonificando respuestas rápidas). El sistema registra las respuestas correctas, las incorrectas y calcula el tiempo promedio de reacción. 
* **Flujo de Partida:** Visualización de estadísticas detalladas al finalizar cada ronda y posibilidad de reiniciar el juego al instante.
* **Persistencia Local (Offline):** La aplicación guarda un registro del Top 10 de mejores puntajes y el historial utilizando `AsyncStorage`. La aplicación no se conecta a internet, asegurando que la persistencia sea exclusivamente local y funcione en Modo Avión.

## Decisiones de Diseño y Arquitectura
Para mantener un código escalable, limpio y modular, el proyecto se estructuró en base a los siguientes principios de arquitectura de software:

* **Arquitectura MVC (Modelo-Vista-Controlador):** La aplicación separa claramente la interfaz gráfica (las pantallas en `app/` gestionadas por Expo Router) de la lógica de negocio subyacente (`src/models/`). 
* **Patrón de Diseño Strategy:** Para abordar la complejidad de los múltiples modos de juego, se implementó el patrón de comportamiento Strategy (`src/strategies/`). Cada modo de juego encapsula su propio algoritmo para presentar la información y evaluar la respuesta, permitiendo que el motor principal cambie de contexto dinámicamente.
* **TypeScript Estricto:** Separación semántica de archivos con extensión `.tsx` para los componentes visuales de React y `.ts` para los motores de lógica pura y algoritmos matemáticos.
* **Diseño Centralizado:** Extracción total de los estilos y paletas de colores hacia hojas de estilo independientes (`src/styles/` y `src/constants/theme.ts`) para mantener las pantallas limpias y enfocadas solo en la lógica.

## Entorno de Desarrollo (Expo)
Para agilizar el desarrollo y evitar configuraciones pesadas de emuladores como Android Studio, este proyecto se inicializó y desarrolló utilizando **Expo**. Esto permitió probar la aplicación en tiempo real directamente sobre un dispositivo físico mediante la aplicación Expo Go, escribiendo el código enteramente desde Visual Studio Code.

Para levantar el proyecto en otro equipo:
1. Instalar las dependencias con `npm install`
2. Iniciar el servidor local con `npx expo start`
3. Escanear el código QR resultante con la app Expo Go desde el celular.

Si hay inconvenientes se recomienda utilizar `npx expo start -c` para eliminar cache.

## Autor
Desarrollo individual realizado por la alumna Delfina Rocío Francisco Frate.
