const express=require("express")
const mongoose=require("mongoose");
const bodyparser=require("body-parser")
const app=express();
const userRoutes=require("../backend/components/routes/user-routes")
const offerRoutes=require("../backend/components/routes/offers-routes")
app.use(express.json());
app.use(bodyparser.json())
mongoose.connect('mongodb+srv://Dhananjai_51:Dhana@cluster0.332c2wo.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser:true,useUnifiedTopology:true
})
.then(()=>console.log("mongodb connected"))
.catch((err)=>console.log(err))
app.listen(4000,()=>console.log("server is listening....."))
app.use("/users",userRoutes)
app.use("/offers",offerRoutes) 