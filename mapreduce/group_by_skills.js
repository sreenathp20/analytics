db.cas_requisition1.group(
  {
    key: { "skills": 1, "country": 1 },
    cond: {  },
    reduce: function ( curr, result ) {            
            result.count++;
        },
    initial: {  "count": 0 }
  }
)