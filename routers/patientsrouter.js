const path= require("path")
const express= require("express")
const mongoose= require("mongoose")
const patient=require("../models/patient")
mongoose.connect("mongodb://localhost/Patients")
const router=express.Router()
router.use(express.urlencoded({extended: false}))
router.use(express.json())

const tablify=(data)=>{
    return (`<tr><td>${data.name}</td><td>${data.age}</td><td>${data.height}</td><td>${data.weight}</td><td>${data.bmi}</td></tr>`)

}


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
    if (findData.length>0){return res.send("<h1>THIS PERSON IS ALREADY IN THE DATABASE. YOU CAN VIEW THE DATABASE FROM THE HOMEPAGE</h1>")}
    let bmi= Number(req.body.weight)/(Number(req.body.height)**2)
    let data= new patient({name: req.body.name, age: Number(req.body.age), weight: Number(req.body.weight), height: Number(req.body.height), bmi: bmi})
    await patient.create(data)
    res.send(`<h1>His BMI is ${data.bmi}</h1>`)

})

router.get("/database", async (req, res)=>{
    let data=await patient.find({})
    const top=`<table><thead><tr><td>NAME</td><td>AGE</td><td>HEIGHT</td><td>WEIGHT</td><td>BMI</td></tr></thead>`
    let msg=""
    const bottom="</table>"
    const out=data.map((person, index)=>{
        let singleMsg=tablify(person) 
        msg=msg+singleMsg
    })

    const output= top + msg + bottom

    
    res.send(output)

})

router.get("/find", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "../Pages/find.html"))
})

router.post("/find", async (req, res)=>{
    const top=`<table><thead><tr><td>NAME</td><td>AGE</td><td>HEIGHT</td><td>WEIGHT</td><td>BMI</td></tr></thead>`
    const bottom=`</table>`
    let data=await patient.findOne({name: req.body.search})
    if(!data){return res.send("Item you are looking for is not in the database")}
    const msg=tablify(data)
    const output=top+msg+bottom 
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