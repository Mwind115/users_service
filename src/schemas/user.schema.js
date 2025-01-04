import mongoose from 'mongoose'

const { Schema } = mongoose
const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'Mã sinh viên không được để trống'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Tên không được để trống'],
      minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
      maxlength: [50, 'Tên không được vượt quá 50 ký tự'],
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu không được để trống'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    },
    date: {
      type: Date,
      required: [true, 'Ngày sinh không được để trống'],
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'teacher'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
)

const UserModel = mongoose.model('User', userSchema)
export default UserModel
