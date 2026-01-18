const UserModel = require('../models/user.model')

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists" 
            })
        }
        const newUseruser = await UserModel.create({ 
            firstName, 
            lastName,
            email, 
            password
         })
         await newUser.save()
        return res.status(201).json({ 
            success: true,
            message: "User created successfully", 
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
