const mongoose=require("mongoose")
const patientSchema= mongoose.Schema({
    name:{type: String, required: true},
    age: {type: Number, required:true},
    weight: {type: Number, required:true},
    height: {type: Number, required:true},
    bmi: {type: Number, required: true}
})

const model=mongoose.model("patientmodel", patientSchema)

module.exports=model