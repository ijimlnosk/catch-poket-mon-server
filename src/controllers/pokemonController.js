const pokemonModel = require("../models/pokemonModel");

exports.catchPokemon = async (req, res) => {
    const { pokeId, type, name, url, background } = req.body;
    try {
        const result = await pokemonModel.savePokemon(
            req.userId,
            pokeId,
            type,
            name,
            url,
            background
        );
        res.status(201).json(result);
    } catch (error) {
        console.error("포켓몬 포획 에러:", error);
        res.status(500).json({ message: "서버 오류" });
    }
};

exports.getCaughtPokemons = async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10; // 페이지당 포켓몬 수
    try {
        const pokemons = await pokemonModel.getCaughtPokemons(
            req.userId,
            page,
            limit
        );
        res.json(pokemons);
    } catch (error) {
        console.error("포켓몬 조회 에러:", error);
        res.status(500).json({ message: "서버 오류" });
    }
};

exports.releasePokemon = async (req, res) => {
    const { id } = req.params;
    try {
        await pokemonModel.deletePokemon(req.userId, id);
        res.json({ message: "포켓몬이 성공적으로 놓아졌습니다." });
    } catch (error) {
        console.error("포켓몬 놓아주기 에러:", error);
        res.status(500).json({ message: "서버 오류" });
    }
};
