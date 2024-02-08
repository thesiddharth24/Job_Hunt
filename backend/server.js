 import app from './app.js'
 import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET
});

 app.listen(process.env.PORT,() => {
     console.log(`App is listening on ${process.env.PORT}`);
 })