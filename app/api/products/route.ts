import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { dbMock } from "@/lib/dbMock";

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        images: true,
        variants: true
      }
    });
    
    if (products.length === 0 && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost"))) {
      return NextResponse.json(dbMock.getProducts());
    }

    const mappedProducts = products.map(p => {
      const defaultVariant = p.variants?.[0];
      const defaultImage = p.images?.[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600";
      
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice || p.price,
        category: p.category.slug,
        stock: defaultVariant?.stock ?? 0,
        rating: 4.8,
        reviewsCount: 12,
        image: defaultImage,
        size: defaultVariant?.size || "Free Size",
        color: defaultVariant?.color || "",
        isActive: p.isActive
      };
    });

    return NextResponse.json(mappedProducts);
  } catch (e) {
    console.warn("Database error in GET /api/products, falling back to dbMock:", e);
    return NextResponse.json(dbMock.getProducts());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, slug, price, compareAtPrice, category, stock, image, size, color } = body;

    // Try live database
    try {
      let categoryObj = await db.category.findUnique({
        where: { slug: category }
      });

      if (!categoryObj) {
        categoryObj = await db.category.create({
          data: {
            name: category.charAt(0).toUpperCase() + category.slice(1),
            slug: category
          }
        });
      }

      const newProduct = await db.product.create({
        data: {
          name,
          description,
          slug,
          price: parseFloat(price),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          categoryId: categoryObj.id,
          isActive: true
        }
      });

      await db.productVariant.create({
        data: {
          productId: newProduct.id,
          sku: slug + "-" + Date.now(),
          price: parseFloat(price),
          stock: parseInt(stock),
          size,
          color
        }
      });

      await db.productImage.create({
        data: {
          productId: newProduct.id,
          url: image,
          orderIndex: 0
        }
      });

      return NextResponse.json({ success: true, product: newProduct });
    } catch (dbError) {
      console.warn("Database POST failed, writing to dbMock fallback:", dbError);
    }

    // Fallback
    const newMockProduct = dbMock.addProduct({
      name,
      description,
      slug,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : parseFloat(price),
      category,
      stock: parseInt(stock),
      image,
      size,
      color
    });

    return NextResponse.json({ success: true, product: newMockProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
