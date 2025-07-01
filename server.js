require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes')
const fileRoutes = require('./routes/fileRoutes');
const folderRoutes = require('./routes/folderRoutes');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const PORT=process.env.PORT||8000;
const MONGO_URI=process.env.MONGO_URI;

async function connectDB(){
    try{
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully');
    }catch(err){
        console.log('Error connecting MongoDB');
    }
}
connectDB();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// console.log(__dirname);

console.log('🚀 Starting server initialization...');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride('_method'));

console.log('✅ Middleware configured');

app.get('/', (req, res)=>{
    res.render('index');
})

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);

console.log('✅ Routes configured');

app.listen(PORT, setTimeout(()=>{
    console.log(`🎉 Server started successfully on port ${PORT}`)
    console.log('📊 Environment check:', {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasR2Config: !!(process.env.CLOUDFLARE_R2_ACCESS_KEY && process.env.CLOUDFLARE_R2_SECRET_KEY)
    });
}), 1000);