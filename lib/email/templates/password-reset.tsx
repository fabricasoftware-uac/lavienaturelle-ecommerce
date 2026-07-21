import * as React from "react"
import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
  Preview,
  Row,
  Column,
} from "@react-email/components"

interface PasswordResetEmailProps {
  resetLink: string
}

const main: React.CSSProperties = {
  backgroundColor: "#faf9f7",
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  padding: "40px 16px",
}

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  border: "1px solid #ece8e0",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0",
}

const accentBarOuter: React.CSSProperties = {
  padding: "0",
}

const accentBar: React.CSSProperties = {
  backgroundColor: "#5c8a6f",
  height: "6px",
  fontSize: "1px",
  lineHeight: "1px",
  padding: "0",
}

const brandSection: React.CSSProperties = {
  padding: "52px 40px 0",
  textAlign: "center",
}

const brandStarsTop: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "11px",
  color: "#c4b998",
  letterSpacing: "20px",
  margin: "0 0 24px",
  lineHeight: "1",
  textAlign: "center",
}

const brandWordmark: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "16px",
  fontWeight: 600,
  fontStyle: "italic",
  color: "#5c8a6f",
  margin: "0 0 24px",
  lineHeight: "1.35",
  textAlign: "center",
  letterSpacing: "0.5px",
}

const brandStarsBottom: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "11px",
  color: "#c4b998",
  letterSpacing: "20px",
  margin: "0",
  lineHeight: "1",
  textAlign: "center",
}

const headingSection: React.CSSProperties = {
  padding: "32px 40px 0",
  textAlign: "center",
}

const eyebrow: React.CSSProperties = {
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  fontSize: "10px",
  fontWeight: 600,
  color: "#a8a29e",
  textTransform: "uppercase",
  letterSpacing: "4px",
  margin: "0 0 12px",
  lineHeight: "1",
  textAlign: "center",
}

const heading: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "32px",
  fontWeight: 700,
  color: "#1c1917",
  margin: "0",
  lineHeight: "1.25",
  textAlign: "center",
}

const headingAccent: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "16px",
  fontWeight: 400,
  fontStyle: "italic",
  color: "#78716c",
  margin: "8px 0 0",
  lineHeight: "1.4",
  textAlign: "center",
}

const bodySection: React.CSSProperties = {
  padding: "28px 40px 0",
}

const bodyText: React.CSSProperties = {
  fontSize: "14px",
  color: "#44403c",
  margin: "0",
  lineHeight: "1.85",
  textAlign: "center",
}

const bodyTextSmall: React.CSSProperties = {
  fontSize: "13px",
  color: "#57534e",
  margin: "16px 0 0",
  lineHeight: "1.8",
  textAlign: "center",
}

const dividerSection: React.CSSProperties = {
  padding: "36px 40px",
}

const dividerLine: React.CSSProperties = {
  borderColor: "#ece8e0",
  borderStyle: "solid",
  borderWidth: "1px",
  margin: "0",
}

const dividerIcon: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "11px",
  color: "#c4b998",
  textAlign: "center",
  margin: "0",
  lineHeight: "1",
}

const dividerColumn: React.CSSProperties = {
  verticalAlign: "middle",
}

const ctaSection: React.CSSProperties = {
  padding: "0 40px",
  textAlign: "center",
}

const ctaButton: React.CSSProperties = {
  backgroundColor: "#5c8a6f",
  borderRadius: "10px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "2.5px",
  lineHeight: "1",
  padding: "20px 48px",
  textDecoration: "none",
  textAlign: "center",
}

const fallbackSection: React.CSSProperties = {
  padding: "24px 40px 0",
  textAlign: "center",
}

const fallbackLabel: React.CSSProperties = {
  fontSize: "12px",
  color: "#78716c",
  margin: "0",
  lineHeight: "1.6",
  textAlign: "center",
}

const fallbackLinkRow: React.CSSProperties = {
  padding: "8px 40px 0",
  textAlign: "center",
}

const fallbackLink: React.CSSProperties = {
  color: "#5c8a6f",
  fontSize: "11px",
  lineHeight: "1.6",
  textAlign: "center",
  wordBreak: "break-all",
}

