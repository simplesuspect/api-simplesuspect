exports.dangerZone = function(anger) {

  if(anger > .3) {
      return "caution";
  }else {
      return "clear";
  }
}

exports.lying = function(sad) {
  if (sad > .3) {
      return "suspicious";
  } else {
      return "clear";
  }
}