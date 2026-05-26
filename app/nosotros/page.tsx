"use client"

import Link from "next/link"
import { Footer } from "@/components/footer"
import { CartDrawer } from "@/components/cart-drawer"
import { 
  Leaf, 
  Heart, 
  Globe, 
  ShieldCheck,
  Sprout,
  ArrowRight,
  Target,
  Eye,
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

function AboutPageContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-background overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sprout className="h-4 w-4" />
                Nuestra Historia
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground leading-tight text-balance">
                En La Vie Naturelle creamos soluciones de origen{" "}
                <span className="text-primary">Natural</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Integramos conocimiento en fitoterapia, procesos técnicos rigurosos y 
                encadenamientos productivos locales para fortalecer el bienestar integral 
                y aportar al desarrollo sostenible del territorio.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Nuestra Misión</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  En La Vie Naturelle creamos soluciones capilares de origen vegetal dirigidas a hombres y
                  mujeres que buscan alternativas efectivas y confiables. Integramos conocimiento en fitoterapia,
                  procesos técnicos rigurosos y encadenamientos productivos locales. Existimos para fortalecer
                  el bienestar integral y aportar al desarrollo sostenible del territorio.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-card border border-border rounded-[40px] p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Nuestra Visión</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  En La Vie Naturelle buscamos consolidarnos en los próximos cinco años como una marca
                  referente en cosmética natural a nivel regional y nacional, reconocida por la efectividad de
                  nuestras soluciones capilares y por nuestro modelo de producción responsable. Proyectamos
                  un crecimiento sostenible, basado en la calidad, la integridad, el respeto y el compromiso social
                  con el territorio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
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
                    className="bg-card p-8 rounded-[32px] border border-border hover:border-primary/20 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-background mb-4">
              Descubre Nuestros Productos
            </h2>
            <p className="text-background/70 max-w-2xl mx-auto mb-8">
              Soluciones capilares de origen vegetal, creadas con fitoterapia, procesos técnicos rigurosos 
              y compromiso con el desarrollo sostenible del territorio.
            </p>
            <Link href="/#catalogo">
              <Button size="lg" variant="outline" className="rounded-2xl h-14 px-10 font-bold border-background/20 text-background hover:bg-background/10 transition-all">
                Explorar Productos
                <ArrowRight className="ml-2 h-4 w-4" />
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
  return <AboutPageContent />
}
