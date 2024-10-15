import express from 'express';
import { createAdminUser, getAdminUserById, getAllAdminUsers } from '../controllers/admin.controller.js';

const adminRoute = express.Router();

adminRoute.post('/admin-users', createAdminUser);

adminRoute.get('/admin-users', getAllAdminUsers);

adminRoute.get('/admin-users/:id', getAdminUserById);

export default  adminRoute;
