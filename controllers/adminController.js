const User = require('../models/User');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
    viewSignIn: async (req, res) => {
        try {
            if(req.session.user == null || req.session.user == undefined){
                res.render('index', {        
                    title: 'Staycation | Login'
                });
            } else {
                res.redirect('/dashboard');
            }
            
        } catch (error) {
            res.redirect('/login');
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username:username });
            if(!user){
                console.log('kosong');
                res.redirect('/login');
            };

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if(!isPasswordMatch){
                console.log('ga cocok');
                res.redirect('/login');
            };

            req.session.user = {
                id: user.id,
                username: user.username
            };
            res.redirect('/dashboard')
        } catch (error) {
            console.log(error);
        }
    },
    logout: async (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    },
    viewDashboard: async (req, res) => {
        try {
            const member = await Member.find();
            const booking = await Booking.find();
            const item = await Item.find();

            res.render('admin/dashboard', {
                title: 'Staycation | Dashboard',
                member,
                booking,
                item,
                userLogin: req.session.user
            });
        } catch (error) {
            console.log(error);
            res.redirect('/dashboard');
        }
    },
    viewUser: async (req, res) => {
        try {
            const user = await User.find();

            user.forEach( item => {
                if(item.role == 1){
                    item.role = 'Viewer';
                } else if(item.role == 2){
                    item.role = 'Editor';
                } else if(item.role == 3){
                    item.role = 'Tester';
                } else if(item.role == 4){
                    item.role = 'Admin';
                } else if(item.role == 5){
                    item.role = 'Super Admin';
                }
            })
            
            res.render('admin/user', {
                title: 'Staycation | User',
                user,
                userLogin: req.session.user
            });
        } catch (error) {
            res.redirect('/user');
        }
    },
    addUser: async (req, res) => {
        try {
            const { name, username, password, confirmPassword, role } = req.body;

            if(password === confirmPassword) {
                await User.create({ 
                    name, 
                    username, 
                    password, 
                    role
                });
            } else {
                console.log('ga sama')
            }
            res.redirect('/user');
        } catch (error) {
            res.redirect('/user');
        }
    },
    editUser: async (req, res) => {
        const { id, name, username, password, confirmPassword, role } = req.body;
        
        try {
            const user = await User.findOne({ _id:id });

            if(password === confirmPassword) {
                user.name = name;
                user.username = username;
                user.password = password;
                user.role = role

                await user.save();

                res.redirect('/user');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            res.redirect('/user');
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findOne({ _id:id });
            await user.remove();
            
            res.redirect('/user');
        } catch (error) {
            res.redirect('/user');
        }
    },
    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            res.render('admin/category', {
                title: 'Staycation | Category',
                category,
                userLogin: req.session.user
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
                title: 'Staycation | Bank',
                bank,
                userLogin: req.session.user
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
            let item = await Item.find()
                .populate({ path:'imageId', select:'id img_url' })
                .populate({ path:'categoryId', select:'id name' });
            const category = await Category.find();

            res.render('admin/item', {
                title: 'Staycation | Item',
                category,
                item,
                action: 'view',
                userLogin: req.session.user
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
            const { id, categoryId } = req.params;
            const item = await Item.findOne({ _id:id })
                .populate('imageId');

            const category = await Category.findOne({ _id:categoryId })
                .populate('itemId');

            for(let i=0; i < category.itemId.length; i++){
                if(category.itemId[i]._id.toString() == id){
                    category.itemId.pull({ _id:id });
                    await category.save();
                }
            }

            for(let i = 0; i < item.imageId.length; i++) {
                const imageDelete = await Image.findOne({_id:item.imageId[i]._id});
                await fs.unlink(path.join(`public/${imageDelete.img_url}`)); 

                imageDelete.remove();
            }
            await item.remove();

            res.redirect('/item');
        } catch (error) {
            console.log(error)
            res.redirect('/item');
        }
    },
    showDetailItem: async (req, res) => {
        const { id } = req.params;
        try {
            const item = await Item.findOne({ _id:id })
                .populate({ path:'imageId', select:'id img_url' })
                .populate({ path:'categoryId', select:'id name' });
            const feature = await Feature.find({ itemId:id });
            const activity = await Activity.find({ activityId:id });

            res.render('admin/item', {
                title: 'Staycation | Detail Item',
                item,
                id,
                feature,
                activity,
                action: 'image',
                userLogin: req.session.user
            });
        } catch (error) {
            console.log(error)
        }
    },
    addFeature: async (req, res) => {
        const { name, qty, itemId } = req.body;
        try {
            const feature = await Feature.create({ 
                name, 
                qty, 
                itemId,
                img_url: `images/${req.file.filename}` 
            });

            const item = await Item.findOne({ _id:itemId });
            item.featureId.push({_id: feature._id});
            await item.save();

            res.redirect(`/item/${itemId}`);
        } catch (error) {
            res.redirect(`/item/${itemId}`);
        }
    },
    editFeature: async (req, res) => {
        try {
            const { id, itemId, name, qty } = req.body;
            const feature = await Feature.findOne({ itemId:itemId });

            if(req.file == undefined){
                feature.name = name;
                feature.qty = qty;

                await feature.save();
                res.redirect(`/item/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${feature.img_url}`));
                feature.name = name;
                feature.qty = qty;
                feature.img_url = `images/${req.file.filename}`;

                await feature.save();
                res.redirect(`/item/${itemId}`);
            }
        } catch (error) {
            res.redirect(`/item/${itemId}`);
        }
    },
    deleteFeature: async (req, res) => {
        const { itemId, id } = req.params;

        try {
            const feature = await Feature.findOne({ _id:id });
            const item = await Item.findOne({ _id:itemId })
                .populate('featureId');

            for(let i=0; i < item.featureId.length; i++){
                if(item.featureId[i]._id.toString() == feature._id.toString()){
                    item.featureId.pull({ _id:feature._id });
                    await item.save()
                }
            }
            await fs.unlink(path.join(`public/${feature.img_url}`));
            await feature.remove();
            
            res.redirect(`/item/${itemId}`);
        } catch (error) {
            res.redirect(`/item/${itemId}`);
        }
    },
    addActivity: async (req, res) => {
        const { name, type, itemId } = req.body;
        console.log('body', name + type + itemId)
        try {
            const activity = await Activity.create({ 
                name, 
                type, 
                itemId,
                img_url: `images/${req.file.filename}` 
            });
            console.log('act', activity);

            const item = await Item.findOne({ _id:itemId });
            item.activityId.push({_id: activity._id});
            await item.save();
            console.log('item', item);

            res.redirect(`/item/${itemId}`);
        } catch (error) {
            console.log(error)
            res.redirect(`/item/${itemId}`);
        }
    },
    editActivity: async (req, res) => {
        try {
            const { id, itemId, name, type } = req.body;
            const activity = await Activity.findOne({ itemId:itemId });

            if(req.file == undefined){
                activity.name = name;
                activity.type = type;

                await activity.save();
                res.redirect(`/item/${itemId}`);
            } else {
                await fs.unlink(path.join(`public/${activity.img_url}`));
                activity.name = name;
                activity.type = type;
                activity.img_url = `images/${req.file.filename}`;

                await activity.save();
                res.redirect(`/item/${itemId}`);
            }
        } catch (error) {
            res.redirect(`/item/${itemId}`);
        }
    },
    deleteActivity: async (req, res) => {
        const { itemId, id } = req.params;
        console.log('item', itemId + '= id =' + id)

        try {
            const activity = await Activity.findOne({ _id:id });
            const item = await Item.findOne({ _id:itemId })
                .populate('activityId');

            for(let i=0; i < item.activityId.length; i++){
                if(item.activityId[i]._id.toString() == activity._id.toString()){
                    item.activityId.pull({ _id:activity._id });
                    await item.save()
                }
            }
            await fs.unlink(path.join(`public/${activity.img_url}`));
            await activity.remove();
            
            res.redirect(`/item/${itemId}`);
        } catch (error) {
            res.redirect(`/item/${itemId}`);
        }
    },
    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find()
                .populate('memberId')
                .populate('bankId')

            console.log('book',booking)
            res.render('admin/booking', {
                title: 'Staycation | Booking',
                booking,
                action: 'View',
                userLogin: req.session.user
            });
        } catch (error) {
            res.redirect('/booking');
        }
    },
    showDetailBooking: async (req, res) => {
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({ _id:id })
                .populate({ path:'bankId' })
                .populate({ path:'memberId' });

            res.render('admin/booking', {
                title: 'Staycation | Detail Booking',
                booking,
                action: 'Detail',
                userLogin: req.session.user
            });
        } catch (error) {
            res.redirect('/booking');
        }
    },
    actionConfirmation: async (req, res) => {
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({ _id:id });
            booking.payment.status = 'Accept';
            booking.save();

            res.redirect(`/booking/${id}`);
        } catch (error) {
            console.log(error);
            res.redirect(`/booking/${id}`);
        }
    },
    rejectConfirmation: async (req, res) => {
        const { id } = req.params;
        try {
            const booking = await Booking.findOne({ _id:id });
            booking.payment.status = 'Reject';
            booking.save();

            res.redirect(`/booking/${id}`);
        } catch (error) {
            console.log(error);
            res.redirect(`/booking/${id}`);
        }
    }
}