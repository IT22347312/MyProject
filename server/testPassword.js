const bcrypt = require("bcryptjs");

const plainPassword = "user123";  // Replace this with the password you're testing
const hashedPassword = "$2b$10$ORJq8FrESRAu2wx7MydTtOeAeYaJQl.RMWlFoHfTOyjl47nW/y0IO";  // Replace this with the hash from your MongoDB database
                        
bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error("Error comparing password:", err);
    } else {
        console.log("Password match:", isMatch);  // Should return true if passwords match
    }
});
