require("dotenv").config();
const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const pokemonRoutes = require("./src/routes/pokemonRoutes");
const errorHandler = require("./src/utils/errorHandler");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3300;

const sslOptions = {
  key: fs.readFileSync(process.env.KEY),
  cert: fs.readFileSync(process.env.CERT),
};

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://catchpoketmon.soljk.com",
    "https://pokeserver.soljk.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/data/poke", pokemonRoutes);

app.use(errorHandler);

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`${PORT}포트로 HTTPS 서버가 열렸어요!`);
});
