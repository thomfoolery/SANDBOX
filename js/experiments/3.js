define(
  
// MODULE NAME
  'experiment/3',

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

        objects = [],

        MAX_DEPTH = 64,
        
        OFFSET    = {
                    x: 0,
                    y: 0
                  },
        
        SPEED     = 0.1,
        BGOPACITY = 0.8,

        ANIMATOR,
        CONTROLS,
        DISPLAY,

        API
        
        ;

    function randomRange ( minVal, maxVal ) {
      return Math.floor( Math.random() * (maxVal - minVal - 1) ) + minVal;
    }

// --- PRIVATE CLASSES --- //
    
    function Charge ( p ) {

      var color       = p.color     || 0,
          width       = p.width     || 0,
          radius      = p.radius    || 0,
          phaseLength = p.phaseLength || 2 * 1000, // millisecs
          phase       = 0,
          direction   = 1

          ;

      this.update = function ( timeLapsed ) {

        phase += timeLapsed / phaseLength * direction;
        if ( phase >= 1 )     { phase = 1; direction *= -1; }
        else if ( phase <= 0 )  { phase = 0; direction *= -1; }
      };

      this.draw = function ( timeLapsed ) {

        var PI = Math.PI,
            x  = ctx.canvas.width / 2,
            y  = ctx.canvas.height / 2
            ;

        ctx.save();

          ctx.lineWidth   = width;
          ctx.strokeStyle = 'hsla(' + color + ',100%,50%,' + ( .1 + phase * .15 ) + ')';

          ctx.translate( x, y );

          ctx.beginPath();
            ctx.arc( 0, 0, radius, 0, PI * 2 * phase );
             ctx.stroke();
          ctx.closePath();

        ctx.restore();
      };
    }

    function Ring ( p ) {

      for ( var x in p ) {
        if ( typeof p[ x ] === 'number' ) {
          p[ x ] = Math.round( p[ x ] );
        }
      }
      
      var x         = p.x         || 0,
          y         = p.y         || 0,
          color     = p.color     || 0,
          width     = p.width     || 0,
          radius    = p.radius    || 0,
          length    = p.length    || 0,
          offset    = p.offset    || 0,
          rotation,
          mouseAxis = p.mouseAxis || 'x',
          
          dimension = (mouseAxis === 'x' ) ? 'width' : 'height'
          ;

      rotation = CONTROLS.getMousePosition()[ mouseAxis ] / ctx.canvas[ dimension ];

      this.update = function ( timeLapsed ){

        rotation = CONTROLS.getMousePosition()[ mouseAxis ] / ctx.canvas[ dimension ];
      };

      this.draw   = function ( timeLapsed ){

        var PI = Math.PI
            ;

        ctx.save();

          ctx.lineWidth   = width;
          ctx.strokeStyle = 'hsla(' + color + ',100%,50%,1)';

          ctx.translate( x, y );
          ctx.rotate( ( rotation * PI * 2 ) + offset );

          ctx.beginPath();
            ctx.arc( 0, 0, radius, - length/2, length/2 );
            ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
            ctx.arc( 0, 0, radius, ( PI - length/2 ), ( PI + length/2 ) );
            ctx.stroke();
          ctx.closePath();
          
        ctx.restore();
      };
    }

    function Bar ( p ) {

      for ( var x in p ) {
        if ( typeof p[ x ] === 'number' ) {
          p[ x ] = Math.round( p[ x ] );
        }
      }
      
      var x       = p.x       || ctx.canvas.width / 2,
          y       = p.y       || ctx.canvas.height * .85,
          radius  = p.radius  || 10
          color   = p.color   || 0
          ;
      
      this.update = function ( timeLapsed ) {

      };

      this.draw = function ( timeLapsed ) {

        ctx.save();

          ctx.strokeStyle = 'hsla(' + color + ',100%,50%,1)';
          ctx.beginPath();
            ctx.arc( x - radius *4, y, radius, 0, Math.PI * 2 );
          ctx.closePath();
          ctx.stroke();

          ctx.strokeStyle = 'hsla(' + color + ',100%,50%,1)';
          ctx.beginPath();
            ctx.arc( x, y, radius, 0, Math.PI * 2 );
          ctx.closePath();
          ctx.stroke();

          ctx.strokeStyle = 'hsla(' + color + ',100%,50%,1)';
          ctx.beginPath();
            ctx.arc( x + radius *4, y, radius, 0, Math.PI * 2 );
          ctx.closePath();
          ctx.stroke();

        ctx.restore();
      };
    }

    function Star ( p ) {

      var x, y, z, color
          ;

      _init();

      function _init ( ) {

        x = randomRange( -150, 150 );
        y = randomRange( -150, 150 );
        z = randomRange( 1, MAX_DEPTH );

        if ( Math.random() > .1 ) {
          color = 'white';
        }
        else {
          color = 'red'
        }
      }

      this.update = function ( timeLapsed ) {

        if ( z <= 0 ) {
          _init()
        }
        z -= SPEED;

        if ( typeof OFFSET.x === 'number' && typeof OFFSET.y === 'number' ) {
          
          x += OFFSET.x * -1;
          y += OFFSET.y * -1;
        }
      };

      this.draw = function ( timeLapsed ) {

        var k  = MAX_DEPTH *3 / z,
            px = x * k + ctx.canvas.width  / 2,
            py = y * k + ctx.canvas.height / 2,
            size,
            a
            ;

        if ( px >= 0 && px <= ctx.canvas.width && py >= 0 && py <= ctx.canvas.height ) {
          
          size = ( 1 - z / MAX_DEPTH ) * 3;
          a    = 1 - z / MAX_DEPTH;
          
          ctx.save();
            ctx.fillStyle = color;
            ctx.beginPath();
              ctx.arc( px, py, Math.abs( size ), 0, Math.PI * 2 );
            ctx.closePath();
            ctx.fill();
          ctx.restore();
        }
      };
    }

// --- PRIVATE FUNCTIONS --- //

    function _step ( timeLapsed ) {

      _update( timeLapsed );
      _draw( timeLapsed );
    }

    function _update ( timeLapsed ) {

      objects.forEach( function( item ) {

        item.update( timeLapsed );
      });

      OFFSET.x = ( CONTROLS.getMousePosition().x - ctx.canvas.width  / 2 ) / ( ctx.canvas.width / 2 );
      OFFSET.y = ( CONTROLS.getMousePosition().y - ctx.canvas.height / 2 ) / ( ctx.canvas.height / 2 );

      if ( CONTROLS.isLeftMousePressed() ) {
        
        SPEED     = .5;
        BGOPACITY = .2;
      }
      else {
        
        SPEED     = .1;
        BGOPACITY = .6;
      }

      //log ( OFFSET.x );
      //log ( OFFSET.y );
    }

    function _draw ( timeLapsed ) {

      var opacity = ( SPEED < .5 ) ? .8 : .2 ;

      ctx.fillStyle = 'rgba(0,0,0,' + BGOPACITY + ')';
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

      objects.forEach( function( item ) {

        item.draw( timeLapsed );
      });

      ctx.lineWidth   = 2;
      ctx.strokeStyle = 'hsla(50,100%,50%,1)';
    }

// (!) RETURNS SINGLETON
// --- PUBLIC METHODS --- //

    API = {

      setup:   function( _ANIMATOR, _CONTROLS, _DISPLAY ) {

        ANIMATOR = _ANIMATOR, CONTROLS = _CONTROLS, DISPLAY  = _DISPLAY;

        DISPLAY.setup( _P.display_cfg );
        CONTROLS.setup( DISPLAY.getCanvas() );
        ctx = DISPLAY.getContext();

        var base_dimension = Math.min( ctx.canvas.width, ctx.canvas.height );

        for ( var i = 0; i < 500; i++ ) {

          objects.push( new Star() );
        }

        objects.push(
          new Charge({
            color:       180,
            width:       20,
            radius:      base_dimension * .39,
            phaseLength: 5 * 1000
          })
        );

        objects.push(
          new Ring({
            x:          ctx.canvas.width / 2,
            y:          ctx.canvas.height / 2,
            color:      120,
            width:      2,
            radius:     base_dimension * .45,
            length:     Math.PI / 2,
            offset:     0,
            mouseAxis:  'y'
          })
        );

        objects.push(
          new Ring({
            x:          ctx.canvas.width / 2,
            y:          ctx.canvas.height / 2,
            color:      120,
            width:      base_dimension * .025,
            radius:     base_dimension * .45,
            length:     Math.PI / 2,
            offset:     0,
            mouseAxis:  'x'
          })
        );

        objects.push(
          new Ring({
            x:          ctx.canvas.width / 2,
            y:          ctx.canvas.height / 2,
            color:      50,
            width:      2,
            radius:     base_dimension * .42,
            length:     Math.PI / 2,
            offset:     0,
            mouseAxis:  'x'
          })
        );

        objects.push(
          new Ring({
            x:          ctx.canvas.width / 2,
            y:          ctx.canvas.height / 2,
            color:      50,
            width:      base_dimension * .02,
            radius:     base_dimension * .42,
            length:     Math.PI / 1.5,
            offset:     0,
            mouseAxis:  'y'
          })
        );

        objects.push(
          new Bar({
            y:      ctx.canvas.height * .85,
            radius: base_dimension * .01,
            color:  120
          })
        );

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