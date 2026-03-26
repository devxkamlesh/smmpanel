"use server";

import { createClient } from "@/lib/supabase/server";
import type { Service, Category } from "@/types";

export async function getServices(platform?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("services")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (platform && platform !== "all") {
    query = query.eq("categories.platform", platform);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching services:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      platform,
    });

    // Check if it's an RLS policy error
    if (error.code === "42501" || error.message.includes("policy")) {
      console.error("RLS POLICY ERROR: Services table is not accessible. Run 05_fix_rls_policies.sql");
    }

    return [];
  }

  return data as (Service & { category: Category })[];
}

export async function getServiceById(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching service:", error);
    return null;
  }

  return data as Service & { category: Category };
}

export async function getCategories(platform?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (platform && platform !== "all") {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching categories:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      platform,
    });

    // Check if it's an RLS policy error
    if (error.code === "42501" || error.message.includes("policy")) {
      console.error("RLS POLICY ERROR: Categories table is not accessible. Run 05_fix_rls_policies.sql");
    }

    return [];
  }

  return data as Category[];
}
