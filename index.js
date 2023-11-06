const express = require('express')
const dbConnect = require('./config/dbConnect')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const authRouter = require('./routes/authRoute')
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoute')
const categoryRouter = require('./routes/categoryRoute')
const blogCatRouter = require('./routes/blogCatRoute')
const brandRouter = require('./routes/brandRoute')
const couponRouter = require('./routes/couponRoute')
const enqRouter = require('./routes/enqRoute')
// const paymentRouter = require('./routes/paymentRoute')
const uploadRouter = require('./routes/uploadRoute')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const cors = require('cors')
const morgan = require('morgan')
// Connect to database
dbConnect();
app.use(morgan("dev"))
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/blogcategory', blogCatRouter)
app.use("/api/enquiry", enqRouter);
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/upload', uploadRouter)
// app.use('/api/payment', paymentRouter)

// console.log(process.env.CLIENT_ID)
// app.use(notFound)
// app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server is running in PORT ${PORT}`)    
})