/**
 * Generates a WhatsApp link with a pre-filled message for order tracking.
 * 
 * @param customerName Name of the customer
 * @param trackingId Carrier tracking number (guía)
 * @param carrier Name of the shipping carrier
 * @param phoneNumber Optional phone number to send to (defaults to a placeholder or business number)
 * @returns A formatted wa.me link
 */
export function getWhatsAppTrackingLink(
  customerName: string,
  trackingId: string,
  carrier: string,
  phoneNumber: string = "573000000000" // Replace with actual business number
): string {
  const message = `Hola ${customerName}, te informamos que tu pedido ya tiene número de guía.
  
📦 *Transportadora:* ${carrier}
🔢 *Número de Guía:* ${trackingId}

Puedes usar este número directamente en el portal de la transportadora para ver el estado detallado de tu envío.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
