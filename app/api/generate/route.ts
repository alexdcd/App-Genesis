import { NextResponse } from "next/server"
import { sanitizePrompt, validateSanitizedPrompt } from "@/lib/prompt-sanitizer"

export async function POST(request: Request) {
  try {
    const { prompt, platform, productType } = await request.json()
    
    // Sanitizar el prompt para prevenir inyecciones
    const sanitizedPrompt = sanitizePrompt(prompt, { 
      level: 'markdown-safe', 
      maxLength: 4000 // Limitar tamaño para prevenir DoS
    })
    
    // Validar que el prompt sanitizado sea seguro
    const validationResult = validateSanitizedPrompt(sanitizedPrompt)
    if (!validationResult.valid) {
      return NextResponse.json({ error: `Prompt inválido: ${validationResult.message}` }, { status: 400 })
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not defined" }, { status: 500 })
    }

    const systemPrompt = `# Prompt: Generador de PRD Optimizado para Desarrollo con IA

## Contexto y Rol
Actúa como un ingeniero de software senior y arquitecto de sistemas experto en desarrollo de software, documentación técnica y comunicación con sistemas de IA. Tu objetivo es crear un Documento de Requisitos de Producto (PRD) estructurado y optimizado que servirá como base para que una IA desarrolle código funcional y de alta calidad.

## Instrucciones para la Generación del PRD

Genera un PRD detallado basado en las siguientes instrucciones del usuario:

\`\`\`
${sanitizedPrompt}
\`\`\`

## Estructura del PRD

Organiza el documento con las siguientes secciones en formato Markdown:

## 1. Problema y Contexto

- Cliente: ¿Quién es el usuario final? Describe sus características técnicas relevantes
- Problema: ¿Qué problema técnico resuelve este producto/feature?
- Evidencia del problema: Datos objetivos que confirman la existencia del problema
- Propuesta de valor única: ¿Cómo resuelve el sistema este problema de forma técnica?

## 2. Objetivos y Métricas

- Objetivo principal: Una métrica clara de éxito (cuantificable)
- Métricas de entrada: 2-3 métricas técnicas que impulsarán el objetivo principal
- Definición de "terminado": Criterios técnicos específicos que indicarán cuándo el desarrollo está completo

## 3. Alcance Técnico

- Tipo de aplicación: ${productType}
- Arquitectura recomendada (monolítica, microservicios, serverless)
- Limitaciones técnicas conocidas

## 4. Stack Tecnológico Recomendado
Ten en cuenta las recomendacinoes de tipo de producto seleccionada por el usuario, prioriza lo siguiente salvo que exista una justificación de usar otro stack mas optimo.
- Stack recomendado para apps moviles: React Native / Expo, TypeScript, Redux Toolkit, React Native Paper
- Recomendado para web: Next.js, TypeScript, React Query, Tailwind CSS, shadcn/ui
- Recomendado para apps de escritorio: Electron, React, TypeScript, Redux

- Backend: Especifica frameworks y lenguajes con amplia documentación y comunidad (Node.js/Express, Django/Flask, Spring Boot, etc.)
- Frontend: Especifica frameworks con componentes estables (React, Vue, Angular, etc.)
- Base de datos: Recomienda opciones según el caso de uso (SQL vs NoSQL)
- Otras tecnologías esenciales
- Optimizado para: ${platform}

## 5. Modelos de Datos

- Entidades principales con atributos clave
- Relaciones entre entidades
- Reglas de validación críticas
- Diagrama de entidad-relación conceptual

## 6. Requisitos Funcionales

- Lista priorizada de funcionalidades
- Cada requisito con ID único (RF-01, RF-02...)
- Criterios de aceptación verificables para cada requisito
- Precondiciones y postcondiciones específicas

## 7. Endpoints API / Interfaces

- Endpoints principales con métodos HTTP
- Estructura de solicitud/respuesta
- Códigos de estado y manejo de errores
- Parámetros obligatorios vs opcionales

## 8. Flujos de Usuario Principales

- Diagramas de secuencia simplificados
- Pasos numerados para cada flujo crítico
- Casos excepcionales y su resolución

## 9. Requisitos No Funcionales

- Seguridad (autenticación/autorización, cifrado)
- Rendimiento (tiempos de respuesta, capacidad)
- Escalabilidad
- Mantenibilidad

## 10. Plan de Implementación

- Dependencias técnicas entre componentes
- Sugerencia de orden de implementación
- Puntos de decisión críticos durante el desarrollo

## Reglas para la Redacción del PRD

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
   - Establece claramente las conexiones entre el problema de negocio y la implementación técnica

## Formato de Entrega

Presenta el PRD completo en formato Markdown, comenzando con un título descriptivo y siguiendo la estructura indicada.

No incluyas información de contexto irrelevante para el desarrollo o justificaciones históricas que no afecten directamente a la implementación técnica.

Enfócate en proporcionar especificaciones claras, directas y accionables que minimicen la ambigüedad para un sistema de IA.

## Instrucciones finales

- Genera el PRD con el formato especificado.
- Revisa la coherencia interna: asegúrate de que no hay contradicciones entre requisitos.
- Verifica que cada requisito técnico esté conectado claramente con un problema o necesidad.
- Elimina cualquier información que no sea estrictamente necesaria para la IA desarrolladora.`

    // For testing purposes, return a mock response if we're in development mode
    if (process.env.NODE_ENV === "development" && !GROQ_API_KEY.startsWith("gsk_")) {
      console.log("Using mock response for development")
      return NextResponse.json({
        blueprint: `# PRD: ${prompt}

## 1. Problema y Contexto
- **Cliente**: Desarrolladores y equipos de producto que necesitan documentación técnica estructurada
- **Problema**: Dificultad para crear PRDs completos y bien estructurados de manera eficiente
- **Evidencia del problema**: Estudios muestran que el 70% de los proyectos fallan por requisitos mal definidos
- **Propuesta de valor única**: Generación automatizada de PRDs detallados usando IA

## 2. Objetivos y Métricas
- **Objetivo principal**: Reducir el tiempo de creación de PRDs en un 80%
- **Métricas de entrada**: Tiempo de generación < 30 segundos, Completitud > 95%
- **Definición de "terminado"**: PRD generado con todas las secciones requeridas y listo para implementación

## 3. Alcance Técnico
- **Tipo de aplicación**: ${productType}
- **Arquitectura recomendada**: Monolítica para MVP, con posibilidad de migrar a microservicios
- **Limitaciones técnicas conocidas**: Necesidad de conexión a internet para acceder a la API de IA

## 4. Stack Tecnológico Recomendado
- **Backend**: Node.js con Express, TypeScript
- **Frontend**: React Native para móvil, Next.js para web
- **Base de datos**: PostgreSQL con Prisma ORM
- **Otras tecnologías**: Redis para caché, AWS S3 para almacenamiento
- **Optimizado para**: ${platform}

## 5. Modelos de Datos
- **Usuario**: id, nombre, email, contraseña, fecha_registro
- **Proyecto**: id, nombre, descripción, fecha_creación, id_usuario
- **PRD**: id, contenido, fecha_generación, id_proyecto
- **Relaciones**: Usuario tiene muchos Proyectos, Proyecto tiene muchos PRDs

## 6. Requisitos Funcionales
- **RF-01**: Generación de PRDs a partir de descripciones en lenguaje natural
- **RF-02**: Exportación de PRDs en múltiples formatos (MD, PDF, HTML)
- **RF-03**: Guardado y gestión de PRDs generados
- **RF-04**: Personalización de plantillas de PRD
- **RF-05**: Integración con herramientas de gestión de proyectos

## 7. Endpoints API
- **POST /api/prd/generate** - Generar nuevo PRD
- **GET /api/prd/:id** - Obtener PRD específico
- **PUT /api/prd/:id** - Actualizar PRD existente
- **GET /api/projects** - Listar proyectos del usuario
- **POST /api/export/:id** - Exportar PRD en formato específico

## 8. Flujos de Usuario Principales
1. **Generación de PRD**:
   - Usuario ingresa descripción del proyecto
   - Sistema procesa la información con IA
   - Sistema genera PRD estructurado
   - Usuario revisa y descarga el PRD

## 9. Requisitos No Funcionales
- **Seguridad**: Autenticación JWT, cifrado de datos sensibles
- **Rendimiento**: Tiempo de generación < 30 segundos
- **Escalabilidad**: Soporte para 10,000 generaciones diarias
- **Mantenibilidad**: Cobertura de pruebas > 80%

## 10. Plan de Implementación
- **Fase 1**: Desarrollo del motor de generación de PRDs
- **Fase 2**: Implementación de la interfaz de usuario
- **Fase 3**: Integración con servicios externos
- **Puntos de decisión**: Selección de proveedor de IA, estrategia de almacenamiento`,
      })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error(`Groq API error: ${response.status} ${errorData}`)
      return NextResponse.json({ error: `Groq API error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ blueprint: data.choices[0].message.content })
  } catch (error) {
    console.error("Error generating PRD:", error)
    return NextResponse.json({ error: "Failed to generate PRD" }, { status: 500 })
  }
}
