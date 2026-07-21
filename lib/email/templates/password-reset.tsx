import * as React from "react"

interface PasswordResetEmailProps {
  resetLink: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lavienaturelle.com"

export function PasswordResetEmail({ resetLink }: PasswordResetEmailProps) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, backgroundColor: "#faf9f7" }}>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#faf9f7", padding: "40px 16px" }}
        >
          <tr>
            <td align="center">
              <table
                width="480"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  border: "1px solid #e8e6e1",
                }}
              >
                {/* Logo */}
                <tr>
                  <td style={{ padding: "40px 40px 0", textAlign: "center" }}>
                    <img
                      src={`${baseUrl}/logo-script.png`}
                      alt="La Vie Naturelle"
                      width="160"
                      height="auto"
                      style={{ display: "inline-block" }}
                    />
                  </td>
                </tr>

                {/* Title */}
                <tr>
                  <td style={{ padding: "32px 40px 8px", textAlign: "center" }}>
                    <h1
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#1c1917",
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      Restablece tu contraseña
                    </h1>
                  </td>
                </tr>

                {/* Subtitle */}
                <tr>
                  <td style={{ padding: "0 40px 24px", textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "'Montserrat', Arial, sans-serif",
                        fontSize: "14px",
                        color: "#78716c",
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      Hemos recibido una solicitud para restablecer la
                      contraseña de tu cuenta en{" "}
                      <strong style={{ color: "#5c8a6f" }}>
                        La Vie Naturelle
                      </strong>
                      .
                    </p>
                  </td>
                </tr>

                {/* Divider */}
                <tr>
                  <td style={{ padding: "0 40px" }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td
                          style={{
                            borderTop: "1px solid #e8e6e1",
                            height: 1,
                          }}
                        />
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Instructions */}
                <tr>
                  <td style={{ padding: "24px 40px 8px" }}>
                    <p
                      style={{
                        fontFamily: "'Montserrat', Arial, sans-serif",
                        fontSize: "13px",
                        color: "#78716c",
                        margin: 0,
                        lineHeight: 1.6,
                        textAlign: "center",
                      }}
                    >
                      Haz clic en el botón de abajo para crear una nueva
                      contraseña. Este enlace expira en{" "}
                      <strong>1 hora</strong>.
                    </p>
                  </td>
                </tr>

                {/* CTA Button */}
                <tr>
                  <td style={{ padding: "28px 40px 8px", textAlign: "center" }}>
                    <a
                      href={resetLink}
                      style={{
                        display: "inline-block",
                        backgroundColor: "#5c8a6f",
                        color: "#ffffff",
                        fontFamily: "'Montserrat', Arial, sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        textDecoration: "none",
                        padding: "16px 40px",
                        borderRadius: "12px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      RESTABLECER CONTRASEÑA
                    </a>
                  </td>
                </tr>

                {/* Fallback link */}
                <tr>
                  <td style={{ padding: "16px 40px 24px", textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "'Montserrat', Arial, sans-serif",
                        fontSize: "12px",
                        color: "#a8a29e",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Si el botón no funciona, copia y pega este enlace en tu
                      navegador:
                    </p>
                    <p
                      style={{
                        fontFamily: "'Montserrat', Arial, sans-serif",
                        fontSize: "11px",
                        color: "#5c8a6f",
                        wordBreak: "break-all",
                        margin: "8px 0 0",
                      }}
                    >
                      {resetLink}
                    </p>
                  </td>
                </tr>

                {/* Divider */}
                <tr>
                  <td style={{ padding: "0 40px" }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td
                          style={{
                            borderTop: "1px solid #e8e6e1",
                            height: 1,
                          }}
                        />
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: "24px 40px 40px", textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "'Montserrat', Arial, sans-serif",
                        fontSize: "11px",
                        color: "#a8a29e",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Si no solicitaste este cambio, ignora este correo.
                      <br />
                      &copy; {new Date().getFullYear()} La Vie Naturelle.
                      Todos los derechos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
