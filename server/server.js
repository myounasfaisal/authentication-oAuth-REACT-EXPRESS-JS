import dotenv from "dotenv";
dotenv.config(); // Load environment variables at the start

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}...`);
});
