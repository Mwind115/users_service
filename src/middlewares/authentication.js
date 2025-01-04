import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils/constant.js'

export const verifyToken = (req, res, next) => {
  const authHeaders = req.headers['authorization']

  console.log('Headers:', req.headers);


  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid format' });
  }

  const token = authHeaders.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
