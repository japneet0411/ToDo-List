module.exports.getdate=function(){
  var date=new Date();
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"
  };
   return date.toLocaleDateString("en-Us",options);
}

module.exports.getday=function(){
  var date=new Date();
  var options={
    weekday:"long"

  };
   return date.toLocaleDateString("en-Us",options);
 }
