const express = require("express")

const router = express.Router() ;

// router.get("/" , (req,res) =>{
//       res.send("tools found")
// }) ;
// router.post("/tools" , (req,res) =>{
//       res.send("tool added")
// }) ;


router.route("/").get((req,res) =>{
    res.send("tools found")
}).post((req,res) =>{
    res.send("tool added")
})

module.exports = router ;