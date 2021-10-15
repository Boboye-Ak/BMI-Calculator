const path= require("path")
const express= require("express")
const mongoose= require("mongoose")
const patient=require("../models/patient")
mongoose.connect("mongodb://localhost/Patients")
const router=express.Router()
router.use(express.urlencoded({extended: false}))
router.use(express.json())

router.get("/", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../Pages/homepage.html"))
    
})

router.get("/BMI", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../Pages/BMI.html"))
})

router.post("/BMI", async(req, res)=>{
    if ((Number(req.body.height)==NaN)||(Number(req.body.weight)==NaN))
    {return res.send("The Height and Weight have to be numbers")}
    let findData=await patient.find({name: req.body.name})
    if (findData.length>0){return res.send("This person is already in the database")}
    let bmi= Number(req.body.weight)/(Number(req.body.height)**2)
    let data= new patient({name: req.body.name, age: Number(req.body.age), weight: Number(req.body.weight), height: Number(req.body.height), bmi: bmi})
    await patient.create(data)
    res.send(`<h1>His BMI is ${data.bmi}</h1>`)

})

router.get("/database", async (req, res)=>{
    let data=await patient.find({})
    let msg=""
    let output= data.map((person, index)=>{
        let singleMsg= `<h1>${person.name} is ${person.age} years old, is ${person.height}m tall, weighs ${person.weight}kg and has a BMI of ${person.bmi} \n</h1>`
        msg=msg+singleMsg
    })

    
    res.send(msg)

})

router.get("/find", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../Pages/find.html"))
})

router.post("/find", async (req, res)=>{
    let data=await patient.findOne({name: req.body.search})
    if(!data){return res.send("Item you are looking for is not in the database")}
    let output= `<h1>The patient is  ${data.name}  \n aged: ${data.age}   \n  weight:  ${data.weight}kg  \n  height: ${data.height}m`
    res.send(output)
    

})

router.get("/delete", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../Pages/delete.html"))
})

router.post("/delete", async (req, res)=>{
    let data=await patient.findOne({name: req.body.delete})
    await patient.deleteOne({name: req.body.delete})
    if(!data){return res.send("Item you are trying to delete is not in the database")}
    let output= `<h1>The patient with ${data.name} \n aged: ${data.age} weight: ${data.weight} \n height: ${data.height} has been deleted</h1>`
    res.send(output)
    

})

router.all("*", (req, res)=>{
    res.send("<h1>Resource not found</h1>")
})

module.exports=router