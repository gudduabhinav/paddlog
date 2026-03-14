const CHATMITRA_API_KEY = process.env.NEXT_PUBLIC_CHATMITRA_API_KEY;

export async function sendWhatsAppNotification(phone: string, name: string, templateName: string = "hello_world") {
  // 1. Clean phone number: remove all non-digits
  let cleanPhone = phone.replace(/\D/g, "");
  
  // 2. Ensure country code (91 for India)
  // If it's 10 digits, add '91'
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  } 
  // If it's already 12 digits and starts with 91, we're good
  // If it's more than 12 or something else, we leave it as is to allow other country codes
  
  console.log("📨 Sending WhatsApp to:", cleanPhone, "| Template:", templateName);

  if (!CHATMITRA_API_KEY) {
    console.error("❌ WhatsApp API Key is missing in environment variables!");
    return { error: true, message: "API Key missing" };
  }

  try {
    const payload = {
      recipient_mobile_number: cleanPhone,
      messages: [{
        kind: "template",
        template: {
          name: templateName,
          language: "en",
          components: [] // Add variables here if your template needs them
        }
      }],
      customer_name: name
    };

    const response = await fetch("https://backend.chatmitra.com/developer/api/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CHATMITRA_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ChatMitra API Error:", response.status, errorText);
      return { error: true, status: response.status, details: errorText };
    }

    const result = await response.json();
    console.log("✅ ChatMitra Success Response:", result);
    return result;
  } catch (error) {
    console.error("❌ WhatsApp fetch failed:", error);
    return { error: true, message: "Network failure" };
  }
}
