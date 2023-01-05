require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors') // cors for accessing apis w/ different origin
const morgan=require('morgan')
const app=express()
const {PORT = 3000, DATABASE_URL} = process.env

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology:true,
    useNewUrlParser:true
})

mongoose.connection
.on("open", ()=>console.log("connected to mongoose"))
.on("close", ()=>console.log("disconnected to mongoose"))
.on("err", (error)=>console.log(err))


const PeopleSchema=new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema)

// middleware /////////////////////////////////////////////////
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


// routes ////////////////////////////////////////////////////////
app.get('/', (req, res)=>{
    res.send('hello world')
})

app.get('/people', async(req, res)=>{
    try{
        res.json(await People.find({})) // a promise to 
    }catch(error){
        res.status(400).json(error)
    }
})

app.post('/people', async (req, res)=>{
    try{
        res.json(await People.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

app.put('/people/:id', async (req, res)=>{
    try{
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new:true})) //get the new data 
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete('/people/:id', async (req, res)=>{
    try{
        res.json(await People.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

app.get('/people/:id', async(req, res)=>{
    try{
        res.json(await People.findById(req.params.id))
    }catch(error){

    }
})
app.listen(PORT, (req, res)=>{
    console.log("listening on " + PORT)
})

