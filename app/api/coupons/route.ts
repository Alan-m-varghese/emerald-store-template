import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { dbMock } from "@/lib/dbMock";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code")?.toUpperCase().trim();
    const cartTotal = parseFloat(url.searchParams.get("total") || "0");

    if (!code) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    try {
      const coupon = await db.coupon.findUnique({
        where: { code }
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
          return NextResponse.json({ success: false, error: "Coupon has expired" });
        }

        if (cartTotal < coupon.minOrderValue) {
          return NextResponse.json({ success: false, error: `Minimum order value of ₹${coupon.minOrderValue} required` });
        }

        return NextResponse.json({ success: true, coupon });
      }
    } catch (dbError) {
      console.warn("Database failed to validate coupon, checking dbMock fallback:", dbError);
    }

    const coupons = dbMock.getCoupons();
    const mockCoupon = coupons.find(c => c.code.toUpperCase() === code && c.isActive);

    if (!mockCoupon) {
      return NextResponse.json({ success: false, error: "Invalid coupon code or expired coupon" });
    }

    if (mockCoupon.minOrderValue && cartTotal < mockCoupon.minOrderValue) {
      return NextResponse.json({ success: false, error: `Minimum order value of ₹${mockCoupon.minOrderValue} required` });
    }

    return NextResponse.json({ success: true, coupon: mockCoupon });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
