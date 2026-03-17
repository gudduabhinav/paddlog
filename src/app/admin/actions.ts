"use server";

export async function verifyAdminPassword(input: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD is not set in environment variables");
    return { success: false, message: "Server configuration error" };
  }

  if (input === adminPassword) {
    return { success: true };
  }

  return { success: false, message: "Invalid Access Key" };
}
