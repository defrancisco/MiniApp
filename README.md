
# Juego de Cálculos Mentales

## Descripción General
Esta es una aplicación móvil desarrollada en React Native que implementa un juego de cálculo mental. El objetivo principal es evaluar la capacidad del usuario para resolver operaciones matemáticas bajo presión de tiempo, registrando el desempeño, la precisión y la velocidad de respuesta. El sistema presenta operaciones matemáticas generadas dinámicamente.

## Funcionalidades Implementadas
* **Dificultad Configurable:** Cuenta con la configuración de niveles de dificultad: fácil, medio y difícil.
* **Modos de Juego:** * Modo clásico de respuesta directa.
  * Modo verdadero / falso.
  * Modo múltiple choice con 4 opciones.
  * Modo contra reloj continuo.
* **Sistema de Puntajes y Estadísticas:** Realiza un cálculo de puntaje basado en la precisión y la velocidad. El sistema registra las respuestas correctas, las incorrectas y el tiempo de respuesta. Al finalizar cada ronda, permite la visualización de estadísticas.
* **Persistencia Local:** La aplicación guarda un registro de los mejores puntajes y el historial utilizando almacenamiento local. La aplicación no se conecta a internet, asegurando que la persistencia sea exclusivamente local.

## Decisiones de Diseño y Arquitectura
Para mantener un código escalable, limpio y modular, el proyecto se estructuró en base a los siguientes principios de arquitectura de software:

* **Arquitectura MVC (Modelo-Vista-Controlador):** La aplicación separa claramente la interfaz gráfica (las pantallas y componentes de React Native) de la lógica de negocio subyacente. Los modelos se encargan de la generación aleatoria de operaciones matemáticas y de la lógica del sistema de puntaje.
* **Patrón de Diseño Strategy:** Para abordar la complejidad de los múltiples modos de juego, se implementó el patrón de comportamiento Strategy. Cada modo de juego encapsula su propio algoritmo para presentar la información y evaluar la respuesta del usuario, permitiendo que el motor principal del juego cambie de contexto dinámicamente.

## Entorno de Desarrollo (Expo)
Para agilizar el desarrollo y evitar configuraciones pesadas de emuladores como Android Studio, este proyecto se inicializó y desarrolló utilizando **Expo**. Esto permitió probar la aplicación en tiempo real directamente sobre un dispositivo físico mediante la aplicación Expo Go, escribiendo el código enteramente desde Visual Studio Code.

Para levantar el proyecto en otro equipo:
1. Instalar las dependencias con `npm install`
2. Iniciar el servidor local con `npx expo start`
3. Escanear el código QR resultante con la app Expo Go desde el celular.

## Autor
Desarrollo individual realizado por la alumna Delfina Francisco Frate