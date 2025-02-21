const loginUser = async (req, res, next) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if password is valid
    if (!user.isValidPassword || !user.isValidPassword(req.body.password)) {
      return res.status(401).json({ success: false, message: "Password incorrect" });
    }

    // Authenticate user with passport
    passport.authenticate("local", (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ success: false, message: info?.message || "Authentication failed" });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Login error" });
        }
        return res.status(200).json({
          success: true,
          user
        });
      });
    })(req, res, next);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};
