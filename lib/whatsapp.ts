const BUSINESS_PHONE = "573246763231";

/**
 * Formats a phone number to be compatible with WhatsApp API (E.164 without +)
 * Adds Colombia prefix (+57) if it's a 10-digit number.
 */
export function formatWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length === 10) {
    return "57" + cleaned;
  }
  
  return cleaned;
}

/**
 * Generates a WhatsApp link for the ADMIN to notify a customer about their tracking info.
 */
export function getWhatsAppTrackingLink(
  customerName: string,
  trackingId: string,
  carrier: string,
  phoneNumber: string
): string {
  const formattedPhone = formatWhatsAppPhone(phoneNumber);
  const message = `Hola ${customerName}, te informamos que tu pedido ya tiene número de guía.
  
📦 *Transportadora:* ${carrier}
🔢 *Número de Guía:* ${trackingId}

Puedes usar este número directamente en el portal de la transportadora para ver el estado detallado de tu envío.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Generates a WhatsApp link for the CUSTOMER to request help with a specific order.
 */
export function getWhatsAppHelpLink(
  orderNumber: string,
  customerName: string = "Cliente",
  phoneNumber: string = BUSINESS_PHONE
): string {
  const formattedPhone = formatWhatsAppPhone(phoneNumber);
  const message = `Hola, necesito ayuda con el rastreo de mi pedido.
  
🆔 *ID de Pedido:* ${orderNumber}
👤 *Nombre:* ${customerName}

¿Podrían darme más información sobre el estado de mi envío?`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Generates a WhatsApp link to contact a customer about their order.
 */
export function getWhatsAppContactLink(
  customerName: string,
  orderId: string,
  phoneNumber: string
): string {
  const formattedPhone = formatWhatsAppPhone(phoneNumber);
  const message = `Hola ${customerName}, te contactamos de La Vie Naturelle sobre tu pedido ${orderId}.`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}
