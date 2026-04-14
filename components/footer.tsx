import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react"
import { categories } from "@/lib/products"
import Image from "next/image"

const footerLinks = {
  empresa: [
    { name: "Sobre Nosotros", href: "#nosotros" },
    { name: "Nuestra Historia", href: "#" },
    { name: "Sostenibilidad", href: "#" },
    { name: "Trabaja con Nosotros", href: "#" },
  ],
  soporte: [
    { name: "Contacto", href: "#" },
    { name: "Informacion de Envio", href: "#" },
    { name: "Devoluciones", href: "#" },
    { name: "Preguntas Frecuentes", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer id="nosotros" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="flex flex-col items-center lg:flex-none lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image 
                src="/logo-script.png" 
                alt="La Vie Logo" 
                className="h-50 w-auto object-contain"
                width={20}
                height={20}
              />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed max-w-sm">
              Dedicados a traerte los mejores productos naturales para un estilo de vida 
              mas saludable y equilibrado. Cada producto es cuidadosamente seleccionado y 
              probado para garantizar su pureza.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links - Dynamic from categories */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Tienda</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={category.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {category.namePlural}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#catalogo"
                  className="text-sm text-background/70 hover:text-primary transition-colors"
                >
                  Nuevos Productos
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                hola@lavienaturelle.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +52 (55) 1234-5678
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Calle Natural 123<br />Ciudad Verde, CDMX 06600</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-background/10 text-center text-sm text-background/50">
          <p>&copy; {new Date().getFullYear()} La Vie Naturelle. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
