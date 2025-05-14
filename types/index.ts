export interface BlueprintRequest {
  prompt: string
  platform: string
  productType: string
}

export interface BlueprintResponse {
  blueprint: string
}

export interface ErrorResponse {
  error: string
}
