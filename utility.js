exports.dangerZone = function(averageEmotions) {
var response = null;
if(averageEmotions <= .3) {
    response = "no danger";
 }else if(averageEmotions > .3 && averageEmotions < .6) {
    response = "caution";
 }else {
    response = "danger zone";
 }
  return response;
}
