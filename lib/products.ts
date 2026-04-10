import type { Product } from "./store-context"
import { Droplets, Pill, Coffee, type LucideIcon } from "lucide-react"

export interface CategoryConfig {
  id: string
  name: string
  namePlural: string
  description: string
  icon: LucideIcon
  href: string
}

// Scalable categories configuration - add new categories here
export const categories: CategoryConfig[] = [
  { 
    id: "aceites", 
    name: "Aceite Esencial", 
    namePlural: "Aceites Esenciales",
    description: "Aceites puros de grado terapeutico", 
    icon: Droplets,
    href: "/categoria/aceites"
  },
  { 
    id: "suplementos", 
    name: "Suplemento", 
    namePlural: "Suplementos",
    description: "Potenciadores naturales de salud", 
    icon: Pill,
    href: "/categoria/suplementos"
  },
  { 
    id: "tes", 
    name: "Te Herbal", 
    namePlural: "Tes Herbales",
    description: "Mezclas organicas de te", 
    icon: Coffee,
    href: "/categoria/tes"
  },
]

export type Category = (typeof categories)[number]["id"]

// Helper function to get category by id
export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find(cat => cat.id === id)
}

// Helper function to get category icon
export function getCategoryIcon(categoryId: string): LucideIcon {
  const category = getCategoryById(categoryId)
  return category?.icon || Droplets
}

