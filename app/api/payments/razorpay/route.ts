import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR" } = body;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.warn("Razorpay API credentials not found. Falling back to local simulation mode.");
      return NextResponse.json({
        success: true,
        simulated: true,
        orderId: "order_sim_" + Date.now(),
        amount: amount * 100
      });
    }

    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt: "receipt_" + Date.now()
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay Order creation failed: ${errorText}`);
    }

    const order = await response.json();
    return NextResponse.json({
      success: true,
      simulated: false,
      orderId: order.id,
      amount: order.amount
    });

  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
