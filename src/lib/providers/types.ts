// ============================================================
// Provider Types - SMM Panel
// ============================================================

export interface ProviderConfig {
  id: number;
  name: string;
  apiUrl: string;
  apiKey: string;
  isActive: boolean;
}

export interface ProviderServiceMapping {
  internalServiceId: number;
  providerId: number;
  providerServiceId: string;
}

export interface CreateOrderRequest {
  service: string; // Provider service ID
  link: string;
  quantity: number;
  runs?: number; // For subscription services
  interval?: number; // For subscription services
  comments?: string; // For custom comments services
}

export interface CreateOrderResponse {
  success: boolean;
  order?: string | number; // Provider order ID
  error?: string;
  charge?: number;
  start_count?: number;
  status?: string;
  remains?: number;
}

export interface OrderStatusRequest {
  order: string | number; // Provider order ID
}

export interface OrderStatusResponse {
  success: boolean;
  order?: string | number;
  status?: string;
  charge?: number;
  start_count?: number;
  remains?: number;
  error?: string;
}

export interface ProviderBalance {
  success: boolean;
  balance?: number;
  currency?: string;
  error?: string;
}

export interface ProviderService {
  service: string | number;
  name: string;
  type: string;
  rate: number;
  min: number;
  max: number;
  category?: string;
}

export interface ProviderServicesResponse {
  success: boolean;
  services?: ProviderService[];
  error?: string;
}

export type ProviderOrderStatus = 
  | "Pending"
  | "In progress" 
  | "Processing"
  | "Completed"
  | "Partial"
  | "Canceled"
  | "Refunded"
  | "Failed";

export interface ProviderError extends Error {
  code?: string;
  statusCode?: number;
  providerResponse?: any;
}
