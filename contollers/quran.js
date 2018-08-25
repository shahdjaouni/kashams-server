const Quran=require('../Database/modules/quran');
const Amira=require('../Database/modules/amira');


module.exports = {
index: async (req,res,next)=>{
    const quran= await Quran.find({});
    res.status(200).json(quran);
},

newQuran: async (req,res,next)=>{
    const newQuran= new Quran(req.body);
    const quran= await newQuran.save();
    res.status(201).json(quran);
},

getQuran: async (req,res,next)=>{
  const {quranId}=req.params;
  const quran = await Quran.findById(quranId);
  res.status(200).json(quran);
},

replaceQuran: async (req,res,next)=>{
  //all field
  const {quranId}=req.params;
  const newQuran = req.body;
  const result= await Quran.findByIdAndUpdate(quranId,newQuran);
  console.log('result',result);
  res.status(200).json({success : true});

},

getQuranAmira : async (req,res,next)=>{
const {quranId}=req.params;
const quran = await Quran.findById(quranId).populate('owner');
res.status(200).json(quran.owner);
},

newQuranAmira : async (req,res,next)=>{
const {quranId}=req.params;
//create a new amira
const newAmira=new Amira(req.body);
//get quran
const quran = await Quran.findById(quranId);
//assign quran as people's Amira
newAmira.people=quran;
//save the amira
await newAmira.save();
// add amira to quran owner
quran.owner.push(newAmira);
//save
await quran.save();
res.status(201).json(newAmira);


}


};
