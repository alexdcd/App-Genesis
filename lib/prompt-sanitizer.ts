/**
 * Módulo de seguridad para sanitización de prompts
 * 
 * Este módulo proporciona funciones para sanitizar los inputs de usuario
 * antes de enviarlos a APIs de IA, previniendo ataques de prompt injection
 */

/**
 * Tipos de sanitización disponibles
 */
export type SanitizationLevel = 'basic' | 'strict' | 'markdown-safe';

/**
 * Parámetros de configuración para la sanitización
 */
export interface SanitizationOptions {
  /** Nivel de sanitización a aplicar */
  level: SanitizationLevel;
  /** Límite máximo de caracteres (prevención de DoS) */
  maxLength?: number;
  /** Caracteres permitidos (solo aplicable en modo strict) */
  allowedChars?: RegExp;
  /** Palabras o patrones prohibidos */
  blockedPatterns?: RegExp[];
}

/**
 * Opciones predeterminadas para la sanitización
 */
const DEFAULT_OPTIONS: SanitizationOptions = {
  level: 'markdown-safe',
  maxLength: 5000, // Prevención de ataques DoS
  blockedPatterns: [
    // Patrones que podrían usarse para manipular prompts de sistema
    /ignore previous instructions/i,
    /disregard (all|your) instructions/i,
    /system prompt/i,
    /you are now/i,
    /act as/i,
    /(forget|ignore) your training/i,
  ]
};

/**
 * Sanitiza un prompt de usuario para prevenir ataques de prompt injection
 * 
 * @param input El texto de entrada del usuario
 * @param options Opciones de sanitización personalizadas (opcional)
 * @returns El texto sanitizado seguro para usar en prompts
 */
export function sanitizePrompt(
  input: string,
  options: Partial<SanitizationOptions> = {}
): string {
  // Combinar opciones predeterminadas con personalizadas
  const config: SanitizationOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Paso 1: Validar que el input es un string
  if (typeof input !== 'string') {
    throw new Error('El input debe ser un string');
  }

  // Paso 2: Limitar longitud para prevenir ataques DoS
  let sanitized = input.slice(0, config.maxLength || DEFAULT_OPTIONS.maxLength);

  // Paso 3: Aplicar sanitización según el nivel especificado
  switch (config.level) {
    case 'basic':
      // Sanitización básica (conservadora)
      sanitized = basicSanitization(sanitized);
      break;
    case 'strict':
      // Sanitización estricta (más restrictiva)
      sanitized = strictSanitization(sanitized, config);
      break;
    case 'markdown-safe':
    default:
      // Sanitización segura para markdown (equilibrada)
      sanitized = markdownSafeSanitization(sanitized);
      break;
  }

  // Paso 4: Verificar patrones bloqueados
  if (config.blockedPatterns && config.blockedPatterns.length > 0) {
    for (const pattern of config.blockedPatterns) {
      if (pattern.test(sanitized)) {
        // Reemplazar patrones bloqueados con [contenido filtrado]
        sanitized = sanitized.replace(pattern, '[contenido filtrado]');
      }
    }
  }

  return sanitized;
}

/**
 * Sanitización básica que solo elimina caracteres potencialmente peligrosos
 */
function basicSanitization(input: string): string {
  return input
    // Eliminar backticks que podrían cerrar bloques de código
    .replace(/`/g, "'")
    // Convertir caracteres de escape que podrían romper strings
    .replace(/\\/g, "\\\\");
}

/**
 * Sanitización estricta que solo permite ciertos caracteres
 */
function strictSanitization(input: string, options: SanitizationOptions): string {
  if (options.allowedChars) {
    // Filtrar solo caracteres permitidos
    return input.split('')
      .filter(char => options.allowedChars?.test(char))
      .join('');
  }
  
  // Eliminar caracteres potencialmente peligrosos
  return input
    // Eliminar backticks
    .replace(/`/g, "'")
    // Eliminar caracteres de escape
    .replace(/\\/g, "")
    // Eliminar caracteres de control
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "")
    // Eliminar llaves, corchetes y paréntesis que podrían usarse en inyecciones
    .replace(/[\{\}\[\]\(\)]/g, " ");
}

/**
 * Sanitización que mantiene formato markdown pero elimina elementos peligrosos
 */
function markdownSafeSanitization(input: string): string {
  return input
    // Prevenir escape de bloques de código
    .replace(/```/g, "'''")
    // Asegurar que las comillas estén bien formadas
    .replace(/(?<!\\)"/g, "\"")
    // Prevenir inyecciones de HTML
    .replace(/<\/?script/gi, "&lt;script")
    .replace(/<\/?iframe/gi, "&lt;iframe")
    .replace(/<\/?img/gi, "&lt;img")
    // Normalizar saltos de línea
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

/**
 * Valida que un prompt sanitizado no contiene elementos peligrosos
 * 
 * @param sanitizedPrompt El prompt ya sanitizado
 * @returns Un objeto indicando si es válido y un mensaje opcional
 */
export function validateSanitizedPrompt(
  sanitizedPrompt: string
): { valid: boolean; message?: string } {
  // Verificar longitud mínima
  if (!sanitizedPrompt || sanitizedPrompt.trim().length < 3) {
    return {
      valid: false,
      message: 'El prompt es demasiado corto'
    };
  }

  // Verificar proporción de caracteres especiales (posible ataque)
  const specialCharCount = (sanitizedPrompt.match(/[^\w\s]/g) || []).length;
  const specialCharRatio = specialCharCount / sanitizedPrompt.length;
  
  if (specialCharRatio > 0.3) {
    return {
      valid: false,
      message: 'El prompt contiene demasiados caracteres especiales'
    };
  }

  return { valid: true };
}
