(function () {
  let measurementInputs = document.querySelectorAll("input.measurement");
  for (var i = 0; i < measurementInputs.length; i++) {
    measurementInputs[i].oninput = function () {
      let length = parseFloat(document.getElementById("length").value) || 0;
      let width = parseFloat(document.getElementById("width").value) || 0;

      if (length <= 0 || width <= 0) {
        document.getElementById("perimeter").innerHTML = 0;
        document.getElementById("area").innerHTML = 0;
      } else {
        document.getElementById("perimeter").innerHTML = (length + width) * 2;
        document.getElementById("area").innerHTML = length * width;
      }
    }
  }
})();