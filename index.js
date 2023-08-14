const express = require('express')
const dbConnect = require('./config/dbConnect')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const authRouter = require('./routes/authRoute')
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoute')
const categoryRoute = require('./routes/categoryRoute')
const blogCatRoute = require('./routes/blogCatRoute')
const brandRoute = require('./routes/brandRoute')
const couponRoute = require('./routes/couponRoute')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const morgan = require('morgan')
// Connect to database
dbConnect();
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRoute)
app.use('/api/blogcategory', blogCatRoute)
app.use('/api/brandRoute', brandRoute)
app.use('/api/coupon', couponRoute)

// app.use(notFound)
// app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is running in PORT ${PORT}`)    
})