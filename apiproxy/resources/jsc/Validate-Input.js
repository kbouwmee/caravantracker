var plate = context.getVariable('plate');
var weight = context.getVariable('weight');

// clean up dashes used in plate
if(plate !== null && plate.indexOf("-") >0) {
    plate = plate.replace(/-/g, "");
     context.setVariable("plate", plate); 
}

if(plate === "" || weight === "" || weight === null || plate === null) {
   context.setVariable('input.error', true); 
}

context.setVariable("plate",plate.toUpperCase());