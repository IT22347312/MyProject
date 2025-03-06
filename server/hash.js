const bcrypt = require("bcryptjs");

const plainPassword = "password123";

bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("Hashed Password:", hashedPassword);
    }
});