// Helper to get product by id
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export const products: Product[] = [
  // Aceites
  {
    id: "aceite-1",
    name: "Aceite Esencial de Lavanda Organica",
    price: 24.99,
    category: "aceites",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595341595379-cf1cb694ea06?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?w=600&h=600&fit=crop",
    ],
    description: "Aceite puro de lavanda para relajacion y aromaterapia",
    fullDescription: "Nuestro aceite esencial de lavanda organica es destilado al vapor de flores de lavanda cultivadas en los campos de Provenza. Este aceite de grado terapeutico ofrece un aroma floral calmante que promueve la relajacion y el bienestar. Perfecto para difusores, masajes o aplicacion topica cuando se diluye con un aceite portador.",
    badge: "Mas Vendido",
    details: {
      weight: "30ml",
      origin: "Provenza, Francia",
      ingredients: "100% Aceite esencial de Lavandula angustifolia",
      usage: "Anadir 3-5 gotas al difusor, o diluir con aceite portador para uso topico",
      benefits: ["Promueve el sueno reparador", "Reduce el estres y la ansiedad", "Alivia la tension muscular", "Propiedades antibacterianas naturales"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 124
  },
  {
    id: "aceite-2",
    name: "Aceite de Argan Prensado en Frio",
    price: 32.99,
    category: "aceites",
    image: "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608181831718-c9ffd4772645?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop",
    ],
    description: "Aceite premium de argan para piel y cabello",
    fullDescription: "Aceite de argan prensado en frio obtenido de nueces de argan marroquies cultivadas de forma sostenible. Este lujoso aceite es rico en vitamina E, acidos grasos y antioxidantes, lo que lo hace perfecto tanto para el cuidado de la piel como del cabello. No comedogenico y de rapida absorcion.",
    details: {
      weight: "50ml",
      origin: "Marruecos",
      ingredients: "100% Aceite de Argania spinosa organico",
      usage: "Aplicar unas gotas en piel humeda o puntas del cabello",
      benefits: ["Hidratacion intensa", "Reduce arrugas finas", "Fortalece el cabello", "Protege contra danos ambientales"]
    },
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: "aceite-3",
    name: "Aceite Esencial de Eucalipto",
    price: 18.99,
    category: "aceites",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600428877878-1a0fd85beda8?w=600&h=600&fit=crop",
    ],
    description: "Eucalipto refrescante para bienestar respiratorio",
    fullDescription: "Aceite esencial de eucalipto de grado terapeutico destilado de hojas de Eucalyptus globulus. Conocido por su aroma refrescante y mentolado y sus propiedades de apoyo respiratorio. Ideal para aliviar la congestion y crear una atmosfera revitalizante.",
    details: {
      weight: "15ml",
      origin: "Australia",
      ingredients: "100% Aceite esencial de Eucalyptus globulus",
      usage: "Difundir o inhalar para beneficios respiratorios. Diluir para uso topico",
      benefits: ["Despeja las vias respiratorias", "Refresca y energiza", "Apoyo inmunologico natural", "Repele insectos naturalmente"]
    },
    inStock: true,
    rating: 4.7,
    reviews: 67
  },
  {
    id: "aceite-4",
    name: "Aceite de Arbol de Te",
    price: 15.99,
    category: "aceites",
    image: "https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1547793548-7a0e7dfdb24f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
    ],
    description: "Antiseptico natural para el cuidado de la piel",
    fullDescription: "Aceite esencial de arbol de te puro de Australia, famoso por sus potentes propiedades antisepticas y antibacterianas. Este versatil aceite es un elemento basico para el cuidado natural de la piel, ayudando con imperfecciones, irritaciones menores y la salud general de la piel.",
    badge: "Nuevo",
    details: {
      weight: "20ml",
      origin: "Australia",
      ingredients: "100% Aceite esencial de Melaleuca alternifolia",
      usage: "Aplicar diluido en areas afectadas o anadir a productos de cuidado de la piel",
      benefits: ["Antiseptico potente", "Combate imperfecciones", "Calma la irritacion de la piel", "Promueve una piel clara"]
    },
    inStock: true,
    rating: 4.6,
    reviews: 45
  },
  // Suplementos
  {
    id: "suplemento-1",
    name: "Tabletas de Espirulina",
    price: 29.99,
    category: "suplementos",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop",
    ],
    description: "Suplemento de superalimento rico en nutrientes",
    fullDescription: "Tabletas de espirulina organica hechas de espirulina azul-verde cultivada de forma sostenible. Este poderoso superalimento contiene mas de 100 nutrientes incluyendo proteinas, vitaminas, minerales y antioxidantes. Apoya los niveles de energia, la desintoxicacion y el bienestar general.",
    badge: "Popular",
    details: {
      weight: "250 tabletas (500mg cada una)",
      origin: "Hawai, EE.UU.",
      ingredients: "100% Spirulina platensis organica",
      usage: "Tomar 6-10 tabletas diarias con agua o en batidos",
      benefits: ["Alto en proteinas", "Rico en hierro y B12", "Desintoxicante natural", "Potencia la energia"]
    },
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: "suplemento-2",
    name: "Capsulas de Ashwagandha",
    price: 34.99,
    category: "suplementos",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop",
    ],
    description: "Hierba adaptogenica para alivio del estres",
    fullDescription: "Capsulas de raiz de Ashwagandha de espectro completo estandarizadas para una potencia optima. Esta antigua hierba ayurvedica es reconocida por sus propiedades adaptogenicas, ayudando al cuerpo a manejar el estres mientras apoya la energia, el enfoque y el bienestar general.",
    details: {
      weight: "90 capsulas (600mg cada una)",
      origin: "India",
      ingredients: "Extracto de raiz de Ashwagandha organico, celulosa vegetal",
      usage: "Tomar 1-2 capsulas diarias con alimentos",
      benefits: ["Reduce cortisol", "Mejora el enfoque", "Apoya el sueno", "Aumenta la resistencia"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: "suplemento-3",
    name: "Gotas de Vitamina D3",
    price: 19.99,
    category: "suplementos",
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop",
    ],
    description: "Vitamina esencial para apoyo inmunologico",
    fullDescription: "Vitamina D3 liquida de alta potencia derivada de liquen (apta para veganos). Cada gota proporciona 1000 UI de vitamina D3 en una base de aceite de coco MCT para una absorcion optima. Esencial para la funcion inmunologica, la salud osea y el bienestar general.",
    details: {
      weight: "30ml (aprox. 900 gotas)",
      origin: "EE.UU.",
      ingredients: "Vitamina D3 (colecalciferol de liquen), aceite MCT de coco organico",
      usage: "1-2 gotas diarias bajo la lengua o en bebidas",
      benefits: ["Apoyo inmunologico", "Fortalece huesos", "Mejora el animo", "Absorcion rapida"]
    },
    inStock: true,
    rating: 4.7,
    reviews: 98
  },
  {
    id: "suplemento-4",
    name: "Complejo de Curcuma y Jengibre",
    price: 27.99,
    category: "suplementos",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&h=600&fit=crop",
    ],
    description: "Mezcla herbal antiinflamatoria",
    fullDescription: "Mezcla sinergica de extracto de curcuma con curcuminoides y raiz de jengibre organico. Mejorado con pimienta negra (BioPerine) para una absorcion 2000% mayor. Potente formula antiinflamatoria para la salud articular, digestiva y el bienestar general.",
    badge: "Organico",
    details: {
      weight: "60 capsulas",
      origin: "India",
      ingredients: "Extracto de curcuma (95% curcuminoides), extracto de jengibre, extracto de pimienta negra",
      usage: "Tomar 1 capsula dos veces al dia con alimentos",
      benefits: ["Antiinflamatorio natural", "Salud articular", "Apoyo digestivo", "Potente antioxidante"]
    },
    inStock: true,
    rating: 4.8,
    reviews: 134
  },
  // Tes
  {
    id: "te-1",
    name: "Mezcla Sueno de Manzanilla",
    price: 14.99,
    category: "tes",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop",
    ],
    description: "Te herbal calmante para un sueno reparador",
    fullDescription: "Una relajante mezcla de flores de manzanilla organica con lavanda y pasiflora. Esta tisana sin cafeina es perfecta para el ritual nocturno, ayudando a calmar la mente y preparar el cuerpo para un sueno reparador. Sabor suave y floral con un toque de miel natural.",
    badge: "Mas Vendido",
    details: {
      weight: "40 bolsitas de te",
      origin: "Egipto y Francia",
      ingredients: "Flores de manzanilla organica, lavanda, pasiflora, flores de tilo",
      usage: "Infusionar 1 bolsita en agua caliente (90C) por 5-7 minutos",
      benefits: ["Promueve el sueno", "Calma la ansiedad", "Sin cafeina", "Digestion suave"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 178
  },
  {
    id: "te-2",
    name: "Matcha Verde en Polvo",
    price: 38.99,
    category: "tes",
    image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop",
    ],
    description: "Matcha japones premium para energia",
    fullDescription: "Matcha ceremonial de Uji, Kyoto, cultivado a la sombra y molido en piedra. Este te verde de primera calidad ofrece un sabor umami suave con dulzura natural. Rico en L-teanina y antioxidantes, proporciona energia enfocada sin los nervios del cafe.",
    details: {
      weight: "30g (grado ceremonial)",
      origin: "Uji, Kyoto, Japon",
      ingredients: "100% Hojas de te verde matcha organico",
      usage: "Batir 1-2g con agua caliente (70-80C) usando chasen",
      benefits: ["Energia sostenida", "Alto en antioxidantes", "Mejora el enfoque", "Metabolismo activo"]
    },
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: "te-3",
    name: "Refrescante de Menta",
    price: 12.99,
    category: "tes",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600&h=600&fit=crop",
    ],
    description: "Te de menta vigorizante para la digestion",
    fullDescription: "Hojas de menta piperita organica seleccionadas a mano de granjas familiares en el Pacifico Noroeste. Este te refrescante es conocido por sus beneficios digestivos y su sabor vigorizante. Perfecto despues de las comidas o como un estimulante refrescante en cualquier momento del dia.",
    details: {
      weight: "50 bolsitas de te",
      origin: "Oregon, EE.UU.",
      ingredients: "100% Hojas de Mentha piperita organica",
      usage: "Infusionar en agua recien hervida por 3-5 minutos",
      benefits: ["Alivia la digestion", "Refresca el aliento", "Reduce nauseas", "Sin cafeina"]
    },
    inStock: true,
    rating: 4.6,
    reviews: 112
  },
  {
    id: "te-4",
    name: "Infusion de Hibisco y Rosa",
    price: 16.99,
    category: "tes",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop",
    ],
    description: "Te floral rico en antioxidantes",
    fullDescription: "Una hermosa mezcla de flores de hibisco rubi y petalos de rosa delicados. Esta infusion naturalmente dulce y tarteena es rica en vitamina C y antioxidantes. Disfruta caliente para un momento de indulgencia o helada para una bebida refrescante de verano.",
    badge: "Nuevo",
    details: {
      weight: "45 bolsitas de te",
      origin: "Sudan y Bulgaria",
      ingredients: "Flores de hibisco organico, petalos de rosa, escaramujo, flor de sauco",
      usage: "Infusionar en agua caliente 5-7 minutos. Excelente frio con hielo",
      benefits: ["Rico en vitamina C", "Apoya el corazon", "Belleza para la piel", "Refrescante natural"]
    },
    inStock: true,
    rating: 4.7,
    reviews: 67
  },
]
