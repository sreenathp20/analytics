db.cas_requisition1.aggregate(
   { $group: { _id: { $dayOfYear: "$RequisitionDate"},
               click: { $sum: 1 } } }
)


db.cas_requisition1.aggregate(
   [
     {
       $group:
         {
           _id: "$item",
           minDate: { $min: "$RequisitionDate" },
           maxDate: { $max: "$RequisitionDate" }
         }
     }
   ]
)



db.cas_requisition1.group(
{
    keyf: function(doc) {
        var date = new Date(doc.RequisitionDate);
        var month = date.getMonth()+1;
        var d = date.getDate();
        //console.log(month);
        if(month < 10) {
               month = '0'+month;
        }
        if(d < 10) {
               d = '0'+d;
        }
        var dateKey = date.getFullYear()+""+month+""+d;        
        return {'day':dateKey};
    },
    cond: {},
    initial: {count:0},
    reduce: function(obj, prev) {prev.count++;},
    $sort : { day : -1 }
});