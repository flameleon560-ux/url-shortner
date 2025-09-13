const User = require("../model/signupModel"); // avoid naming conflict


const { setUser} = require("../services/auth");


async function handleUserSignup(req, res) {
    const { username, email, password } = req.body;
     if (!username || !password || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

    await User.create({
        username,
        email,
        password,
    });
    return res.redirect('/');

}


async function handleUserLogin(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user)
    return res.render("login", {
      error: "Invalid Username or Password",
    });

  
  const token=setUser(user);
  res.cookie("uid", token);

  return res.redirect("/");
  // return res.json({token});
}

module.exports = { handleUserSignup, handleUserLogin }