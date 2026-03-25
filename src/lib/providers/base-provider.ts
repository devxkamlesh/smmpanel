// ============================================================
// Base Provider - Abstract Class for SMM Providers
// ============================================================

import type {
  ProviderConfig,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStatusRequest,
  OrderStatusResponse,
  ProviderBalance,
  ProviderServicesResponse,
} from "./types";

export abstract class BaseProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Create an order with the provider
   */
  abstract createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse>;

  /**
   * Get order status from provider
   */
  abstract getOrderStatus(request: OrderStatusRequest): Promise<OrderStatusResponse>;

  /**
   * Get provider balance
   */
  abstract getBalance(): Promise<ProviderBalance>;

  /**
   * Get available services from provider
   */
  abstract getServices(): Promise<ProviderServicesResponse>;

  /**
   * Check if provider is active
   */
  isActive(): boolean {
    return this.config.isActive;
  }

  /**
   * Get provider name
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Get provider ID
   */
  getId(): number {
    return this.config.id;
  }

  /**
   * Map internal order status to provider status
   */
  protected mapStatusToInternal(providerStatus: string): string {
    const statusMap: Record<string, string> = {
      "Pending": "pending",
      "In progress": "in_progress",
      "Processing": "processing",
      "Completed": "completed",
      "Partial": "partial",
      "Canceled": "cancelled",
      "Refunded": "refunded",
      "Failed": "cancelled",
    };

    return statusMap[providerStatus] || "pending";
  }

  /**
   * Handle provider errors
   */
  protected handleError(error: any, context: string): CreateOrderResponse | OrderStatusResponse | ProviderBalance {
    console.error(`[${this.config.name}] ${context}:`, error);
    
    return {
      success: false,
      error: error.message || `Provider error: ${context}`,
    };
  }
}
