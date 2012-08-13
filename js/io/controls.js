/*
 * CONTROL INPUT MODULE (!) SINGLETON
 * ====================
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
 *   getMousePosition ()          : OBJ
 *        x : INT
 *        y : INT
 * 
 *   isLeftMousePressed ()        : BOOLEAN
 *   isRightMousePressed ()       : BOOLEAN
 *
 *   isKeyPressed ( key )         : BOOLEAN
 * 
 */
define(

  // MODULE NAME
  'input/controls',

  // DEPENDANCIES
  [],

  // CALLBACK
  function () {

    var _P = {},

        MOUSE_X = 0,
        MOUSE_Y = 0,

        MOUSE_LEFT  = false,
        MOUSE_RIGHT = false,

        KEY_CODES = {
          UP:     [38,87],
          RIGHT:  [39,68],
          DOWN:   [40,83],
          LEFT:   [37,65]
        },

        KEY_PRESSED  = false,
        KEYS_PRESSED = {},

        $canvas,

        API

        ;

    

// --- PUBLIC METHODS --- //
    API = {

      setup: function ( canvas ) {
        
        $canvas   = $( canvas );
        _P.offset = $canvas.offset();

        // on mouse move
        $( window ).mousemove( function ( e ) {
          
          MOUSE_X = e.clientX;
          MOUSE_Y = e.clientY;
        });

        // mouse down
        $( window ).mousedown( function ( e ) {
          
          if ( API.getMousePosition() === null ) return;

          if ( e.which === 1 ){
            MOUSE_LEFT  = true;
          }
          else if ( e.which === 3 ){
            MOUSE_RIGHT = true;
          }
        });
        // mouse up
        $( window ).mouseup( function ( e ) {

          if ( e.which === 1 ){
            MOUSE_LEFT  = false;
          }
          else if ( e.which === 3 ){
            MOUSE_RIGHT = false;
          }
        });

        // on key down
        $( window ).keydown( function( e ) {

          KEY_PRESSED               = true;
          KEYS_PRESSED[ e.keyCode ] = true;

        });

        // on key up
        $( window ).keyup( function( e ) {

          if ( KEYS_PRESSED[ e.keyCode ] ) {
            delete KEYS_PRESSED[ e.keyCode ];
          }
          if ( Object.keys( KEYS_PRESSED ).length === 0 ) {
            KEY_PRESSED = false;
          }
        });
      },

      getMousePosition: function () {
        
        var x, y;

        x = MOUSE_X - _P.offset.left;
        y = MOUSE_Y - _P.offset .top;

        if ( x < 0 || x > $canvas.width() )  return null;
        if ( y < 0 || y > $canvas.height() ) return null;

        return {
          'x': x,
          'y': y
        };
      },

      isLeftMousePressed: function () {
        return MOUSE_LEFT;
      },

      isRightMousePressed: function () {
        return MOUSE_RIGHT;
      },

      isKeyPressed: function ( key ) {

        if ( key === undefined ){
          return KEY_PRESSED;
        }

        if ( typeof key === 'number' ) {
          if ( KEYS_PRESSED[ key ] ) {
            return false;
          }
          return false;
        }

        if ( typeof key != 'string' ) {
          return false;
        }

        key = key.toUpperCase();

        if ( KEY_CODES[ key ] ) {
          for ( var i in  KEY_CODES[ key ] ){
            if ( KEYS_PRESSED[ KEY_CODES[ key ][ i ] ] ) {
              return true;
            }
          }
        }
        return false;
      },

      releaseAll: function() {
        for ( var i in  KEYS_PRESSED ){
          delete KEYS_PRESSED[ i ];
        }
      }
    };



    // (!) RETURNS SINGLETON
    return API;
  }
);
