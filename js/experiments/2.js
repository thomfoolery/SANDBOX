define(
  
// MODULE NAME
  'experiment/2',

// DEPENDANCIES
  [],

// CALLBACK
  function experiment () {

    var _P = {

          display_cfg: {
            parent: document.querySelector('[role=main]'),
            fullscreen: true,
            responsive: true,
            context: '2d',
            cursor: 'crosshair'
          }

        },

        ctx,

        interval = {
          min:    2   *1000, // in millisec,
          max:    2   *1000, // in millisec,
          length: 5   *1000, // in millisec,
          lapsed: 0   *1000 // in millisec
        },

        orbit = {
          maxDivisions: 12,
          divisions:    1,
          radius:       100,
          phase:        0
        },

        circles = [],

        ANIMATOR,
        CONTROLS,
        DISPLAY,

        API
        
        ;

// --- PRIVATE CLASSES --- //        

    function Circle ( x, y, radius, color ) {

      var pxS = 100 / 1000; // px / millisec
      
      this.x      = x || ctx.canvas.width / 2;
      this.y      = y || ctx.canvas.height / 2;
      
      this.radius = radius || 0;
      this.color  = color || 0;

      this.life     = 0 * 1000; // in millisec
      this.lifeSpan = 5 * 1000; // in millisex

      this.draw = function( timeLapsed ){
        
        var opacity,
            phase,
            color
            ;

        if ( this.life > this.lifeSpan ) circles.shift();

        this.radius += timeLapsed * pxS;
        this.life   += timeLapsed;
        
        phase       = this.life / this.lifeSpan;
        opacity     = ( phase < .5 ) ? phase *2 : 2.01 - ( phase *2 );      // fades from 0 -> 1 -> 0

        color       = this.color + Math.cos( Math.PI * 8 * phase ) * 22.5;  // 4 cyles +/- 8th of color wheel

        ctx.save();

          ctx.globalCompositeOperation = 'lighter';

          ctx.lineWidth   = 5;
          ctx.strokeStyle = 'hsla(' + color + ',100%,50%,' + opacity + ')';
          ctx.beginPath();

            ctx.arc( this.x, this.y, Math.round( this.radius ), 0, 2* Math.PI );

          ctx.closePath();
          ctx.stroke();

        ctx.restore();
      }
    }

// --- PRIVATE FUNCTIONS --- //

    function _step ( timeLapsed ) {

      if ( timeLapsed > 100 ) return;

      _update( timeLapsed );
      _draw( timeLapsed );
    }

    function _update ( timeLapsed ) {

      interval.lapsed += timeLapsed;
      interval.length =  interval.max;

      if ( CONTROLS.isRightMousePressed() ){

        ( ANIMATOR.isAnimating() ) ? ANIMATOR.stop() : ANIMATOR.start();
      }

      /*
      // set interval based on mouse position
      // above bottom 1/4
      // below top    1/4
      interval.length = (function(){

        var y, screenQuarter = ctx.canvas.height / 4;

        y = Math.max( CONTROLS.getMousePosition().y, screenQuarter );
        y = Math.min( y, ctx.canvas.height - screenQuarter );

        return Math.round(
            ( y - screenQuarter ) / ( ctx.canvas.height / 2 )
            * ( interval.max - interval.min ) 
            + interval.min
          );
      })();
      
      orbit.divisions = (function(){

        var y, screenQuarter = ctx.canvas.height / 4;

        y = Math.max( CONTROLS.getMousePosition().y, screenQuarter );
        y = Math.min( y, ctx.canvas.height - screenQuarter );

        return Math.round(
            ( y - screenQuarter ) / ( ctx.canvas.height / 2 )
            * orbit.maxDivisions
          );
      })();
      */
        

      if ( circles.length === 0 ) {
        circles.push( new Circle ( ctx.canvas.width / 2, ctx.canvas.height / 2, 0, Math.random() * 360 ) );
      }

      if ( interval.lapsed > interval.length ) {

        interval.lapsed = 0;

        orbit.divisions ++;
        if ( orbit.divisions > orbit.maxDivisions ) {
          orbit.divisions = 1;
        }

        var x, y;

        /*
        x = ctx.canvas.width / 2  + orbit.radius * Math.cos( Math.PI * 2 * orbit.phase / ( Math.PI * 2 / ( Math.PI * 2 / orbit.divisions ) ));
        y = ctx.canvas.height / 2 + orbit.radius * Math.sin( Math.PI * 2 * orbit.phase / ( Math.PI * 2 / ( Math.PI * 2 / orbit.divisions ) ));

        circles.push( new Circle ( x, y, 0, circles[ circles.length -1 ].color + 5 )  );

        orbit.phase ++;
        if ( orbit.phase > Math.PI * 2 / ( Math.PI * 2 / orbit.divisions ) ) {
          orbit.phase = 0;
        }
        */
        if ( orbit.divisions > 1 ) {
          for ( var i = 0; i < orbit.divisions; i++ ){

            x = ctx.canvas.width / 2  + orbit.radius * Math.cos( Math.PI * 2 * i / ( Math.PI * 2 / ( Math.PI * 2 / orbit.divisions ) ));
            y = ctx.canvas.height / 2 + orbit.radius * Math.sin( Math.PI * 2 * i / ( Math.PI * 2 / ( Math.PI * 2 / orbit.divisions ) ));
            circles.push( new Circle ( x, y, 0, circles[ circles.length -1 ].color + 5 )  );
          }
        }
        else {
          x = ctx.canvas.width / 2;
          y = ctx.canvas.height / 2;
          circles.push( new Circle ( x, y, 0, circles[ circles.length -1 ].color + 5 )  );
        }
      }
      
      if ( CONTROLS.isLeftMousePressed() ) {
        
        circles.push( new Circle ( CONTROLS.getMousePosition().x, CONTROLS.getMousePosition().y, 0, 0 ) );
      }
      
      if ( circles.length > 30 ) circles.shift();
    }

    function _draw ( timeLapsed ) {

      ctx.fillStyle = 'rgba(0,0,0,.2)';
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      circles.forEach( function ( item ) {
        item.draw( timeLapsed );
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