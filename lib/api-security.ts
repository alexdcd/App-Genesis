/**
 * Módulo para gestión segura de API keys y llamadas externas
 */

/**
 * Opciones para llamadas a APIs externas
 */
export interface SecureApiCallOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  apiKey?: string;
  keyPrefix?: string; // Prefijo esperado para validación (ej: "gsk_")
  timeout?: number;
  retries?: number;
}

/**
 * Realiza una llamada segura a una API externa
 * - Maneja errores de forma segura (sin exponer claves)
 * - Valida prefijos de API keys
 * - Implementa timeouts y reintentos
 * - Registra intentos fallidos (sin datos sensibles)
 */
export async function secureApiCall<T>({
  endpoint,
  method = 'POST',
  headers = {},
  body,
  apiKey,
  keyPrefix,
  timeout = 30000,
  retries = 1
}: SecureApiCallOptions): Promise<T> {
  // Validar API key si se proporciona un prefijo esperado
  if (apiKey && keyPrefix && !apiKey.startsWith(keyPrefix)) {
    throw new Error(`API key inválida: no comienza con el prefijo esperado`);
  }

  // Preparar headers con autenticación si se proporciona API key
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (apiKey) {
    requestHeaders.Authorization = `Bearer ${apiKey}`;
  }

  // Implementar timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Implementar reintentos
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Espera exponencial entre reintentos
        await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 500));
      }

      const response = await fetch(endpoint, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        // Log seguro sin exponer datos sensibles
        console.error(`API error: ${response.status} - ${response.statusText}`);
        throw new Error(`Error en API externa: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      lastError = error as Error;
      
      // No reintentar en caso de errores de validación o abort
      if (
        error instanceof Error && 
        (error.name === 'AbortError' || error.message.includes('API key inválida'))
      ) {
        break;
      }
      
      // Registrar el intento fallido (sin datos sensibles)
      console.error(`Intento ${attempt + 1}/${retries + 1} fallido: ${error instanceof Error ? error.name : 'Error desconocido'}`);
    }
  }

  // Limpiar el timeout si llegamos aquí por error
  clearTimeout(timeoutId);
  
  // Lanzar el último error capturado
  throw lastError || new Error('Error desconocido en llamada a API externa');
}

/**
 * Realiza una llamada segura a la API de GROQ
 */
export async function callGroqApi<T>(payload: any): Promise<T> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY no está definida');
  }
  
  return secureApiCall<T>({
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    method: 'POST',
    apiKey: GROQ_API_KEY,
    keyPrefix: 'gsk_',
    body: payload,
    timeout: 60000, // 60 segundos para generaciones largas
    retries: 2
  });
}
