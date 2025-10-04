export const templete = (code,firstName,todayDate,subject)=>{
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sara7a OTP</title>
</head>
<body style="margin:0; background-color:#eeee; font-family: 'Poppins', sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:20px; background:#f4f7ff; color:#434343;">
    <header style="display: flex;justify-content: space-between;align-items: center; font-weight:bold; color:#323232; font-size:16px;">
      <h3>Sara7a App 🤞</h3>
      <h3 style=" font-size:14px;margin-left: auto;">${todayDate}</h3>
    </header>

    <main>
      <div style="
        margin-top:30px;
        padding:30px 20px;
        background:#ffffff;
        border-radius:20px;
        text-align:center;
      ">
        <div style="width:100%; margin:0 auto;">
          <h1 style="margin:0; font-size:22px; font-weight:600; color:#1f1f1f;">
            Your OTP
          </h1>
          <p style="margin:15px 0 10px; font-size:15px; font-weight:500;">
            Hello <b>${firstName}</b>,
          </p>
          <p style="font-size:14px; color:#555;">
            Thank you for choosing Sara7a App.
            Use the following OTP to ${subject}.
             Do not share this code with others.
          </p>
          <p style="
            margin-top:30px;
            font-size:32px;
            font-weight:700;
            letter-spacing:15px;
            color:#3d65ba;
          ">
            ${code}
          </p>
          <p style="font-size:14px; color:#555;">if you didn't sign up for this account,please ignore this email</p>
        </div>
      </div>

      <p style="
        max-width:400px;
        margin:30px auto 0;
        text-align:center;
        font-weight:500;
        color:#8c8c8c;
        font-size:13px;
        line-height:1.5;
      ">
        Need help? Ask at
        <a href="mailto:lamia.fekry2003@gmail.com" style="color:#3d65ba; text-decoration:none;">
          lamia.fekry2003@gmail.com
        </a>
      </p>
    </main>
  </div>
</body>
</html>`
}