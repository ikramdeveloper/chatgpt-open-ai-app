import express from "express";
import cors from "cors";

import router from "./routes/main.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
