import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // GET HEADER
    const authHeader = req.headers.authorization;

    // CHECK HEADER
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        msg: "No token provided",
      });
    }

    // EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SAVE USER
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);

    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};
