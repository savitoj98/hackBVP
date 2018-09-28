var express = require('express');
var router = express.Router();
var {dummy} = require('./../db/dummy.js');
/* GET home page. */
var final_obj;

router.get('/', function (req, res, next) {
    var features_data = [];
    var flag = 0;
    for(var i=0;i<dummy.length;i++){
        // var new_id = Math.random()*10000000;

        // var probs = ["Food", "Water", "Sanitation", "Medicine", "Others"];
        // var new_prob = [];
        
        // for(var j=0;j<dummy[i].problems.length;j++){
        //     if(dummy[i].problems[j] != 0)
        //         new_prob.push(probs[j]);        
        // }
        
        var new_obj = { 
            "type": "Feature", 
            "properties": { 
                "id": dummy[i].id, 
                "name": dummy[i].name,
                "problems" : dummy[i].problems
            }, 
            "geometry": { 
                "type": "Point", 
                "coordinates": [ dummy[i].coordinate.long, dummy[i].coordinate.lat ] 
            } 
        };
        features_data.push(new_obj);
        
        if(features_data.length == dummy.length){
            
            final_obj = {
                type: "FeatureCollection",
                crs: {
                    type: "name",
                    properties: {
                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    }
                },
                features: features_data
            }


            res.render('mapbox', {encoded: encodeURIComponent(JSON.stringify(final_obj))});

        }


    }
    

    
});

router.get('/geojson', (req,res,next) => {
    res.status(200).send(final_obj);
})

module.exports = router;
