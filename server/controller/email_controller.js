const nodemailer = require("nodemailer");
const Email = require('email-templates');

function sendEmail () {

    const transporter =  nodemailer.createTransport({ // config mail server
        service: 'Gmail',
        auth: {
            user:  "tuanv.2605@gmail.com",
            pass: 'dunghoinhuthe'
        }
    });

    const email = new Email({
        transport: transporter,
        send: true,
        preview: false,
    });

    email.send({
        template: 'hello',
        message: {
            from: 'Steve Milburn <tuanv.2605@gmail.com.com>',
            to: 's2.4home@gmail.com',
        },
        locals: {
            fname: 'John',
            lname: 'Snow',
            ad: {
                "location" : [
                    "GB"
                ],
                "images" : [
                    "https://cdn.shopify.com/s/files/1/0426/6357/5701/products/a2fc034490e46cba35f5.jpg?v=1597750180",
                    "https://cdn.shopify.com/s/files/1/0426/6357/5701/products/live1.jpg?v=1597750180",
                    "https://cdn.shopify.com/s/files/1/0426/6357/5701/products/live2.jpg?v=1597750180",
                    "https://cdn.shopify.com/s/files/1/0426/6357/5701/products/il_794xN.jpg?v=1597750180",
                    "https://cdn.shopify.com/s/files/1/0426/6357/5701/products/aaaa.jpg?v=1597750198"
                ],
                "adType" : 1,
                "timeReload" : 10,
                "title" : "Funny Hallowen Shirt | Hallowen Unisex T-Shirt | On A Dark Desert HighWay",
                "url" : "https://www.awesome-shop.co/products/asd",
                "thumb" : "https://cdn.shopify.com/s/files/1/0426/6357/5701/products/a2fc034490e46cba35f5.jpg?v=1597750180",
                "shopifyProductId" : "5617805525141",
                "sku" : "HW-001",
                "description" : "Only 20$ | FREE SHIPPING Our most popular unisex shirt\n100% cotton\n4.3-ounce and 30 singles\nRib-Knit Crew Neck\nDouble needle sleeves and hem",
            }
        }
    }).then(() => console.log('email has been sent!'));


}
