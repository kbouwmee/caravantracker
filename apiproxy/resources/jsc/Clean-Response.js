// constants
const safepercentage = 75;
const weighttwopersons = parseInt(160);

// read variable from flow
var carDetails = JSON.parse(context.getVariable("response.content"));
var plate = context.getVariable("plate");

// check if this car exists
if(Object.keys(carDetails).length === 0) 
{
    context.setVariable("notfound", true);
}
// so it does exist
else {

    // build JSON
    var carmodel = carDetails[0].handelsbenaming;
    var make = carDetails[0].merk;
    var carweight = parseInt(carDetails[0].massa_rijklaar);
    var maxweightcaravan = parseInt(carDetails[0].maximum_trekken_massa_geremd);
    
    // calculation of score
    var caravanweight = parseInt(context.getVariable('weight'));
    var carvavanweightcheck = ((caravanweight <= maxweightcaravan) ? true : false);
    var caravanweightscore = Math.round((caravanweight / maxweightcaravan)*100);
    
    // check for rule of thumb on 75% weight of caravan comapred to car with 2 people in it (160kg)
    var safeweight = Math.round(safepercentage * (carweight + weighttwopersons) / 100);
    var safeweightcheck = ((safeweightscore <= safepercentage) ? true : false);
    var safeweightscore = Math.round((caravanweight / (carweight + weighttwopersons)) * 100);
    
    // calculate advise
    var minweight = Math.min(safeweight, maxweightcaravan);
    var minweightcheck = ((minweight >= caravanweight) ? true : false);
    
    // build response JSON
    var result = {cars: [
      					{ make: make
                        , model: carmodel
                        , plate: plate
                        , weight: carweight
                        , caravan: {
                              weight: caravanweight,
                              advise: minweightcheck,
                              maxweight: minweight
                            , allowed: {
                                  score: caravanweightscore, 
                                  check: carvavanweightcheck,
                                  advise: maxweightcaravan
                            }
                            , safe: {
                                score: safeweightscore,
                                check: safeweightcheck,
                                advise: safeweight
                            }
                        }
                        }]
                 };  
        
    context.setVariable("car_brand", make);
    context.setVariable("response.content", JSON.stringify(result));
    context.setVariable("response.header.Content-Type", "application/json");
}
