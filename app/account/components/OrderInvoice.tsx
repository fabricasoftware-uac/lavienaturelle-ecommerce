"use client"

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import { MappedOrder } from "@/lib/supabase/types/database"
import { formatPrice } from "@/lib/utils"

// Register fonts for a more premium look (optional, using standard ones for now)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1917",
    marginBottom: 4,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 10,
    color: "#78716C",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1C1917",
    marginBottom: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F4",
    paddingBottom: 5,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoBlock: {
    width: "45%",
  },
  label: {
    fontSize: 8,
    color: "#A8A29E",
    textTransform: "uppercase",
    marginBottom: 4,
    fontWeight: "bold",
  },
  value: {
    fontSize: 10,
    color: "#44403C",
    lineHeight: 1.4,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1C1917",
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F4",
  },
  colProduct: { flex: 3 },
  colQty: { flex: 0.5, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  headerText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1C1917",
  },
  itemText: {
    fontSize: 10,
    color: "#44403C",
  },
  summary: {
    marginTop: 30,
    alignSelf: "flex-end",
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#1C1917",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1C1917",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F4",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#A8A29E",
  }
})

interface OrderInvoiceProps {
  order: MappedOrder
}

export function OrderInvoice({ order }: OrderInvoiceProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>LA VIE NATURELLE</Text>
          <Text style={styles.tagline}>Soluciones de origen natural</Text>
        </View>

        {/* Order Meta */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>Recibo de Pedido</Text>
          <Text style={styles.value}>Número: #{order.id}</Text>
          <Text style={styles.value}>Fecha: {order.date}</Text>
        </View>

        {/* Customer & Shipping Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Enviar a:</Text>
            <Text style={[styles.value, { fontWeight: "bold" }]}>{order.full_name}</Text>
            <Text style={styles.value}>{order.address}</Text>
            <Text style={styles.value}>Tel: {order.phone || "N/A"}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Detalles de Pago:</Text>
            <Text style={styles.value}>Método: {order.paymentMethod}</Text>
            <Text style={styles.value}>Estado: {order.status}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Resumen de Artículos</Text>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colProduct]}>Producto</Text>
            <Text style={[styles.headerText, styles.colQty]}>Cant.</Text>
            <Text style={[styles.headerText, styles.colPrice]}>Precio</Text>
            <Text style={[styles.headerText, styles.colTotal]}>Total</Text>
          </View>

          {order.order_items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.itemText, styles.colProduct]}>{item.product_name_snapshot || "Producto"}</Text>
              <Text style={[styles.itemText, styles.colQty]}>{item.quantity}</Text>
              <Text style={[styles.itemText, styles.colPrice]}>{formatPrice(item.unit_price)}</Text>
              <Text style={[styles.itemText, styles.colTotal]}>{formatPrice(item.total_price)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.itemText}>Subtotal</Text>
            <Text style={styles.itemText}>{formatPrice(order.total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.itemText}>Envío</Text>
            <Text style={styles.itemText}>Gratis</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Gracias por elegir La Vie Naturelle. Este documento es un comprobante de compra válido.
          </Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>
            lavienaturelle.com | Soporte: contacto@lavienaturelle.com
          </Text>
        </View>
      </Page>
    </Document>
  )
}
