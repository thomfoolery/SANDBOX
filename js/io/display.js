/*
 * DISPLAY (!) SINGLETON
 * =======
 *
 * PUBLIC PROPERTIES
 *------------------
 * 
 *   N/A
 * 
 * PUBLIC SETTERS
 *---------------
 * 
 *   N/A
 * 
 * PUBLIC METHODS 
 *---------------
 *
 *   setup ()           : OBJ
 *        parent        : DOM element
 *        fullscreen    : BOOLEAN
 *        responsive    : BOOLEAN
 *        context       : String
 *        width         : BOOLEAN
 *        height        : BOOLEAN      
 * 
 *   getCanvas ()       : NULL
 *   getContext ()      : NULL
 * 
 */
define(

  // MODULE NAME
  'output/display',

  // DEPENDANCIES
  [],

  // CALLBACK
  function Display () {

    var _P = {

        parent:     document.querySelector('body'),

        fullscreen: true,
        responsive: true,
        context:    '2d',

        width:      640,
        height:     480,

        cursor: 'pointer'

      },

      API,

      canvas,
      ctx

      ;



// --- PRIVATE FUNCTIONS --- //

    function _init () {

      canvas = document.createElement('canvas');
      ctx = canvas.getContext( _P.context );

      document.querySelector('body').style.overflow = 'hidden';
      _P.parent.appendChild ( canvas );

      canvas.style.cursor = _P.cursor;

    }

// (!) RETURNS SINGLETON
// --- PUBLIC METHODS --- //

    API = {

      setup: function ( properties ) {

        $.extend( true, _P, properties );
        _init();


        
        if ( _P.fullscreen ) {

          document.querySelector('html').style.margin  = '0';
          document.querySelector('html').style.padding = '0';

          document.querySelector('body').style.margin  = '0';
          document.querySelector('body').style.padding = '0';

          _P.parent.style.margin  = '0';
          _P.parent.style.padding = '0';

          _P.width  = canvas.width  = window.innerWidth;
          _P.height = canvas.height = window.innerHeight;

        }
        else {

          canvas.width  = _P.width
          canvas.height = _P.height

        }

        if  ( ! _P.responsive && ! _P.fullscreen ) return ctx;

        $( window ).resize( function( e ) {
          _P.width  = canvas.width  = window.innerWidth;
          _P.height = canvas.height = window.innerHeight;
        });

        return ctx;
      },

      getCanvas: function () {
        return canvas;
      },

      getContext: function ( ) {
        return ctx;
      }
    };

  return API;

  }
);
