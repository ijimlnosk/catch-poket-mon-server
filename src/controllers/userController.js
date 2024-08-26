const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const jwtConfig = require("../config/jwt");
exports.signUp = async (req, res) => {
    const { userId, password, data } = req.body;
    const nickName = data?.nickName;

    if (!userId || !password) {
        return res
            .status(400)
            .json({ message: "사용자 ID와 비밀번호는 필수 입력 항목입니다." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser(
            userId,
            hashedPassword,
            null, // email
            nickName
        );
        res.status(201).json({
            message: "회원가입 성공",
            userId: newUser.userId,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(400).json({ message: "이미 존재하는 사용자입니다." });
        } else {
            console.error("회원가입 에러:", error, "요청 데이터:", {
                userId,
                nickName,
            });
            res.status(500).json({ message: "서버 오류" });
        }
    }
};

exports.signIn = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await userModel.findUserByUserId(userId);
        if (!user) {
            return res.status(401).json({ message: "인증 실패" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "인증 실패" });
        }

        const token = jwt.sign({ userId: user.userId }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
        });

        res.json({
            message: "로그인 성공",
            token,
            user: {
                userId: user.userId,
                nickName: user.nickName || null,
                profileUrl: user.profileUrl || null,
            },
        });
    } catch (error) {
        console.error("로그인 에러:", error);
        res.status(500).json({ message: "서버 오류" });
    }
};

exports.signOut = (req, res) => {
    res.json({ message: "로그아웃 성공" });
};

exports.refreshToken = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "토큰이 없습니다." });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        const newToken = jwt.sign(
            { userId: decoded.userId },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );
        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};

exports.updateProfileUrl = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ message: "이미지 파일이 필요합니다." });
        }

        const profileUrl = `/uploads/${req.file.filename}`;
        await userModel.updateProfileUrl(req.userId, profileUrl);
        res.json({ profileUrl });
    } catch (error) {
        console.error("프로필 이미지 업데이트 에러:", error);
        res.status(500).json({ message: "서버 오류" });
    }
};

exports.updateInfo = async (req, res) => {
    const { nickName } = req.body;
    if (!nickName) {
        return res.status(400).json({ message: "닉네임이 필요합니다." });
    }

    try {
        await userModel.updateNickName(req.userId, nickName);
        res.json({ message: "닉네임이 업데이트되었습니다.", nickName });
    } catch (error) {
        console.error("닉네임 업데이트 에러:", error);
        res.status(500).json({ message: "서버 오류" });
    }
};
