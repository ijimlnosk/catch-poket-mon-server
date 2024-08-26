require("dotenv").config();
const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const pokemonRoutes = require("./src/routes/pokemonRoutes");
const errorHandler = require("./src/utils/errorHandler");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3300;

const corsOptions = {
    origin: ["http://localhost:5173", "https://catchpoketmon.soljk.com"],
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
