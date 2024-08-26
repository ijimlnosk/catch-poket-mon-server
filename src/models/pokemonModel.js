const db = require("../config/database");

exports.savePokemon = async (userId, pokeId, type, name, url, background) => {
    const [result] = await db.query(
        "INSERT INTO pokemons (user_id, poke_id, type, name, url, background) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, pokeId, JSON.stringify(type), name, url, background]
    );
    return { id: result.insertId, userId, pokeId, type, name, url, background };
};
exports.getCaughtPokemons = async (userId, page, limit) => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
        "SELECT * FROM pokemons WHERE user_id = ? LIMIT ? OFFSET ?",
        [userId, limit, offset]
    );
    return rows.map((row) => ({
        ...row,
        type: typeof row.type === "string" ? JSON.parse(row.type) : row.type,
    }));
};

exports.deletePokemon = async (userId, pokemonId) => {
    await db.query("DELETE FROM pokemons WHERE id = ? AND user_id = ?", [
        pokemonId,
        userId,
    ]);
};
