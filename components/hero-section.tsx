"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              100% Natural y Organico
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight text-balance">
              Abraza el poder de la{" "}
              <span className="text-primary">naturaleza</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              En La Vie Naturelle creamos soluciones capilares de origen vegetal
              dirigidas a hombres y mujeres que buscan alternativas efectivas y
              confiables. Integramos conocimiento en fitoterapia, procesos
              técnicos rigurosos y encadenamientos productivos locales. Existimos
              para fortalecer el bienestar integral y aportar al desarrollo
              sostenible del territorio.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="#catalogo">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                >
                  Ver Coleccion
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#nosotros">
                <Button size="lg" variant="outline" className="px-8">
                  Conocer Mas
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Eco-Amigable</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Probado en Laboratorio</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                <span>Libre de Crueldad</span>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative grid grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-4 lg:space-y-6 pt-8">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="hero-img1.png"
                  alt="Coleccion de aceites esenciales"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="hero-img2.png"
                  alt="Te herbal"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 lg:space-y-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="hero-img3.png"
                  alt="Suplementos naturales"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="hero-img4.png"
                  alt="Ingredientes botanicos"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-sm shadow-xl rounded-2xl p-4 text-center">
              <p className="font-serif text-2xl font-semibold text-primary">
                100%
              </p>
              <p className="text-xs text-muted-foreground">Natural</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
