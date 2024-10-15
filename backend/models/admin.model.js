import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Uploader', 'Admin', 'Super Admin'],
    required: true,
  },
}, { timestamps: true });

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;
