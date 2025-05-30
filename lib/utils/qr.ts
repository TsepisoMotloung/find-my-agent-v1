import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: "#DC2626", // Red color for Alliance Insurance theme
        light: "#FFFFFF",
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

export const generateUniqueQRData = (
  type: "agent" | "employee",
  id: number,
): string => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${baseUrl}/rate/${type}/${id}`;
};

export const generateUniqueQRId = (): string => {
  return uuidv4();
};

export const parseQRData = (
  qrData: string,
): { type: "agent" | "employee"; id: number } | null => {
  try {
    const url = new URL(qrData);
    const pathParts = url.pathname.split("/");

    if (pathParts.length >= 4 && pathParts[1] === "rate") {
      const type = pathParts[2] as "agent" | "employee";
      const id = parseInt(pathParts[3]);

      if ((type === "agent" || type === "employee") && !isNaN(id)) {
        return { type, id };
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing QR data:", error);
    return null;
  }
};
