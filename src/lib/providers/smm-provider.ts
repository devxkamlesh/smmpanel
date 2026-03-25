// ============================================================
// Generic SMM Provider - Compatible with most SMM panel APIs
// ============================================================

import { BaseProvider } from "./base-provider";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStatusRequest,
  OrderStatusResponse,
  ProviderBalance,
  ProviderServicesResponse,
} from "./types";

/**
 * Generic SMM Provider Client
 * Compatible with standard SMM panel API format
 * Used by: JustAnotherPanel, PerfectPanel, SMMHeaven, etc.
 */
export class SMMProvider extends BaseProvider {
  /**
   * Create order with provider
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: this.config.apiKey,
          action: "add",
          service: request.service,
          link: request.link,
          quantity: request.quantity,
          ...(request.runs && { runs: request.runs }),
          ...(request.interval && { interval: request.interval }),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle provider error response
      if (data.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      // Success response
      return {
        success: true,
        order: data.order,
        charge: data.charge,
        start_count: data.start_count,
        status: data.status,
        remains: data.remains,
      };
    } catch (error: any) {
      return this.handleError(error, "createOrder") as CreateOrderResponse;
    }
  }

  /**
   * Get order status from provider
   */
  async getOrderStatus(request: OrderStatusRequest): Promise<OrderStatusResponse> {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: this.config.apiKey,
          action: "status",
          order: request.order,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Handle provider error
      if (data.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      // Success response
      return {
        success: true,
        order: data.order,
        status: this.mapStatusToInternal(data.status),
        charge: data.charge,
        start_count: data.start_count,
        remains: data.remains,
      };
    } catch (error: any) {
      return this.handleError(error, "getOrderStatus") as OrderStatusResponse;
    }
  }

  /**
   * Get provider balance
   */
  async getBalance(): Promise<ProviderBalance> {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: this.config.apiKey,
          action: "balance",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      return {
        success: true,
        balance: parseFloat(data.balance),
        currency: data.currency || "USD",
      };
    } catch (error: any) {
      return this.handleError(error, "getBalance") as ProviderBalance;
    }
  }

  /**
   * Get available services from provider
   */
  async getServices(): Promise<ProviderServicesResponse> {
    try {
      const response = await fetch(this.config.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: this.config.apiKey,
          action: "services",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        return {
          success: false,
          error: data.error,
        };
      }

      return {
        success: true,
        services: Array.isArray(data) ? data : [],
      };
    } catch (error: any) {
      return this.handleError(error, "getServices") as ProviderServicesResponse;
    }
  }

  /**
   * Test provider connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const balance = await this.getBalance();
      return balance.success;
    } catch {
      return false;
    }
  }
}
