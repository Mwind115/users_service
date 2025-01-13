import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../schemas/user.schema.js'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../utils/constant.js'
import { request } from 'express'
import crypto from 'crypto'


export class AuthService {
  // static async get() {
  //   return jwt.sign(payload)
  // }

  static async register(req) {
    const { userId } = req.body
    console.log(req.body)
    const existingUser = await UserModel.findOne({ userId })

    if (!req.body.name || !userId || !req.body.password){
      throw new Error('Thông tin không được để trống');
    }

    if (existingUser) {
      throw new Error(`User with studentId ${userId} already exists`)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new UserModel({
      ...req.body,
      userId,
      password: hashedPassword,
    })
    await user.save()
  }

  static async login(req) {
    const { userId, password } = req.body
    const user = await UserModel.findOne({ userId })

    if (!userId || !password) {
      throw new Error('Mã sinh viên và Mật khẩu không được để trống');
    }
  

    if (!user) {
      throw new Error('Không tìm thấy người dùng')
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('Mật khẩu sai')
    }
    const payload = {
      userId: user.userId,
      role: user.role,
      name: user.name
    }

    console.log("login access")
    console.log(payload)

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    // ? Chỉ trả về token để gắn vào req.headers.authorization = Bearer ${token}
    return token
  }


  static async getUsers() {
    try {
      const users = await UserModel.find(); // Truy vấn tất cả người dùng
      console.log("[getUsers]: Found users:", users); // Logging cho môi trường dev
      return users;
    } catch (err) {
      console.error("[getUsers]: Error fetching users:", err.message); // Log lỗi
      throw new Error("Failed to fetch users from database."); // Throw lỗi để xử lý ở controller
    }
  }
  

  // Xóa người dùng theo userId
  static async deleteUser(userId) {
    const user = await UserModel.findOneAndDelete({ userId })
    if (!user) {
      throw new Error(`User with userId ${userId} not found`)
    }
    return `User with userId ${userId} has been deleted`
  }



  static async changePassword(req) {
    const { userId } = req.params; // Lấy userId từ URL params
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findOne({ userId })

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the old password matches
    const isValidPassword = await bcrypt.compare(oldPassword, user.password)
    if (!isValidPassword) {
      throw new Error('Mật khẩu cũ không đúng')
    }

    // Validate the new password (you can add more complex rules here)
    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return `Password for user ${userId} has been successfully changed`
  }

  // Function to handle "Forgot Password" - Generate new password and notify Admin
  static async forgotPassword(req) {
    const { userId } = req.body
    const user = await UserModel.findOne({ userId })

    if (!user) {
      throw new Error('User not found')
    }

    // Generate a random new password
    const newPassword = crypto.randomBytes(6).toString('hex')  // 8 bytes = 16 characters

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user with the new password
    user.password = hashedPassword
    await user.save()

    console.log("password: " + newPassword)

    // Send notification to admin


    return `Password for user ${userId} has been reset. The new password has been sent to the admin ${newPassword}.`
  }

  // async generateToken(payload) {
  //   const token = jwt.sign(payload, JWT_SECRET, {
  //     expiresIn: JWT_EXPIRES_IN,
  //   })
  //   return {
  //     token,
  //   }
  // }


}
