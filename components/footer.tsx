import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react"
import { categories } from "@/lib/products"
import Image from "next/image"



export function Footer() {
  return (
    <footer id="nosotros" className="bg-[#1a1a1a] text-stone-200 border-t border-stone-800">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image 
                src="/logo-script.png" 
                alt="La Vie Naturelle" 
                className="h-50 w-auto object-contain brightness-0 invert"
                width={180}
                height={60}
              />
            </Link>
            <p className="text-stone-400 text-base leading-relaxed max-w-md font-light">
              Dedicados a traerte los mejores productos naturales para un estilo de vida 
              más saludable y equilibrado. Cada producto es cuidadosamente seleccionado y 
              probado para garantizar su pureza botánica.
            </p>
            <div className="flex items-center gap-6">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i}
                  href={href} 
                  className="w-10 h-10 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer for better distribution */}
          <div className="hidden lg:block lg:col-span-2" />

          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-500">
              Contacto y Ubicación
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-stone-800/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-stone-300 group-hover:text-primary transition-colors">
                  hola@lavienaturelle.com
                </span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-stone-800/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-stone-300 group-hover:text-primary transition-colors">
                  +52 (55) 1234-5678
                </span>
              </li>
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-stone-800/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-stone-300 group-hover:text-primary transition-colors leading-relaxed pt-2">
                  Calle Natural 123, Ciudad Verde<br />
                  <span className="text-stone-500 font-light">COL 06600, Colombia</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-stone-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600">
            &copy; {new Date().getFullYear()} La Vie Naturelle. Esencia de la tierra.
          </p>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-600">
            <a href="#" className="hover:text-stone-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
