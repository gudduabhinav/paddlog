"use server";

interface CreatePaymentLinkParams {
  name: string;
  email: string;
  phone: string;
  amount: number; // in rupees
  service: string;
  notes?: string;
}

export async function createDynamicPaymentLink(params: CreatePaymentLinkParams) {
  const { name, email, phone, amount, service, notes } = params;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { success: false, error: "Payment configuration missing." };
  }

  // Get the app URL for callback
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://paddlog.com";

  try {
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const body = {
      amount: Math.round(amount * 100), // Razorpay uses paise
      currency: "INR",
      description: service,
      customer: {
        name,
        email,
        contact: phone.startsWith("+") ? phone : `+91${phone.replace(/\s|-/g, "")}`,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: false,
      // After payment, Razorpay redirects here
      callback_url: `${baseUrl}/pay/success`,
      callback_method: "get",
      notes: {
        service_type: service,
        custom_notes: notes || "",
        source: "paddlog_pay_page",
      },
      // Link expires in 24 hours
      expire_by: Math.floor(Date.now() / 1000) + 86400,
    };

    const response = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Razorpay API error:", data);
      return {
        success: false,
        error: data.error?.description || "Could not create payment link.",
      };
    }

    return {
      success: true,
      paymentLink: data.short_url, // e.g. https://rzp.io/l/xxxxx  (pre-filled!)
      paymentLinkId: data.id,
    };
  } catch (err: any) {
    console.error("createDynamicPaymentLink error:", err);
    return { success: false, error: "Network error. Please try again." };
  }
}
