const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// =====================================================
// PASSWORD VALIDATION
// =====================================================

function isStrongPassword(password) {

    return (
        typeof password === "string" &&
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@$!%*?&#]/.test(password)
    );

}


// =====================================================
// CREATE JWT TOKEN
// =====================================================

function createToken(user) {

    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d"
        }
    );

}


// =====================================================
// USER RESPONSE
// IMPORTANT: PASSWORD IS NOT SENT TO FRONTEND
// =====================================================

function userResponse(user) {
    return {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        propertyName: user.propertyName,
        propertyLocation: user.propertyLocation
    };
}


// =====================================================
// REGISTER USER
// =====================================================

const register = async (req, res) => {

    try {

        const {
            role,
            name,
            email,
            phone,
            password,
            confirmPassword,
            college,
            propertyName,
            propertyLocation,
            aadhaar
        } = req.body;


        // ---------------------------------------------
        // REQUIRED FIELDS
        // ---------------------------------------------

        if (
            !role ||
            !name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }


        // ---------------------------------------------
        // ROLE
        // ---------------------------------------------

        if (
            role !== "student" &&
            role !== "owner"
        ) {

            return res.status(400).json({

                success: false,

                message: "Invalid account type."

            });

        }


        // ---------------------------------------------
        // EMAIL
        // ---------------------------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,

                message: "Please enter a valid email address."

            });

        }


        // ---------------------------------------------
        // PHONE
        // ---------------------------------------------

        if (!/^[0-9]{10}$/.test(phone)) {

            return res.status(400).json({

                success: false,

                message: "Please enter a valid 10-digit phone number."

            });

        }


        // ---------------------------------------------
        // PASSWORD
        // ---------------------------------------------

        if (!isStrongPassword(password)) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."

            });

        }


        // ---------------------------------------------
        // CONFIRM PASSWORD
        // ---------------------------------------------

        if (password !== confirmPassword) {

            return res.status(400).json({

                success: false,

                message: "Passwords do not match."

            });

        }


        // =================================================
        // STUDENT VALIDATION
        // =================================================

        if (role === "student") {

            if (
                !college ||
                college.trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Please enter your college name."

                });

            }

        }


        // =================================================
        // OWNER VALIDATION
        // =================================================

        if (role === "owner") {

            if (
                !propertyName ||
                propertyName.trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Please enter your property name."

                });

            }


            if (
                !propertyLocation ||
                propertyLocation.trim() === ""
            ) {

                return res.status(400).json({

                    success: false,

                    message: "Please enter your property location."

                });

            }


            if (
                !aadhaar ||
                !/^[0-9]{4}$/.test(aadhaar)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter the last 4 digits of your Aadhaar number."

                });

            }

        }


        // =================================================
        // CHECK EXISTING USER
        // =================================================

        const existingUser = await User.findOne({

            email: email.toLowerCase().trim()

        });


        if (existingUser) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }


        // =================================================
        // HASH PASSWORD
        // =================================================

        const hashedPassword =
            await bcrypt.hash(password, 12);


        // =================================================
        // CREATE USER
        // =================================================

        const user = new User({

            role: role,

            name: name.trim(),

            email: email.toLowerCase().trim(),

            phone: phone.trim(),

            password: hashedPassword,

            college:
                role === "student"
                    ? college.trim()
                    : "",

            propertyName:
                role === "owner"
                    ? propertyName.trim()
                    : "",

            propertyLocation:
                role === "owner"
                    ? propertyLocation.trim()
                    : "",

            aadhaar:
                role === "owner"
                    ? aadhaar
                    : ""

        });


        // =================================================
        // SAVE USER
        // =================================================

        await user.save();


        // =================================================
        // CREATE JWT
        // =================================================

        const token = createToken(user);


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message: "Registration successful.",

            token: token,

            user: userResponse(user)

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during registration."

        });

    }

};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {

    try {

        const {
            role,
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // REQUIRED FIELDS
        // ---------------------------------------------

        if (
            !role ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter email and password."

            });

        }


        // ---------------------------------------------
        // FIND USER
        // ---------------------------------------------

        const user = await User.findOne({

            email: email.toLowerCase().trim(),

            role: role

        });


        // ---------------------------------------------
        // USER NOT FOUND
        // ---------------------------------------------

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // ---------------------------------------------
        // CHECK PASSWORD
        // ---------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // ---------------------------------------------
        // CREATE TOKEN
        // ---------------------------------------------

        const token = createToken(user);


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token: token,

            user: userResponse(user)

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error during login."

        });

    }

};


module.exports = {

    register,

    login

};