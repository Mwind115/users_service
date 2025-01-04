import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../schemas/user.schema.js'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../utils/constant.js'
import { request } from 'express'

export class AuthService {
  // static async get() {
  //   return jwt.sign(payload)
  // }

  static async register(req) {
    const { userId } = req.body
    console.log(req.body)
    const existingUser = await UserModel.findOne({ userId })

    if (!req.body.name || !userId || req.body.password){
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

  // async generateToken(payload) {
  //   const token = jwt.sign(payload, JWT_SECRET, {
  //     expiresIn: JWT_EXPIRES_IN,
  //   })
  //   return {
  //     token,
  //   }
  // }


}
