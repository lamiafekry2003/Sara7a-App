export function corsOption() {
  const whitelist = process.env.WHITELIST.split(",");
  const corsOptions = {
    origin: function (origin, callback) {
        // to access postman and curl
      if (!origin) {
        return callback(null, true);
      }
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  return corsOptions;
}
