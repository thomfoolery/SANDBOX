/* Author: Thomas Yuill
 *
 * SANDBOX
 * =======
 *   for demoing experiments.
 *
 */

require.config({
  baseUrl: "js",
  paths: {
    'util'       : 'utils',
    'class'      : 'classes',
    'input'      : 'io',
    'output'     : 'io',
    'experiment' : 'experiments'
  }
});

define(
  
// MODULE NAME
  'main',

// DEPENDANCIES
  [
    'util/dom',
    'util/animator',
    'input/controls',
    'output/display'
  ],

// CALLBACK
  function main ( DOM, ANIMATOR, CONTROLS, DISPLAY ) {
    
    var experimentNumber,
        experiment_ID
        ;

    experimentNumber = getParamByName('exp');

    if ( experimentNumber ) {

      experiment_ID = 'experiment/' + ( experimentNumber );

      require([ experiment_ID ], function ( EXP ){

        EXP.setup( ANIMATOR, CONTROLS, DISPLAY );
        EXP.start();
      });
    }
    else {

      var experiments = [ 1, 2, 3 ],
          container = document.querySelector('[role=main]'),
          ul        = document.createElement('ul')
          ;

      container.appendChild( ul );

      experiments.forEach( function( item ) {

        ul.appendChild( DOM.createElement('<li><a href="?exp=' + item + '">' + item + '</a></li>') );
      });
    }

    function getParamByName( name ) { name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]"); var regexS = "[\\?&]" + name + "=([^&#]*)", regex = new RegExp(regexS), results = regex.exec(window.location.search); if ( results == null ){ return null; } else { return decodeURIComponent(results[1].replace(/\+/g, " ")); } }
  }
);