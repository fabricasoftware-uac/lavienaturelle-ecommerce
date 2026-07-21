import * as React from "react"
import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Hr,
  Link,
  Preview,
} from "@react-email/components"

interface PasswordResetEmailProps {
  resetLink: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

const main = {
  backgroundColor: "#faf9f7",
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  padding: "40px 16px",
}

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  border: "1px solid #e8e6e1",
  margin: "0 auto",
  padding: "0",
}

const logoSection = {
  padding: "40px 40px 0",
  textAlign: "center" as const,
}

const title = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "28px",
  fontWeight: 700,
  color: "#1c1917",
  margin: "32px 0 0",
  lineHeight: 1.3,
  textAlign: "center" as const,
  padding: "0 40px",
}

const subtitle = {
  fontSize: "14px",
  color: "#78716c",
  margin: "8px 0 0",
  lineHeight: 1.6,
  textAlign: "center" as const,
  padding: "0 40px",
}

const instructions = {
  fontSize: "13px",
  color: "#78716c",
  margin: "24px 0 0",
  lineHeight: 1.6,
  textAlign: "center" as const,
  padding: "0 40px",
}

const buttonWrapper = {
  textAlign: "center" as const,
  padding: "32px 40px 8px",
}

const fallbackText = {
  fontSize: "12px",
  color: "#a8a29e",
  margin: "16px 40px 0",
  lineHeight: 1.5,
  textAlign: "center" as const,
}

const fallbackLink = {
  fontSize: "11px",
  color: "#5c8a6f",
  wordBreak: "break-all" as const,
  margin: "8px 40px 0",
  textAlign: "center" as const,
}

const footer = {
  fontSize: "11px",
  color: "#a8a29e",
  margin: "0",
  lineHeight: 1.5,
  textAlign: "center" as const,
  padding: "24px 40px 40px",
}

export function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
  return (
    <Html>
      <Preview>Restablece tu contraseña de La Vie Naturelle</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src={`${baseUrl}/logo-script.png`}
              alt="La Vie Naturelle"
              width="160"
              height="auto"
            />
          </Section>

          <Text style={title}>Restablece tu contraseña</Text>

          <Text style={subtitle}>
            Hemos recibido una solicitud para restablecer la contraseña de tu
            cuenta en{" "}
            <strong style={{ color: "#5c8a6f" }}>La Vie Naturelle</strong>.
          </Text>

          <Hr
            style={{
              borderColor: "#e8e6e1",
              margin: "0 40px",
            }}
          />

          <Text style={instructions}>
            Haz clic en el botón de abajo para crear una nueva contraseña. Este
            enlace expira en <strong>1 hora</strong>.
          </Text>

          <Section style={buttonWrapper}>
            <Button
              href={resetLink}
              style={{
                backgroundColor: "#5c8a6f",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                padding: "16px 40px",
                borderRadius: "12px",
                letterSpacing: "0.5px",
              }}
            >
              RESTABLECER CONTRASEÑA
            </Button>
          </Section>

          <Text style={fallbackText}>
            Si el botón no funciona, copia y pega este enlace en tu navegador:
          </Text>
          <Text style={fallbackLink}>
            <Link
              href={resetLink}
              style={{
                color: "#5c8a6f",
                fontSize: "11px",
                wordBreak: "break-all",
              }}
            >
              {resetLink}
            </Link>
          </Text>

          <Hr
            style={{
              borderColor: "#e8e6e1",
              margin: "24px 40px 0",
            }}
          />

          <Text style={footer}>
            Si no solicitaste este cambio, ignora este correo.
            <br />
            &copy; {new Date().getFullYear()} La Vie Naturelle. Todos los
            derechos reservados.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
