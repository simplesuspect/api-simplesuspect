exports.dangerZone = function(anger) {

  if(anger > .4) {
    return "caution";
  }else {
      return "clear";
  }
}
