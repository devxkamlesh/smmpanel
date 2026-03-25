// ============================================================
// SMM Panel - TypeScript Type Definitions
// ============================================================

export interface Profile {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  balance: number;
  role: "user" | "admin" | "reseller";
  status: "active" | "suspended" | "banned";
  api_key: string | null;
  account_points: number;
  total_spent: number;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  platform: Platform;
  icon_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  type: "default" | "subscription" | "drip-feed";
  rate: number;
  min_quantity: number;
  max_quantity: number;
  refill: boolean;
  refill_days: number | null;
  average_time: string | null;
  speed: string | null;
  quality: string | null;
  features: Record<string, unknown> | null;
  country: string | null;
  is_active: boolean;
  sort_order: number;
  provider_service_id: string | null;
  provider_id: number | null;
  created_at: string;
  category?: Category;
}

export interface Order {
  id: number;
  user_id: string;
  service_id: number;
  link: string;
  quantity: number;
  charge: number;
  status: OrderStatus;
  start_count: number | null;
  remains: number | null;
  external_order_id: string | null;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface Transaction {
  id: number;
  user_id: string;
  type: "deposit" | "purchase" | "refund" | "bonus";
  amount: number;
  balance_after: number | null;
  description: string | null;
  payment_method: string | null;
  payment_id: string | null;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

export interface Ticket {
  id: number;
  user_id: string;
  subject: string;
  status: "open" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface ApiProvider {
  id: number;
  name: string;
  api_url: string;
  api_key: string;
  balance: number | null;
  is_active: boolean;
  created_at: string;
}

export interface UserFavorite {
  id: number;
  user_id: string;
  service_id: number;
  created_at: string;
  service?: Service;
}

export interface AutoSubscription {
  id: number;
  user_id: string;
  service_id: number;
  link: string;
  quantity: number;
  interval_hours: number;
  runs_remaining: number | null;
  status: "active" | "paused" | "completed";
  next_run_at: string | null;
  created_at: string;
  service?: Service;
}

// ============================================================
// Enums & Constants
// ============================================================

export type Platform =
  | "all"
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "telegram"
  | "spotify"
  | "soundcloud"
  | "whatsapp"
  | "threads"
  | "reddit"
  | "quora"
  | "deezer"
  | "audiomack"
  | "website_traffic";

export type OrderStatus =
  | "pending"
  | "processing"
  | "in_progress"
  | "completed"
  | "partial"
  | "cancelled"
  | "refunded";

export interface PlatformInfo {
  id: Platform;
  label: string;
  icon: string;
  color: string;
}

export const PLATFORMS: PlatformInfo[] = [
  { id: "all", label: "All", icon: "🌐", color: "#737686" },
  { id: "facebook", label: "Facebook", icon: "👤", color: "#1877F2" },
  { id: "instagram", label: "Instagram", icon: "📷", color: "#E4405F" },
  { id: "twitter", label: "Twitter", icon: "𝕏", color: "#000000" },
  { id: "linkedin", label: "Linkedin", icon: "💼", color: "#0A66C2" },
  { id: "youtube", label: "Youtube", icon: "▶️", color: "#FF0000" },
  { id: "tiktok", label: "TikTok", icon: "🎵", color: "#000000" },
  { id: "telegram", label: "Telegram", icon: "✈️", color: "#26A5E4" },
  { id: "spotify", label: "Spotify", icon: "🎧", color: "#1DB954" },
  { id: "soundcloud", label: "Soundcloud", icon: "☁️", color: "#FF5500" },
  { id: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366" },
  { id: "threads", label: "Threads", icon: "@", color: "#000000" },
  { id: "reddit", label: "Reddit", icon: "🤖", color: "#FF4500" },
  { id: "quora", label: "Quora", icon: "❓", color: "#A82400" },
  { id: "deezer", label: "Deezer", icon: "🎶", color: "#A238FF" },
  { id: "audiomack", label: "AudioMack", icon: "🎤", color: "#FFA200" },
  { id: "website_traffic", label: "Website Traffic", icon: "📊", color: "#0051b1" },
];

// Navigation items for sidebar
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "New order", href: "/new-order", icon: "plus-circle" },
  { label: "Mass order", href: "/mass-order", icon: "layers" },
  { label: "Add funds", href: "/add-funds", icon: "wallet" },
  { label: "Tickets", href: "/tickets", icon: "message-square" },
  { label: "Services", href: "/services", icon: "settings" },
  { label: "Orders", href: "/orders", icon: "shopping-cart" },
  { label: "API", href: "/api-docs", icon: "code" },
  { label: "Child panel", href: "/child-panel", icon: "users" },
  { label: "Affiliates", href: "/affiliates", icon: "share-2" },
];
