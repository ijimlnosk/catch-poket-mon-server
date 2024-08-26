const db = require("../config/database");

exports.createUser = async (userId, password, email, nickName) => {
    const [result] = await db.query(
        "INSERT INTO users (userId, password, email, nickName) VALUES (?, ?, ?, ?)",
        [userId, password, email, nickName]
    );

    if (result.affectedRows !== 1) {
        throw new Error("사용자 생성에 실패했습니다.");
    }

    return { userId, created: true };
};

exports.findUserByUserId = async (userId) => {
    const [rows] = await db.query("SELECT * FROM users WHERE userId = ?", [
        userId,
    ]);
    return rows[0];
};

exports.updateProfileUrl = async (userId, profileUrl) => {
    await db.query("UPDATE users SET profileUrl = ? WHERE userId = ?", [
        profileUrl,
        userId,
    ]);
};

exports.updateNickName = async (userId, nickName) => {
    await db.query("UPDATE users SET nickName = ? WHERE userId = ?", [
        nickName,
        userId,
    ]);
};
