import { verifyToken } from './authentication'


export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') {
      next()
    } else {
      return res.status(403).json({ message: 'Forbidden' })
    }
  })
}




// export const verifyRole = (roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
//     }
//     next();  // Nếu vai trò hợp lệ, tiếp tục xử lý yêu cầu
//   };
// };

