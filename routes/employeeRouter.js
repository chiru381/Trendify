import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Employee from '../models/employeeModel.js';

const employeeRouter = express.Router();

employeeRouter.get(
  '/employees',
  expressAsyncHandler(async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  })
);

employeeRouter.get(
    '/organization-tree',
    expressAsyncHandler(async (req, res) => {
        try {
            const employees = await Employee.find().lean();
    
            const buildTree = (managerId) => {
                return employees
                    .filter(emp => String(emp.reportingManager) === String(managerId))
                    .map(emp => ({
                        ...emp,
                        subordinates: buildTree(emp._id)
                    }));
            };
    
            const organizationTree = buildTree(null);
            res.json(organizationTree);
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    })
  );

export default employeeRouter;
