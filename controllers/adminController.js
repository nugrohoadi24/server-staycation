const Category = require('../models/Category');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard');
    },
    viewCategory: async (req, res) => {
        const category = await Category.find();
        res.render('admin/category', {category});
    },
    addCategory: async (req, res) => {
        const { name, description } = req.body;

        await Category.create({ name, description });
        res.redirect('/category')
    },
    editCategory: async (req, res) => {
        const { id, name, description } = req.body;

        const category = await Category.findOne({ _id:id });

        category.name = name;
        category.description = description;

        await category.save();
        res.redirect('/category');
    },
    deleteCategory: async (req, res) => {
        const { id } = req.params;
        const category = await Category.findOne({ _id:id });
        await category.remove();
        
        res.redirect('/category');
    },
    viewBank: (req, res) => {
        res.render('admin/bank');
    },
    viewItem: (req, res) => {
        res.render('admin/item');
    },
    viewBooking: (req, res) => {
        res.render('admin/booking');
    },
    
}