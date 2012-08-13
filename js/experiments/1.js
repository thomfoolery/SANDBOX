define(
  
// MODULE NAME
  'experiment/1',

// DEPENDANCIES
  [],

// CALLBACK
  function experiment () {

    var _P = {

          display_cfg: {
            parent: document.querySelector('[role=main]'),
            fullscreen: true,
            responsive: true,
            context: '2d'
          }

        },

        ctx,

        objects = [],

        ANIMATOR,
        CONTROLS,
        DISPLAY,

        API
        
        ;

// --- PRIVATE CLASSES --- //        

    function Class ( x, y ) {
      
      this.x = x;
      this.y = y;
      
      this.update = function ( timeLapsed ){};
      this.draw   = function ( timeLapsed ){};
    }

// --- PRIVATE FUNCTIONS --- //

    function _step ( timeLapsed ) {

      _update( timeLapsed );
      _draw( timeLapsed );
    }

    function _update ( timeLapsed ) {

    }

    function _draw ( timeLapsed ) {

      ctx.fillStyle = 'black';
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      objects.forEach( function( item ) {

        item.update();
        item.draw();
      });
    }

// (!) RETURNS SINGLETON
// --- PUBLIC METHODS --- //

    API = {

      setup:   function( _ANIMATOR, _CONTROLS, _DISPLAY ) {

        ANIMATOR = _ANIMATOR, CONTROLS = _CONTROLS, DISPLAY  = _DISPLAY;

        DISPLAY.setup( _P.display_cfg );
        CONTROLS.setup( DISPLAY.getCanvas() );
        ctx = DISPLAY.getContext();

        ANIMATOR.draw = _step;
      },

      start:   function() {
        ANIMATOR.start();
      },

      stop:    function() {
        ANIMATOR.stop();
      },

      destroy: function() {
        ANIMATOR.stop();
      }
    };

    return API;

  }
);