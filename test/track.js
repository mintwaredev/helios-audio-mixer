describe('Track', function(){

  var mixer, frameRunner;
  window.mixer = mixer

  before(function(){
    mixer = new heliosAudioMixer()

    frameRunner = new heliosFrameRunner()
    frameRunner.add({id:'tween', type: 'everyFrame', f: mixer.updateTween});

  })

  describe('basics', function(){

    var bufferTrack;
    var elementTrack;

    it('should create a track with a buffer source', function(){
      bufferTrack = mixer.createTrack('buffer', { source: './audio/silence_9s', sourceMode: 'buffer' })
      expect( bufferTrack ).to.have.property('play');
    })

    it('should play a track with a buffer source', function(){
      bufferTrack.play();
      bufferTrack.on('play', function(){
        expect( bufferTrack.status.playing ).to.equal( true )
      })
    })

    it('should create a track with an element source', function(){
      elementTrack = mixer.createTrack('element', { source: './audio/silence_9s', sourceMode: 'element' })
      expect( elementTrack ).to.have.property('play');
    })

    it('should play a track with an element source', function(){
      elementTrack.play();
      elementTrack.on('play', function(){
        expect( elementTrack.status.playing ).to.equal( true )
      })
    })


    after(function(){
      mixer.removeTrack('buffer')
      mixer.removeTrack('element')
    })
  })

  describe('chaining', function(){

    var track;

    before(function(){
      track = mixer.createTrack('test', { source: './audio/silence_9s', autoplay: false })
    })

    it('play() should be chainable', function(){
      var chain = track.play()
      console.log(chain);
      expect( chain ).to.have.property('play')
    })

    it('pause() should be chainable', function(){
      var chain = track.pause()
      expect( chain ).to.have.property('play')
    })

    it('stop() should be chainable', function(){
      var chain = track.stop()
      expect( chain ).to.have.property('play')
    })

    it('gain() should be chainable', function(){
      var chain = track.gain(1)
      expect( chain ).to.have.property('play')
    })

    it('pan() should be chainable', function(){
      var chain = track.pan(1)
      expect( chain ).to.have.property('play')
    })

    after(function(){
      mixer.removeTrack('test')
    })

  })

  describe('pan', function(){
    // pan modes: 2d, 360, 3d
  })


  // source types (string, media element, blob) -> proper media source loading
  describe('sources', function(){

  })

  describe('events', function(){

  })

  after(function(){
    frameRunner.remove({id: 'tween'});
    frameRunner = null;
  })
})