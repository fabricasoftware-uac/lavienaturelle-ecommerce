/**
 * Centralized business phone number
 */
const BUSINESS_PHONE = "573246763231";

/**
 * Generates a WhatsApp link for the ADMIN to notify a customer about their tracking info.
 */
export function getWhatsAppTrackingLink(
  customerName: string,
  trackingId: string,
  carrier: string,
  phoneNumber: string = BUSINESS_PHONE
): string {
  const message = `Hola ${customerName}, te informamos que tu pedido ya tiene número de guía.
  
📦 *Transportadora:* ${carrier}
🔢 *Número de Guía:* ${trackingId}

Puedes usar este número directamente en el portal de la transportadora para ver el estado detallado de tu envío.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Generates a WhatsApp link for the CUSTOMER to request help with a specific order.
 */
export function getWhatsAppHelpLink(
  orderNumber: string,
  customerName: string = "Cliente",
  phoneNumber: string = BUSINESS_PHONE
): string {
  const message = `Hola, necesito ayuda con el rastreo de mi pedido.
  
🆔 *ID de Pedido:* ${orderNumber}
👤 *Nombre:* ${customerName}

¿Podrían darme más información sobre el estado de mi envío?`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
