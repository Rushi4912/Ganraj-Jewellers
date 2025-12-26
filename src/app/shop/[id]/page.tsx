import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";
import ProductPageClient from "./ProductPageClient";
import {
  SupabaseProductRecord,
  transformSupabaseProduct,
} from "../../utils/transformSupabaseProduct";

export const dynamic = "force-dynamic";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const fetchProductById = async (identifier: string) => {
  const numericId = Number(identifier);
  const candidates = [
    Number.isFinite(numericId) ? { column: "id" as const, value: numericId } : null,
    { column: "slug" as const, value: identifier },
    isUuid(identifier)
      ? { column: "id" as const, value: identifier }
      : null,
  ].filter(Boolean) as { column: "id" | "slug"; value: string | number }[];

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq(candidate.column, candidate.value)
      .maybeSingle<SupabaseProductRecord>();

    if (error) {
      console.error("Product fetch failed for", candidate, ":", error);
      continue;
    }

    if (data) {
      return transformSupabaseProduct(data);
    }
  }

  return null;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}

