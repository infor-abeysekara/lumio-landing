import { Metadata } from 'next';
import { query } from "@/lib/db";
import ProductDetailsClient from "./ProductDetailsClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const { rows } = await query('SELECT name, description, image_url FROM accessories WHERE id = $1', [id]);
    const product = rows[0];

    if (!product) {
      return { title: 'Product Not Found' };
    }

    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.image_url ? [product.image_url] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: product.image_url ? [product.image_url] : [],
      },
    };
  } catch (err) {
    return { title: 'Product' };
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { rows } = await query('SELECT * FROM accessories WHERE id = $1', [id]);
    const product = rows[0];

    if (!product) {
      notFound();
    }

    // Fetch related products (same category, exclude current, limit 4)
    let { rows: relatedProducts } = await query(
      'SELECT * FROM accessories WHERE category = $1 AND id != $2 AND is_approved = true ORDER BY RANDOM() LIMIT 4',
      [product.category, product.id]
    );

    // Fallback if no related products in same category
    if (relatedProducts.length === 0) {
      const { rows: fallbackProducts } = await query(
        'SELECT * FROM accessories WHERE id != $1 AND is_approved = true ORDER BY RANDOM() LIMIT 4',
        [product.id]
      );
      relatedProducts = fallbackProducts;
    }

    return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
  } catch (err) {
    notFound();
  }
}
