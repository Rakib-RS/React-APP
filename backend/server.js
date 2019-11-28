const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyparser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const port = process.env.PORT | 3001;
const app = express();
app.use(cors());
const router = express.Router();
const dbRoute =
"mongodb+srv://rakib:rakib@cluster0-0bgt6.mongodb.net/Profile?retryWrites=true&w=majority";
mongoose.connect(dbRoute,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
let db = mongoose.connection;
db.once('open',()=>{
  console.log('connected to the database');  
});
//check if connection with the database is sucessful
db.on('error',console.error.bind(console,'MongoDB connection error'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(logger('dev'));
router.get('/getData',(req,res)=>{
  Data.find({},(err,data)=>{
    if(err) return res.json({success:false,error:err});
    return res.json({success:true, data: data});
  })
});
router.post('/putData',(req,res)=>{
  let data = new Data(req.body);
  const{id,message} = req.body;
  if((!id && id!==0)|| !message){
    return res.json({sucess: false, error: 'INVALID INPUTS'})
  }
  data.save((err,rec)=>{
    if(err) return res.json({sucess:false,error:err});
    return res.json({sucess:true,rec});
  })
});
router.post('/updateData',(req,res)=>{
  const {id,update} = req.body;
  console.log("update= " + update);
  console.log(req.body);
  
  
  Data.findOneAndUpdate(id,update,{new:true},(err)=>{
    if(err) return res.json({sucess:false,error:err});
    return res.json({sucess:true});
  })
})
router.delete('/deleteData',(req,res)=>{
  const { id } = req.body;
  console.log(req.body);
  
  Data.findByIdAndRemove(id,(err)=>{
    if(err) 
      return res.json({sucess:false,error:err});
    return res.json({sucess:true});
  })

})
app.use('/api',router);
app.listen(port,()=>{
  console.log('listenning from port '+ port);
  
})
