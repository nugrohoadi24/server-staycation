const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('/', {
            title: 'Staycation | Dashboard'
        });
    },

    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            res.render('admin/category', {
                category,
                title: 'Staycation | Category'
            });
        } catch (error) {
            res.redirect('/category');
        }
        
    },
    addCategory: async (req, res) => {
        try {
            const { name, description } = req.body;
            await Category.create({ name, description });
            res.redirect('/category');
        } catch (error) {
            res.redirect('/category');
        }
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
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id:id });
            await category.remove();
            
            res.redirect('/category');
        } catch (error) {
            res.redirect('/category');
        }
    },

    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            res.render('admin/bank', {
                bank,
                title: 'Staycation | Bank'
            });
        } catch (error) {
            res.redirect('/bank');
        }
    },
    addBank: async (req, res) => {
        try {
            const { name_bank, rekening, name_account } = req.body;
            await Bank.create({ 
                name_bank, 
                rekening, 
                name_account, 
                img_url: `images/${req.file.filename}` 
            });
            res.redirect('/bank');
        } catch (error) {
            res.redirect('/bank');
        }
    },
    editBank: async (req, res) => {
        try {
            const { id, name_bank, rekening, name_account } = req.body;
            const bank = await Bank.findOne({ _id:id })

            if(req.file == undefined){
                bank.name_bank = name_bank;
                bank.rekening = rekening;
                bank.name_account = name_account;

                await bank.save();
                res.redirect('/bank');
            } else {
                await fs.unlink(path.join(`public/${bank.img_url}`));
                bank.name_bank = name_bank;
                bank.rekening = rekening;
                bank.name_account = name_account;
                bank.img_url = `images/${req.file.filename}`;
                await bank.save();
                res.redirect('/bank');
            }
        } catch (error) {
            res.redirect('/bank');
        }
    },
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id:id });
            await fs.unlink(path.join(`public/${bank.img_url}`));
            await bank.remove();
            res.redirect('/bank');
        } catch (error) {
            res.redirect('/bank');
        }
    },
    viewItem: async (req, res) => {
        try {
            const item = await Item.find()
                .populate({ path:'imageId', select:'id img_url' })
                .populate({ path:'categoryId', select:'id name' });
            const category = await Category.find();

            res.render('admin/item', {
                title: 'Staycation | Item',
                category, 
                item,
                action: 'view'
            });
        } catch (error) {
            res.redirect('/item');
        }
    },
    addItem: async (req, res) => {
        try {
            const { categoryId, title, price, city, description } = req.body;
            if(req.files.length > 0) {
                
                const category = await Category.findOne({ _id:categoryId });
                const newItem = {
                    categoryId: category._id,
                    title,
                    price,
                    city, 
                    description
                };
                const item = await Item.create(newItem);

                category.itemId.push({ _id:item._id});
                await category.save();

                for(let i = 0; i < req.files.length; i++){
                    const imageSave = await Image.create({ img_url:`images/${req.files[i].filename}`});
                    
                    item.imageId.push({ _id:imageSave._id });
                    await item.save();
                }
                res.redirect('/item');
            }
        } catch (error) {
            console.log('err',error)
            res.redirect('/item');
        }
    },
    showDetailItem: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('id', id)
            const item = await Item.findOne({ _id:id })
                .populate({ path:'imageId', select:'id img_url' })
                .populate({ path:'categoryId', select:'id name' });

            res.render('admin/item', {
                title: 'Staycation | Item',
                item,
                action: 'image'
            });
        } catch (error) {
            console.log(error)
        }
    },
    editItem: async (req, res) => {
        try {
            const { id, categoryId, title, price, city, description } = req.body;
            const item = await Item.findOne({ _id:id })
                .populate({ path:'imageId', select:'id img_url' })
                .populate({ path:'categoryId', select:'id name' });
                 
            if(req.files.length > 0) {
                for(let i = 0; i < item.imageId.length; i++){
                    const imageUpdate = await Image.findOne({_id:item.imageId[i]._id});
                    await fs.unlink(path.join(`public/${imageUpdate.img_url}`)); 
                    
                    imageUpdate.remove()
                    item.imageId = [];

                    await item.save();
                }
                for(let i = 0; i < req.files.length; i++){
                    const imageSave = await Image.create({ img_url:`images/${req.files[i].filename}`});
                    item.imageId.push({ _id:imageSave._id });

                    item.title = title;
                    item.price = price;
                    item.city = city;
                    item.description = description;
                    item.categoryId = categoryId;

                    await item.save();
                }
                res.redirect('/item');
            } else {
                item.title = title;
                item.price = price;
                item.city = city;
                item.description = description;
                item.categoryId = categoryId;
                
                await item.save();
                res.redirect('/item');
            }
        } catch (error) {
            console.log(error)
            res.redirect('/item');
        }
    },
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;
            console.log('id', id)
            const item = await Item.findOne({ _id:id }).populate('imageId');

            for(let i = 0; i < item.imageId.length; i++) {
                const imageDelete = await Image.findOne({_id:item.imageId[i]._id});
                await fs.unlink(path.join(`public/${imageDelete.img_url}`)); 

                imageDelete.remove();
            }
            await item.remove();

            // const categoryId = item.categoryId;
            // const deleteItemCategory = await Category.findOne({ _id:categoryId });
            // deleteItemCategory.itemId.forEach( itemId => {
            //     if(itemId == id){
            //         deleteItemCategory.remove();
            //         console.log('sama', itemId + ' --- ' + id);
            //     }
            // });

            res.redirect('/item');
        } catch (error) {
            console.log(error)
            res.redirect('/item');
        }
    },
    viewBooking: (req, res) => {
        res.render('admin/booking', {
            title: 'Staycation | Booking'
        });
    },   
}