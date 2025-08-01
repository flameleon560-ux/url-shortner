const UserModel = require("../model/signupModel"); // avoid naming conflict

exports.addUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newUser = new UserModel({ username, password, email });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user", details: error.message });
    }
};


// async function handleUserSignup(req, res) {
//     const { name, email, password } = req.body;
//     const User = await UserActivation.create({
//         name,
//         email,
//         password,
//     });
//     res.send(user)
//     // return res.redirect('/')
// }
// module.exports = handleUserSignup