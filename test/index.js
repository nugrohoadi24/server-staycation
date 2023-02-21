const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const fs = require('fs');

chai.use(chaiHttp);

describe('API ENDPOINT TESTING', ()=> {
    it('GET Landing Page', (done) => {
        chai.request(app).get('/api/landing').end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(200);

            //check test key object
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('hero');
            expect(res.body.hero).to.have.all.keys('booking', 'activity', 'city');

            expect(res.body).to.have.property('mostPick');
            expect(res.body.mostPick).to.have.an('array');

            expect(res.body).to.have.property('category');
            expect(res.body.category).to.have.an('array');

            expect(res.body).to.have.property('testimonial');
            expect(res.body.testimonial).to.have.an('object');

            done();
        });
    });

    it('GET Detail Page', (done) => {
        chai.request(app).get('/api/detail/62fca4157f1e941388f38d97').end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(200);

            //check test key object
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('title');
            expect(res.body).to.have.property('price');
            expect(res.body).to.have.property('country');
            expect(res.body).to.have.property('city');
            expect(res.body).to.have.property('isPopular');
            expect(res.body).to.have.property('description');
            expect(res.body).to.have.property('sumBooking');

            expect(res.body).to.have.property('imageId');
            expect(res.body.imageId).to.have.an('array');

            expect(res.body).to.have.property('featureId');
            expect(res.body.featureId).to.have.an('array');

            expect(res.body).to.have.property('activityId');
            expect(res.body.activityId).to.have.an('array');

            expect(res.body).to.have.property('bank');
            expect(res.body.bank).to.have.an('array');

            expect(res.body).to.have.property('testimonial');
            expect(res.body.testimonial).to.have.an('object');

            done();
        })
    });

    it('POST Booking', (done) => {
        const image = __dirname + '/buktibayar.jpeg';
        const dataSample = {
            image,
            itemId: '62fca4157f1e941388f38d97',
            duration: '1',
            start_date: '2022-09-10',
            end_date: '2022-09-11',
            name: 'Putra',
            email: 'putramail@gmail.com',
            phone: '089513119849',
            accountHolder: 'Adi',
            bank_from: 'BCA',
        }

        chai.request(app).post('/api/booking')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('itemId', dataSample.itemId)
        .field('duration', dataSample.duration)
        .field('start_date', dataSample.start_date)
        .field('end_date', dataSample.end_date)
        .field('name', dataSample.name)
        .field('email', dataSample.email)
        .field('phone', dataSample.phone)
        .field('accountHolder', dataSample.accountHolder)
        .field('bank_from', dataSample.bank_from)
        .attach('image', fs.readFileSync(dataSample.image), 'buktibayar.jpeg')
        .end((error, res) => {
            expect(error).to.be.null;
            expect(res).to.have.status(201);

            //post test
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Sukses Booking');
            expect(res.body).to.have.property('booking');
            expect(res.body.booking).to.have.all.keys(
                '_id', 
                'invoice',
                'payment',
                'start_date',
                'end_date',
                'total',
                'itemId',
                'memberId',
                '__v'
            );
            expect(res.body.booking.payment).to.have.all.keys(
                'status',
                'proofPayment',
                'bank_from',
                'accountHolder'
            );
            expect(res.body.booking.itemId).to.have.all.keys(
                '_id',
                'title',
                'price',
                'duration'
            );
            console.log(res.body.booking);

            done();
        })
    })
})