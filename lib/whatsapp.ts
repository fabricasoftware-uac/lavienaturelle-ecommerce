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

/**
 * Generates a WhatsApp link to send a new order notification to the business.
 * The customer clicks this to share their order details via WhatsApp.
 */
export function getWhatsAppOrderLink(order: {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  documentNumber: string
  shippingAddress: string
  shippingAddress2?: string
  shippingCity: string
  shippingState: string
  items: {
    name: string
    quantity: number
    price: number
    wholesalePrice?: number | null
    wholesaleMinQuantity?: number | null
  }[]
  total: number
}): string {
  const fmt = (n: number) =>
    "$" + n.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const itemsText = order.items
    .map((item) => {
      const minQty = item.wholesaleMinQuantity && item.wholesaleMinQuantity > 0 ? item.wholesaleMinQuantity : 12
      const wholesaleTag =
        item.quantity >= minQty && item.wholesalePrice && Number(item.wholesalePrice) > 0
          ? " (Precio al por mayor)"
          : ""
      return `\u2022 ${item.name} x${item.quantity}${wholesaleTag} - ${fmt(item.price * item.quantity)}`
    })
    .join("\n")

  const address = [
    order.shippingAddress,
    order.shippingAddress2,
    `${order.shippingCity}, ${order.shippingState}`,
  ]
    .filter(Boolean)
    .join(", ")

  const message = [
    `\u{1F6D2} *Nuevo Pedido - La Vie Naturelle*`,
    ``,
    `\u{1F4E6} *Pedido:* ${order.orderNumber}`,
    `\u{1F464} *Cliente:* ${order.customerName}`,
    `\u{1F4E7} *Email:* ${order.customerEmail}`,
    `\u{1F4F1} *Tel\u00E9fono:* ${order.customerPhone}`,
    `\u{1F194} *Documento:* ${order.documentNumber}`,
    ``,
    `\u{1F4CD} *Env\u00EDo:*`,
    address,
    ``,
    `\u{1F6CD}\u{FE0F} *Productos:*`,
    itemsText,
    ``,
    `\u{1F4B0} *Total:* ${fmt(order.total)}`,
    ``,
    `\u{1F4AC} *Pendiente:* Contactar al cliente para confirmar pago y envio.`,
  ].join("\n")

  return `https://wa.me/${formatWhatsAppPhone(BUSINESS_PHONE)}?text=${encodeURIComponent(message)}`
}
