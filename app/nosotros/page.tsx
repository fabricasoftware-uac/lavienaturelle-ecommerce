"use client"

import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { StoreProvider } from "@/lib/store-context"
import { 
  Leaf, 
  Heart, 
  Globe, 
  Award, 
  Users, 
  Sprout,
  ShieldCheck,
  Recycle,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Todos nuestros productos son elaborados con ingredientes naturales, sin quimicos ni aditivos artificiales."
  },
  {
    icon: Heart,
    title: "Bienestar Integral",
    description: "Creemos en el bienestar holístico - cuerpo, mente y espíritu en perfecta armonía."
  },
  {
    icon: Globe,
    title: "Sostenibilidad",
    description: "Comprometidos con el medio ambiente, desde el origen de nuestros ingredientes hasta el empaque."
  },
  {
    icon: ShieldCheck,
    title: "Calidad Certificada",
    description: "Cada producto pasa por rigurosos controles de calidad para garantizar su pureza y efectividad."
  }
]

const milestones = [
  { year: "2015", title: "Fundacion", description: "Nace La Vie Naturelle con la vision de acercar productos naturales a todos." },
  { year: "2017", title: "Expansion", description: "Abrimos nuestra primera tienda fisica y ampliamos nuestra linea de productos." },
  { year: "2019", title: "Certificacion Organica", description: "Obtenemos certificaciones organicas internacionales para nuestros productos." },
  { year: "2021", title: "Comunidad", description: "Alcanzamos 50,000 clientes satisfechos y lanzamos nuestro programa de fidelidad." },
  { year: "2024", title: "Innovacion", description: "Introducimos nuevas lineas de productos y expandimos a toda Latinoamerica." }
]

const team = [
  {
    name: "Maria Garcia",
    role: "Fundadora y CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    description: "Naturópata con mas de 15 años de experiencia en medicina natural."
  },
  {
    name: "Carlos Rodriguez",
    role: "Director de Productos",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    description: "Quimico especializado en formulaciones naturales y organicas."
  },
  {
    name: "Ana Martinez",
    role: "Directora de Sostenibilidad",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    description: "Experta en cadenas de suministro sostenibles y comercio justo."
  }
]

const stats = [
  { value: "50K+", label: "Clientes Satisfechos" },
  { value: "200+", label: "Productos Naturales" },
  { value: "15", label: "Paises" },
  { value: "98%", label: "Satisfaccion" }
]

function AboutPageContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sprout className="h-4 w-4" />
                  Nuestra Historia
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground leading-tight text-balance">
                  Conectando la Naturaleza con tu Bienestar
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
                  En La Vie Naturelle, creemos que la naturaleza tiene todo lo que necesitamos 
                  para vivir una vida plena y saludable. Desde 2015, nos dedicamos a seleccionar 
                  los mejores productos naturales del mundo y acercarlos a tu hogar.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Cada producto que ofrecemos ha sido cuidadosamente elegido por su calidad, 
                  pureza y compromiso con el medio ambiente. Trabajamos directamente con 
                  productores locales y comunidades agricolas que comparten nuestra vision 
                  de un mundo mas sostenible.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/#catalogo">
                    <Button size="lg" className="rounded-full gap-2">
                      Ver Productos
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#valores">
                    <Button size="lg" variant="outline" className="rounded-full">
                      Nuestros Valores
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative aspect-square rounded-3xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop"
                    alt="Productos naturales La Vie Naturelle"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Certificado Organico</p>
                      <p className="text-sm text-muted-foreground">Desde 2019</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-serif text-4xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="mt-2 text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section id="valores" className="py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Nuestros Valores
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Los principios que guian cada decision que tomamos y cada producto que ofrecemos.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div 
                    key={index}
                    className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=500&fit=crop"
                        alt="Aceites esenciales"
                        width={400}
                        height={500}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop"
                        alt="Tes herbales"
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="aspect-square rounded-2xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&h=400&fit=crop"
                        alt="Suplementos naturales"
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=500&fit=crop"
                        alt="Productos organicos"
                        width={400}
                        height={500}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-6">
                  Nuestra Mision
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Democratizar el acceso a productos naturales de alta calidad, fomentando 
                  un estilo de vida saludable y consciente con el medio ambiente.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Creemos que todos merecen tener acceso a productos puros y efectivos 
                  que mejoren su calidad de vida. Por eso trabajamos incansablemente para 
                  ofrecer lo mejor de la naturaleza a precios accesibles.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                      <Recycle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Empaque Sostenible</h4>
                      <p className="text-sm text-muted-foreground">
                        Utilizamos materiales reciclados y biodegradables en todos nuestros empaques.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Comercio Justo</h4>
                      <p className="text-sm text-muted-foreground">
                        Trabajamos directamente con comunidades agricolas, garantizando precios justos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Nuestro Camino
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Un recorrido de crecimiento, aprendizaje y compromiso con el bienestar.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background md:-translate-x-1/2 z-10" />
                    
                    {/* Content */}
                    <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="bg-card p-6 rounded-2xl border border-border inline-block">
                        <span className="text-primary font-semibold">{milestone.year}</span>
                        <h3 className="font-semibold text-lg text-foreground mt-1">{milestone.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Spacer for opposite side */}
                    <div className="hidden md:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Nuestro Equipo
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Las personas apasionadas detras de La Vie Naturelle.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                    <p className="text-primary text-sm font-medium">{member.role}</p>
                    <p className="text-muted-foreground text-sm mt-2">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-primary-foreground mb-4">
              Unete a Nuestra Comunidad
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Descubre el poder de la naturaleza y transforma tu bienestar con nuestros 
              productos naturales cuidadosamente seleccionados.
            </p>
            <Link href="/#catalogo">
              <Button size="lg" variant="secondary" className="rounded-full gap-2">
                Explorar Productos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <StoreProvider>
      <AboutPageContent />
    </StoreProvider>
  )
}