const footerSection: React.CSSProperties = {
  padding: "0 40px 52px",
  textAlign: "center",
}

const footerDividerHr: React.CSSProperties = {
  borderColor: "#ece8e0",
  borderStyle: "solid",
  borderWidth: "1px",
  margin: "0 0 28px",
}

const footerText: React.CSSProperties = {
  fontSize: "11px",
  color: "#a8a29e",
  margin: "0",
  lineHeight: "1.8",
  textAlign: "center",
}

const footerTagline: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: "12px",
  fontStyle: "italic",
  color: "#c4b998",
  margin: "16px 0 0",
  lineHeight: "1.4",
  textAlign: "center",
}

const brandStrong: React.CSSProperties = {
  color: "#5c8a6f",
  fontWeight: 700,
}

export function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
  const year = new Date().getFullYear()

  return (
    <Html>
      <Preview>Restablece tu contraseña de La Vie Naturelle</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={accentBarOuter}>
            <div style={accentBar} />
          </Section>

          <Section style={brandSection}>
            <Text style={brandStarsTop}>✦ ✦ ✦</Text>
            <Text style={brandWordmark}>La Vie Naturelle</Text>
            <Text style={brandStarsBottom}>✦ ✦ ✦</Text>
          </Section>

          <Section style={headingSection}>
            <Text style={eyebrow}>Seguridad de la cuenta</Text>
            <Text style={heading}>Restablece tu contraseña</Text>
            <Text style={headingAccent}>
              Hola, hemos recibido tu solicitud
            </Text>
          </Section>

          <Section style={bodySection}>
            <Text style={bodyText}>
              Hemos recibido una solicitud para restablecer la contraseña de tu
              cuenta en{" "}
              <strong style={brandStrong}>La Vie Naturelle</strong>.
              {" "}Haz clic en el botón de abajo para crear una nueva contraseña
              segura.
            </Text>
            <Text style={bodyTextSmall}>
              Este enlace de restablecimiento expira en{" "}
              <strong style={{ color: "#5c8a6f", fontWeight: 700 }}>
                1 hora
              </strong>
              . Si no solicitaste este cambio, puedes ignorar este correo de
              forma segura.
            </Text>
          </Section>

          <Section style={dividerSection}>
            <Row>
              <Column style={{ width: "45%", paddingRight: "20px" }}>
                <Hr style={dividerLine} />
              </Column>
              <Column
                style={{ width: "10%", textAlign: "center", ...dividerColumn }}
              >
                <Text style={dividerIcon}>✦</Text>
              </Column>
              <Column style={{ width: "45%", paddingLeft: "20px" }}>
                <Hr style={dividerLine} />
              </Column>
            </Row>
          </Section>

          <Section style={ctaSection}>
            <Button href={resetLink} style={ctaButton}>
              RESTABLECER CONTRASEÑA
            </Button>
          </Section>

          <Section style={fallbackSection}>
            <Text style={fallbackLabel}>
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </Text>
          </Section>
          <Section style={fallbackLinkRow}>
            <Link href={resetLink} style={fallbackLink}>
              {resetLink}
            </Link>
          </Section>

          <Section style={dividerSection}>
            <Row>
              <Column style={{ width: "45%", paddingRight: "20px" }}>
                <Hr style={dividerLine} />
              </Column>
              <Column
                style={{ width: "10%", textAlign: "center", ...dividerColumn }}
              >
                <Text style={dividerIcon}>✦</Text>
              </Column>
              <Column style={{ width: "45%", paddingLeft: "20px" }}>
                <Hr style={dividerLine} />
              </Column>
            </Row>
          </Section>

          <Section style={footerSection}>
            <Hr style={footerDividerHr} />
            <Text style={footerText}>
              Si no solicitaste este cambio, ignora este correo.
              <br />
              &copy; {year} La Vie Naturelle. Todos los derechos reservados.
            </Text>
            <Text style={footerTagline}>
              &mdash; natura sānat, anima pulchra est &mdash;
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
