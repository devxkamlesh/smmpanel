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
    console.error("Error fetching services:", error);
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
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}
