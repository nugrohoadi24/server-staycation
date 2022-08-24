const Item = require('../models/Item');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking'); 
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Member = require('../models/Member');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPick = await Item.find()
                .select('_id title country city price')
                .populate({ path:'imageId', select:'_id img_url' })
                .limit(5);
            
            const category = await Category.find()
                .select('_id name')
                .populate({ 
                    path:'itemId', 
                    select:'_id title country city isPopular imageId',
                    populate: { path:'imageId', select:'_id img_url', perDocumentLimit:1 },
                    perDocumentLimit:4,
                    option: { sort: {sumBooking: -1} }
                })
                .limit(3);

            const booking = await Booking.find();
            const activity = await Activity.find();
            const city = await Item.find();

            for(let i=0; i < category.length; i++){
                for(let j=0; j < category[i].itemId.length; j++){
                    const item = await Item.findOne({ _id:category[i].itemId[j]._id });
                    item.isPopular = false;
                    await item.save();

                    if(category[i].itemId[0] === category[i].itemId[j]){
                        item.isPopular = true;
                        await item.save();
                    }
                }
            }

            const testimonial = {
                _id: "6304f9767f673f906aaffcbd",
                imageUrl: "images/testimonial-landingpages.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Nugroho Adi",
                familyOccupation: "Fullstack Developer"
            }

            res.status(200).json({
                hero: {
                    booking: booking.length,
                    activity: activity.length,
                    city: city.length,
                },
                mostPick,
                category,
                testimonial,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Internal Server Error!'});
        }

    },
    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id:id })
                .populate({ path:'featureId'})
                .populate({ path:'activityId'})
                .populate({ path:'imageId', select:'_id img_url' });

            const bank = await Bank.find();

            const testimonial = {
                _id: "6304f9767f673f906aaffcbd",
                imageUrl: "images/testimonial-landingpages.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Nugroho Adi",
                familyOccupation: "Fullstack Developer"
            };

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'Internal Server Error!'});
        }
    },
    bookingPage: async (req, res) => {
        try {
            // Set value
            const {
                itemId,
                duration,
                start_date,
                end_date,
                name,
                email,
                phone,
                accountHolder,
                bank_from,
                proofPayment
            } = req.body;

            // Check files
            if(!req.file) {
                return res.status(200).json({message:'Image Not Found!'});
            }

            // Check Validation
            if(
                itemId == undefined ||
                duration == undefined ||
                start_date == undefined ||
                end_date == undefined ||
                name == undefined ||
                email == undefined ||
                phone == undefined ||
                accountHolder == undefined ||
                bank_from == undefined ||
                proofPayment
            ) {
                return res.status(404).json({message:'Lengkapi Semua Field!'});
            }

            //set Item
            const item = await Item.findOne({ _id:itemId });
            if(!item){
                return res.status(404).json({message:'Gagal, Item tidak ditemukan!'})
            }

            item.sumBooking += 1;
            await item.save();

            //Calculate
            let total = item.price * duration;
            let tax = total * 0.10;
            let invoice = Math.floor(1000000 + Math.random() * 9000000);

            //Save Data to Database
            const member = await Member.create({
                name,
                email,
                phone
            });

            const newBooking = {
                invoice,
                start_date,
                end_date,
                total: total += tax,
                itemId: {
                    _id: item.id,
                    title: item.title,
                    price: item.price,
                    duration: duration
                },
                memberId: member.id,
                payment: {
                    proofPayment: `images/${req.file.filename}`,
                    bank_from,
                    accountHolder
                }
            }
            const booking = await Booking.create(newBooking);

            res.status(201).json({message:'Sukses Booking', booking});

        } catch (error) {
            console.log(error)
        }
    }
}