export const forgotPasswordTemplate = (resetUrl, userName = "User") => {
  return {
    subject: "🔐 Reset Your Password | AI Learning Platform",

    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Password Reset</title>
</head>

<body style="margin:0; padding:0; background:#0f172a; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <!-- CARD -->
        <table width="100%" max-width="500" style="background:#111827; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.5);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg, #6366f1, #8b5cf6); padding:20px; text-align:center;">
              <h1 style="color:white; margin:0;">AI Learning Hub 🚀</h1>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px; color:#e5e7eb;">

              <h2 style="margin-top:0;">Hello ${userName}, 👋</h2>

              <p>
                We received a request to reset your password.
                Click the button below to set a new password.
              </p>

              <!-- BUTTON -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${resetUrl}"
                   style="
                     display:inline-block;
                     padding:14px 28px;
                     background:linear-gradient(135deg, #6366f1, #8b5cf6);
                     color:white;
                     text-decoration:none;
                     border-radius:8px;
                     font-weight:bold;
                     font-size:16px;
                   ">
                  Reset Password
                </a>
              </div>

              <p style="font-size:14px; color:#9ca3af;">
                This link will expire in 15 minutes for security reasons.
              </p>

              <!-- FALLBACK -->
              <p style="font-size:12px; color:#6b7280;">
                If the button doesn't work, copy and paste this link:
                <br />
                <a href="${resetUrl}" style="color:#60a5fa;">
                  ${resetUrl}
                </a>
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px; text-align:center; background:#0f172a; color:#6b7280; font-size:12px;">
              © ${new Date().getFullYear()} AI Learning Platform<br/>
              Empowering your learning journey
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
  };
};