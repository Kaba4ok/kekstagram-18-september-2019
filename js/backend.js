'use strict';

(function () {

  var URL = 'https://js.dump.academy/kekstagram/data';

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError();
      }
    });

    xhr.open('GET', URL);

    xhr.send();
  };

  window.backend = {
    load: load
  };

})();
