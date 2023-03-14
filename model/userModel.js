const mongoose =  require('mongoose');
const schema = mongoose.Schema({
        
        name :{
                type : String,
                required:true
        } ,
        roomId :{
                type : String,
                required:true
        }
    
});

const model =  mongoose.model('roomModel',schema);

module.exports = model;