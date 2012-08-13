define(

// module name
  'util/dom',

// dependancies
  [],

// public API
  function () {

    var API = {

      createElement: function( string ) {

        var div = document.createElement('div');
        div.innerHTML = string;

        if ( div.childNodes.length > 1 ) 
          return div.childNodes;
        return div.firstChild;
      }
    };

    return API;

  }
);