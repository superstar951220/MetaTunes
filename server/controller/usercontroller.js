import song from '../models/song.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const Login = async(req,res)=>{
    try{
       const data = req.body;
       const user = await User.findOne({username:data.username});
       if(!user){
        const usernameError="user doesnt exist";
        return res.status(404).send({error:usernameError});
       }
       const passwordcorrect = await bcrypt.compare(data.password , user.password);
       if(!passwordcorrect){
        const passwordError="Invalid credentials"
        return res.status(404).send({error:passwordError});
       }
       return res.status(200).send({message:"success" , response:user});
    }catch(err){
        console.log(err);
        const backenderror=err;
        return res.status(404).send({error:backenderror})
    }
};


export const Register = async(req,res)=>{
    try{
        const data = req.body;
        const existinguser = await User.findOne({username:data.username});
        if(existinguser){
            const usernameError="user already exists";
            return res.status(404).send({error:usernameError});
        }
        let hashedPassword;
        hashedPassword = await bcrypt.hash(data.password, 10);
        const newuser = new User({
           username:data.username,
           password:hashedPassword
        })
        await newuser.save();
        return res.status(200).send({message:"success"});
    }catch(err){
        console.log(err);
        const backenderror=err;
        return res.status(404).send({error:backenderror})
    }
};


export const addfavourites = async(req,res)=>{
    try{
       const {person,id} = req.body;
       const data = await User.findOne({username:person});
       data.favourites.push(id);
       await data.save();
       return res.status(200).send({message:"done"});
    }catch(err){
     console.log(err);
     return res.status(404).send({error:err});
    }
 };

 export const removefavourites = async(req,res)=>{
    try{
       const {person,id} = req.body;
       const data = await User.findOne({username:person});
       const index = data.favourites.indexOf(id);
       if(index>-1){
        data.favourites.splice(index,1);
       }
       await data.save();
       return res.status(200).send({message:"done"});
    }catch(err){
     console.log(err);
     return res.status(404).send({error:err});
    }
 };

 export const getfavourites = async(req,res)=>{
    try{
       const {person} = req.body;
       const data = await User.findOne({username:person});
       let array=[];
       console.log(data.favourites);
       for(var i=0;i<data.favourites.length;i++){
          const songyy = await song.findOne({_id:data.favourites[i]});
          console.log(songyy);
          array.push(songyy);
       }
       console.log(array);
       return res.status(200).send({response:array});
    }catch(err){
     console.log(err);
     return res.status(404).send({error:err});
    }
 };