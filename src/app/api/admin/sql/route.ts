import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    const upperQuery = trimmedQuery.toUpperCase();
    
    // Parse table name from query
    const tableMatch = trimmedQuery.match(/FROM\s+(\w+)/i) || trimmedQuery.match(/INTO\s+(\w+)/i) || trimmedQuery.match(/UPDATE\s+(\w+)/i) || trimmedQuery.match(/DELETE\s+FROM\s+(\w+)/i);
    const tableName = tableMatch?.[1];

    if (!tableName) {
      return NextResponse.json({ error: "Could not parse table name from query" }, { status: 400 });
    }

    if (upperQuery.startsWith("SELECT")) {
      // For SELECT queries, try to execute directly
      const { data, error } = await supabase
        .from(tableName)
        .select("*");
      
      if (error) throw error;
      return NextResponse.json({ data });
    } else if (upperQuery.startsWith("DELETE")) {
      // For DELETE queries
      const { error, count } = await supabase
        .from(tableName)
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
      
      if (error) throw error;
      return NextResponse.json({ 
        success: true, 
        rowCount: count,
        message: `Deleted records from ${tableName}` 
      });
    } else {
      return NextResponse.json(
        { error: "For complex queries, please use Supabase SQL Editor directly. This interface supports basic SELECT and DELETE operations." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("SQL execution error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute query" },
      { status: 500 }
    );
  }
}
