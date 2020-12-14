const express = require("express");
const BodyParser = require("body-parser");
const app = express();
const _ =require("lodash");
// const date =require(__dirname+"/date.js");
const mongoose=require("mongoose");

app.use(BodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', "ejs");



mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useCreateIndex: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const itemsSchema=new mongoose.Schema({
  name:String
});
const Item=mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"To do list "
})
const item2 = new Item({
  name:"hit + button to add items "
})
const item3 = new Item({
  name:"Hit checkbox to delete item "
})

const defaultItems=[item1,item2,item3];


//Before using mongoose
// var head = "";
// var items=["Buy Food","Cook Food","Eat Food"];
// var work=[];

const listSchema=new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});
const List=mongoose.model("List",listSchema);

app.get("/", function(req, res) {

  Item.find({},function(err,results){
    if(results.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(error);
        }else{
          console.log("successfully added");
        }
      })
      res.redirect("/");
    }
  else
    res.render("list", {heading: "Today",newitem:results});

  });
  });
  //befor mongoose
  // head=date.getdate();
// app.get("/work",function(req,res){
//   head="WORK LIST";
//   res.render("list",{heading:head,newitem:work});
//
// })
app.get("/:parameter",function(req,res){
  var Listname=_.capitalize(req.params.parameter);
  console.log(Listname);
  List.findOne({name:Listname},function(err,foundList){
    if(!err){
      if(!foundList)
          {
            const newName=new List({
              name:Listname,
              items:defaultItems
            });
            // newName.save();
            // res.redirect("/"+Listname);
            newName.save(() => res.redirect('/' +Listname));

          }

        else
          {console.log("Exists");
          res.render("list",{heading:foundList.name,newitem:foundList.items});
        }
      }
      else{
        console.log(err);
      }
  });


});

// app.get("/about",function(req,res){
//   res.render("about");
// })
app.post("/",function(req,res){
  const itemName=req.body.ListItem;

  const newItem=new Item({
    name:itemName
  });

  console.log(req.body);

  if(req.body.list==="Today"){
    // newItem.save();
    // res.redirect("/");
    newItem.save(() => res.redirect('/'));

    // work.push(req.body.ListItem)
    // res.redirect("/work");
  }
  else{
    List.findOne({name:req.body.list},function(err,foundList){
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/"+req.body.list);
    })
    // items.push(req.body.ListItem);
    // res.redirect("/");
  }

});
app.post("/delete",function(req,res){
  var checked=req.body.checkbox ;
  const name=req.body.ListName;
  if(name=="Today"){
  Item.findByIdAndRemove(checked,function(err){
    if(!err)
    { console.log("Suceessfully Deleted");
      res.redirect("/");}

  })
}
else
{
      List.findOneAndUpdate({name:name},{$pull: {items:{_id:checked}}},function(err,foundList){
        if(!err)
            res.redirect("/"+name);
      })
}

});

app.listen(3000, function() {
  console.log("Hey");
});
