import { 
  Home, 
  ShoppingBag, 
  MapPin, 
  User 
} from "lucide-react"

export const NAVIGATION = [
  { name: "Mis Pedidos", icon: ShoppingBag, id: "orders" },
  { name: "Direcciones", icon: MapPin, id: "addresses" },
  { name: "Mi Perfil", icon: User, id: "profile" },
]

export const MOCK_ORDERS = [
  {
    id: "ORD-7721",
    date: "15 de Abril, 2026",
    status: "En Camino",
    statusColor: "blue",
    trackingId: "LX-99283100",
    total: 85.50,
    items: 3,
    mainImage: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=300",
    productName: "Aceite Esencial de Lavanda + 2 productos"
  },
  {
    id: "ORD-6542",
    date: "02 de Marzo, 2026",
    status: "Entregado",
    statusColor: "green",
    trackingId: "LX-88172655",
    total: 42.00,
    items: 1,
    mainImage: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=300",
    productName: "Jabón Artesanal de Romero"
  },
  {
    id: "ORD-5190",
    date: "12 de Enero, 2026",
    status: "Procesando",
    statusColor: "amber",
    trackingId: "Pendiente",
    total: 156.00,
    items: 5,
    mainImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300",
    productName: "Kit Cuidado Facial Vit-C",
    items_list: [
      { name: "Limpiador Facial", price: 32.00, quantity: 1 },
      { name: "Súrum Vitamina C", price: 45.00, quantity: 1 },
      { name: "Crema Hidratante", price: 38.00, quantity: 1 },
      { name: "Protector Solar", price: 25.00, quantity: 1 },
      { name: "Tónico Facial", price: 16.00, quantity: 1 }
    ],
    address: "Av. Reforma 222, Penthouse 4, CDMX",
    paymentMethod: "Apple Pay"
  }
]

export const MOCK_ADDRESSES = [
  {
    id: "addr_1",
    label: "Casa Principal",
    name: "Salomon V.",
    street: "Calle de las Flores #123",
    city: "Col. Roma Norte, CDMX",
    zip: "06700",
    phone: "+52 55 1234 5678",
    isDefault: true
  },
  {
    id: "addr_2",
    label: "Oficina",
    name: "Salomon V.",
    street: "Av. Paseo de la Reforma #222",
    city: "Juárez, CDMX",
    zip: "06600",
    phone: "+52 55 8765 4321",
    isDefault: false
  }
]

export const USER_DATA = {
    name: "Salomon V.",
    email: "salomon.v@example.com",
    phone: "+52 55 1234 5678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salomon",
    memberSince: "Enero 2024",
    tier: "Cliente Platinum"
}
