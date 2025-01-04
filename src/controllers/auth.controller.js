import { AuthService } from '../services/auth.service.js'

export default class AuthController {
  static async login(req, res) {
    try {
      const user = await AuthService.login(req)
      res.status(200).json(user)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  static async register(req, res){
    console.log('login')
    try {
      // const {userId, password, name, date } = req.body
      await AuthService.register( req )
      
      res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await AuthService.getUsers();
      res.status(200).json({ users });
    } catch (err) {
      console.error("Error fetching users:", err);
      const statusCode = err.statusCode || 500; // Trả về mã trạng thái phù hợp
      res.status(statusCode).json({ message: err.message || "Internal Server Error" });
    }
  }
  
  // Xóa người dùng
  static async deleteUser(req, res) {
    const { userId } = req.params
    try {
      const result = await AuthService.deleteUser(userId)
      res.status(200).json({ message: result })
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

    

  // static async register(req, res) {
  //   console.log("s")
  //   try {
  //     // const {userId, password, name, date } = req.body
  //     await AuthService.register( req )
      
  //     res.status(201).json({ message: 'User registered successfully' })
  //   } catch (err) {
  //     res.status(400).json({ message: err.message })
  //   }
  // }
}
