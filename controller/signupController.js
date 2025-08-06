const User = require("../model/signupModel"); // avoid naming conflict

// exports.addUser = async (req, res) => {
//     try {
//         const { username, password, email } = req.body;

//         if (!username || !password || !email) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         const newUser = new UserModel({ username, password, email });
//         await newUser.save();

//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to create user", details: error.message });
//     }
// };


async function handleUserSignup(req, res) {
    const { username, email, password } = req.body;
    await User.create({
        username,
        email,
        password,
    });
    return res.redirect('/');

}





async function handleUserLogin(req, res) {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.render('login', {
                error: "Invalid Username or Password",
            });
        }



        // ✅ Login successful, redirect to homepage
        return res.redirect('/');

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).render('login', {
            error: "Something went wrong. Please try again.",
        });
    }
}

module.exports = { handleUserSignup, handleUserLogin }