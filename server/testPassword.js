const bcrypt = require("bcryptjs");

const plainPassword = "password123";  // Replace this with the password you're testing
const hashedPassword = "$2b$10$in0SezqKl13evgoDquyQ.eiwXWoMjFikcVzBTzPMnPWqZM1oqIIf2";  // Replace this with the hash from your MongoDB database
                        
bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error("Error comparing password:", err);
    } else {
        console.log("Password match:", isMatch);  // Should return true if passwords match
    }
});
