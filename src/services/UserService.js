const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtServices");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser !== null) {
                resolve({
                    status: "OK",
                    message: "Email already exists",
                });
            }
            const hash = await bcrypt.hash(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
            });
            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "User created successfully",
                    data: createdUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = userLogin;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "User not found",
                });
            }
            const comparePassword = bcrypt.compareSync(
                password,
                checkUser.password
            );
            if (!comparePassword) {
                resolve({
                    status: "OK",
                    message: "The password is incorrect",
                });
            }
            const access_token = await genneralAccessToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin,
            });

            const refresh_token = await genneralRefreshToken({
                id: checkUser._id,
                isAdmin: checkUser.isAdmin,
            });

            resolve({
                status: "OK",
                message: "User created successfully",
                access_token,
                refresh_token,
            });
            // }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
};
