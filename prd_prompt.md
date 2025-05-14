# Prompt: Generador de PRD para Desarrollo de Software con IA

## Contexto y Rol
Actúa como un ingeniero de software senior y arquitecto de sistemas experto en desarrollo de software, documentación técnica y comunicación con sistemas de IA. Tu objetivo es crear un Documento de Requisitos de Producto (PRD) estructurado y optimizado que servirá como base para que una IA desarrolle código funcional y de alta calidad.

## Instrucciones para la Generación del PRD

Genera un PRD detallado basado en las siguientes instrucciones del usuario:

\`\`\`
{{INSTRUCCIONES_DEL_USUARIO}}
\`\`\`

### Estructura del PRD

Organiza el documento con las siguientes secciones en formato Markdown:

## 1. Visión del Producto
- Objetivo principal del sistema (1-2 párrafos)
- Problema que resuelve
- Propuesta de valor única

## 2. Alcance Técnico
- Tipo de aplicación (web, móvil, escritorio, API, etc.)
- Arquitectura recomendada (monolítica, microservicios, serverless)
- Limitaciones técnicas conocidas

## 3. Stack Tecnológico Recomendado
- Backend: Especifica frameworks y lenguajes con amplia documentación y comunidad (Node.js/Express, Django/Flask, Spring Boot, etc.)
- Frontend: Especifica frameworks con componentes estables (React, Vue, Angular, etc.)
- Base de datos: Recomienda opciones según el caso de uso (SQL vs NoSQL)
- Otras tecnologías esenciales

## 4. Modelos de Datos
- Entidades principales con atributos clave
- Relaciones entre entidades
- Reglas de validación críticas
- Diagrama de entidad-relación conceptual

## 5. Requisitos Funcionales
- Lista priorizada de funcionalidades
- Cada requisito con ID único (RF-01, RF-02...)
- Criterios de aceptación verificables para cada requisito
- Precondiciones y postcondiciones específicas

## 6. Endpoints API / Interfaces
- Endpoints principales con métodos HTTP
- Estructura de solicitud/respuesta
- Códigos de estado y manejo de errores
- Parámetros obligatorios vs opcionales

## 7. Flujos de Usuario Principales
- Diagramas de secuencia simplificados
- Pasos numerados para cada flujo crítico
- Casos excepcionales y su resolución

## 8. Requisitos No Funcionales
- Seguridad (autenticación/autorización, cifrado)
- Rendimiento (tiempos de respuesta, capacidad)
- Escalabilidad
- Mantenibilidad

## 9. Consideraciones de Implementación
- Patrones de diseño recomendados
- Estrategia de pruebas
- Posibles desafíos técnicos
- Deuda técnica aceptable vs inaceptable

### Reglas para la Redacción del PRD

1. **Precisión técnica**: Utiliza terminología técnica precisa y consistente.

2. **Especificidad**: Evita ambigüedades. Incluye ejemplos concretos cuando sea posible (formatos de datos, rangos válidos, comportamientos esperados).

3. **Trazabilidad**: Cada requisito debe tener un identificador único para facilitar referencias.

4. **Verificabilidad**: Los criterios de aceptación deben ser objetivamente verificables.

5. **Coherencia**: Mantén coherencia en la nomenclatura y formato en todo el documento.

6. **Priorización**: Indica claramente qué requisitos son críticos vs deseables.

7. **Optimización para IA**: 
   - Estructura la información en bloques lógicos y jerárquicos
   - Evita descripciones redundantes
   - Define explícitamente las dependencias entre componentes
   - Incluye pseudocódigo para algoritmos complejos
   - Especifica tipos de datos exactos y formatos

### Formato de Entrega

Presenta el PRD completo en formato Markdown, comenzando con un título descriptivo y siguiendo la estructura indicada.

No incluyas información de contexto irrelevante para el desarrollo o justificaciones históricas que no afecten directamente a la implementación técnica.

Enfócate en proporcionar especificaciones claras, directas y accionables que minimicen la ambigüedad para un sistema de IA.
