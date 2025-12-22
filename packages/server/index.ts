import express from "express";
import dotenv from "dotenv";
import router from "./routes";


dotenv.config();

const app = express();

app.use(express.json());
app.use(router)

const port = process.env.NODE_ENV || 5172;

app.listen(port, () => {
  console.log(`Server is running on my ${port}`);
});
