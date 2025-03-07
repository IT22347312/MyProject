const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
    // Step 1: Retrieve the token from the Authorization header
    const token = req.header("Authorization");

    // Step 2: Check if the token is missing
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    // Step 3: Ensure the token has the "Bearer " prefix
    if (!token.startsWith("Bearer ")) {
        return res.status(400).json({ message: "Invalid token format. Token should start with 'Bearer '" });
    }

    // Step 4: Extract the actual token by removing the "Bearer " prefix
    const actualToken = token.replace("Bearer ", "");

    try {
        // Step 5: Verify the JWT token with the secret
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);

        // Step 6: Ensure 'id' exists in the payload
        if (!verified.id) {
            return res.status(400).json({ message: "Invalid token: 'id' missing in token payload" });
        }

        // Step 7: Attach the decoded user data to the request (convert id to ObjectId)
        req.user = {
            id: new mongoose.Types.ObjectId(verified.id), // Convert to MongoDB ObjectId
            ...verified // Spread the remaining payload (optional, e.g., email, etc.)
        };

        // Step 8: Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Step 9: Handle any errors that occur during the verification process

        // If token expired, provide a specific error message
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired. Please log in again." });
        }

        // Return a generic invalid token error
        return res.status(400).json({ message: "Invalid Token", error: error.message });
    }
};
