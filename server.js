const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes')
const fileRoutes = require('./routes/fileRoutes');
const folderRoutes = require('./routes/folderRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.get('/', (req, res)=>{
    res.render('index');
})

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);

app.listen(PORT, setTimeout(()=>{
    console.log(`Server started on port ${PORT}`)
}), 1000);