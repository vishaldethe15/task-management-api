import { jwtVerify } from "jose";
export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    req.user = payload;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyRole = (roles = []) => {
  return (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
};
