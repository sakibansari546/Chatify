import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '15d' // Match this with cookie maxAge
        });

        // Set cookie options
        res.cookie("token", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return token; // Optional: Return token for further use
    } catch (error) {
        console.error("Error generating token and setting cookie:", error);
        throw new Error("Token generation failed");
    }
};
