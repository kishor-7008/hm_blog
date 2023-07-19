import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try { 
      let token = req.headers.authorization
  
      console.log("userToken1" , token)
      if (!token) {
        return res.status(403).send("Access Denied");
      }

      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1]
      }
     
      const verified = jwt.verify(token,"secret123");
      if(!verified){
        return res.status(403).send("INvalid Token");
      }
      req.user = verified;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

