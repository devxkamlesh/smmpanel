// ============================================================
// Provider Factory - Provider Selection and Management
// ============================================================

import { BaseProvider } from "./base-provider";
import { SMMProvider } from "./smm-provider";
import type { ProviderConfig } from "./types";

/**
 * Provider Factory
 * Creates and manages provider instances
 */
export class ProviderFactory {
  private static providers: Map<number, BaseProvider> = new Map();

  /**
   * Get provider instance by ID
   */
  static getProvider(providerId: number, config: ProviderConfig): BaseProvider {
    // Return cached provider if exists
    if (this.providers.has(providerId)) {
      return this.providers.get(providerId)!;
    }

    // Create new provider instance
    const provider = this.createProvider(config);
    this.providers.set(providerId, provider);
    
    return provider;
  }

  /**
   * Create provider instance based on type
   */
  private static createProvider(config: ProviderConfig): BaseProvider {
    // For now, we only have SMMProvider
    // In future, add more provider types here:
    // - CustomProvider1
    // - CustomProvider2
    // etc.
    
    return new SMMProvider(config);
  }

  /**
   * Clear provider cache
   */
  static clearCache(): void {
    this.providers.clear();
  }

  /**
   * Remove specific provider from cache
   */
  static removeProvider(providerId: number): void {
    this.providers.delete(providerId);
  }
}

/**
 * Get default provider configuration
 * This should be moved to database (api_providers table) in production
 */
export function getDefaultProviderConfig(): ProviderConfig {
  return {
    id: 1,
    name: process.env.PROVIDER_NAME || "Default Provider",
    apiUrl: process.env.PROVIDER_API_URL || "",
    apiKey: process.env.PROVIDER_API_KEY || "",
    isActive: true,
  };
}

/**
 * Get provider for a specific service
 * In production, this should query the database to find
 * which provider handles this service
 */
export async function getProviderForService(serviceId: number): Promise<{
  provider: BaseProvider;
  providerServiceId: string;
} | null> {
  // TODO: Query database for service mapping
  // For now, use default provider and assume provider_service_id is stored in services table
  
  const config = getDefaultProviderConfig();
  
  if (!config.apiUrl || !config.apiKey) {
    console.error("Provider not configured. Set PROVIDER_API_URL and PROVIDER_API_KEY in .env");
    return null;
  }

  const provider = ProviderFactory.getProvider(config.id, config);
  
  // In production, get this from database
  // For now, we'll pass the service ID as string
  const providerServiceId = serviceId.toString();

  return {
    provider,
    providerServiceId,
  };
}
