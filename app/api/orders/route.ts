import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { dbMock } from "@/lib/dbMock";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    try {
      let orders: any[] = [];
      if (email) {
        orders = await db.order.findMany({
          where: {
            user: { email: email.toLowerCase().trim() }
          },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true
                  }
                }
              }
            },
            user: true
          }
        });
      } else {
        orders = await db.order.findMany({
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true
                  }
                }
              }
            },
            user: true
          }
        });
      }

      if (orders.length === 0 && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost"))) {
        const mock = dbMock.getOrders();
        return NextResponse.json(email ? mock.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase()) : mock);
      }

      const mappedOrders = orders.map((o: any) => ({
        id: o.id,
        customerName: o.user?.name || "Customer",
        customerEmail: o.user?.email || "customer@gmail.com",
        date: o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        items: o.items.map((i: any) => ({
          id: i.variantId,
          name: i.variant.product.name,
          price: i.price,
          quantity: i.quantity,
          size: i.variant.size || "Free Size",
          color: i.variant.color || "",
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600"
        })),
        shippingAddress: {
          street: "Address Details",
          city: "City",
          state: "State",
          postalCode: "000000",
          phone: "0000000000"
        },
        couponCode: o.couponCode || undefined,
        trackingNumber: o.trackingNumber || undefined
      }));

      return NextResponse.json(mappedOrders);
    } catch (dbError) {
      console.warn("Database failed to get orders, falling back to dbMock:", dbError);
    }

    const mock = dbMock.getOrders();
    return NextResponse.json(email ? mock.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase()) : mock);
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, total, items, shippingAddress, couponCode } = body;

    try {
      let user = await db.user.findUnique({
        where: { email: customerEmail.toLowerCase().trim() }
      });

      if (!user) {
        user = await db.user.create({
          data: {
            email: customerEmail.toLowerCase().trim(),
            name: customerName,
            passwordHash: "customerPassword123"
          }
        });
      }

      const address = await db.address.create({
        data: {
          userId: user.id,
          type: "SHIPPING",
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          phone: shippingAddress.phone,
          isDefault: true
        }
      });

      const newOrder = await db.order.create({
        data: {
          userId: user.id,
          total: parseFloat(total),
          status: "PENDING",
          paymentStatus: "PAID",
          couponCode: couponCode || null,
          shippingAddressId: address.id
        }
      });

      for (const item of items) {
        let variant = await db.productVariant.findFirst({
          where: {
            product: { id: item.productId }
          }
        });

        if (!variant) {
          variant = await db.productVariant.create({
            data: {
              productId: item.productId,
              sku: item.sku || "sku-" + Date.now(),
              stock: 10,
              price: parseFloat(item.price)
            }
          });
        }

        await db.orderItem.create({
          data: {
            orderId: newOrder.id,
            variantId: variant.id,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price)
          }
        });

        await db.productVariant.update({
          where: { id: variant.id },
          data: {
            stock: Math.max(0, variant.stock - parseInt(item.quantity))
          }
        });
      }

      dbMock.trackCustomerPurchase(customerName, customerEmail, shippingAddress.phone, parseFloat(total));

      return NextResponse.json({ success: true, order: newOrder });
    } catch (dbError) {
      console.warn("Database failed to add order, falling back to dbMock:", dbError);
    }

    const newMockOrder = dbMock.addOrder({
      customerName,
      customerEmail,
      total: parseFloat(total),
      items,
      shippingAddress,
      couponCode
    });

    return NextResponse.json({ success: true, order: newMockOrder });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
