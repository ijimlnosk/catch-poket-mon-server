const express = require("express");
const pokemonController = require("../controllers/pokemonController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, pokemonController.catchPokemon);
router.get("/", auth, pokemonController.getCaughtPokemons);
router.delete("/:id", auth, pokemonController.releasePokemon);

module.exports = router;
