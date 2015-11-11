!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var mix=require("./modules/mix");module.exports=mix},{"./modules/mix":4}],2:[function(require,module,exports){var u=require("./utils"),debug={};module.exports=debug,debug.level=1,debug.log=function(lvl){if(lvl<=debug.level){for(var str="[Mixer] ",i=1;i<arguments.length;i++)str+=arguments[i]+" ";console.log(str)}},debug.setLogLvl=function(lvl){this.debug=u.constrain(lvl,0,2),debug.log(0,"Set log level:",lvl)}},{"./utils":7}],3:[function(require,module,exports){var detect={};detect.webAudio=!(!window.AudioContext&&!window.webkitAudioContext),detect.audioTypes=function(){var el=document.createElement("audio");return{".m4a":!(!el.canPlayType||!el.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/,"")),".mp3":!(!el.canPlayType||!el.canPlayType("audio/mpeg;").replace(/no/,"")),".ogg":!(!el.canPlayType||!el.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/,""))}}(),detect.videoTypes=function(){var el=document.createElement("video");return{".webm":!(!el.canPlayType||!el.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/,"")),".mp4":!(!el.canPlayType||!el.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,"")),".ogv":!(!el.canPlayType||!el.canPlayType('video/ogg; codecs="theora"').replace(/no/,""))}}(),detect.browser=function(){return"undefined"!=typeof bowser?bowser:{firefox:!!navigator.userAgent.match(/Firefox/g),android:!!navigator.userAgent.match(/Android/g),msie:!!navigator.userAgent.match(/MSIE/g),ios:!!navigator.userAgent.match(/(iPad|iPhone|iPod)/g),version:!1}}(),detect.tween=function(){return"undefined"==typeof TWEEN?!1:!0}(),module.exports=detect},{}],4:[function(require,module,exports){var u=require("./utils"),Track=require("./track"),html5Track=require("./track-html5"),detect=require("./detect"),debug=require("./debug"),Mix=function(opts){("Firefox"===detect.browser.name&&detect.version&&detect.version<25||detect.browser.ios===!0&&7===detect.browser.version)&&(detect.webAudio=!1);var defaults={fileTypes:[".mp3",".m4a",".ogg"],html5:!detect.webAudio,gain:1};this.options=u.extend(defaults,opts||{}),this.setLogLvl=debug.setLogLvl,this.tracks=[],this.lookup={},this.muted=!1,this.context=null,this.detect=detect;for(var i=this.options.fileTypes.length-1;i>=0;i--)detect.audioTypes[this.options.fileTypes[i]]||this.options.fileTypes.splice(i,1);return this.options.fileTypes.length<=0?void console.warn("Can’t initialize: none of the specified audio types can play in this browser."):(detect.webAudio&&(this.context="function"==typeof AudioContext?new window.AudioContext:new window.webkitAudioContext),debug.log(1,"initialized,",detect.webAudio?"Web Audio Mode,":"HTML5 Mode,","can play:",this.options.fileTypes),this)};Mix.prototype.on=u.events.on,Mix.prototype.one=u.events.one,Mix.prototype.off=u.events.off,Mix.prototype.trigger=u.events.trigger,Mix.prototype.createTrack=function(name,opts){var mix=this;if(!name)return void debug.log(0,"Can’t create track with no name");if(mix.lookup[name])return void debug.log(0,"a track named “"+mix.name+"” already exists");var track=mix.options.html5?new html5Track(name,opts,mix):new Track(name,opts,mix);return mix.tracks.push(track),mix.lookup[name]=track,track},Mix.prototype.removeTrack=function(_input){var trackName,mix=this;"string"==typeof _input?trackName=_input:"object"==typeof _input&&_input.name&&(trackName=_input.name);var track=mix.lookup[trackName];if(!track)return void debug.log(1,'can’t remove "'+trackName+'", it doesn’t exist');for(var rest=[],arr=mix.tracks,total=arr.length,i=0;total>i;i++)arr[i]&&arr[i].name===trackName&&(rest=arr.slice(i+1||total),arr.length=0>i?total+i:i,arr.push.apply(arr,rest));track.pause(),track.events=[],track.element&&(track.element.src=""),track.trigger("remove",mix),track=null,delete mix.lookup[trackName],debug.log(2,'Removed track "'+trackName+'"')},Mix.prototype.getTrack=function(name){return this.lookup[name]||!1},Mix.prototype.pause=function(){debug.log(2,"Pausing "+this.tracks.length+" track(s) ||");for(var i=0;i<this.tracks.length;i++)this.tracks[i].pause()},Mix.prototype.play=function(){debug.log(2,"Playing "+this.tracks.length+" track(s) >");for(var i=0;i<this.tracks.length;i++)this.tracks[i].play()},Mix.prototype.stop=function(){debug.log(2,"Stopping "+this.tracks.length+" track(s) .");for(var i=0;i<this.tracks.length;i++)this.tracks[i].stop()},Mix.prototype.mute=function(){if(!this.muted){this.muted=!0,debug.log(2,"Muting "+this.tracks.length+" tracks");for(var i=0;i<this.tracks.length;i++)this.tracks[i].mute()}},Mix.prototype.unmute=function(){if(this.muted){this.muted=!1,debug.log(2,"Unmuting "+this.tracks.length+" tracks");for(var i=0;i<this.tracks.length;i++)this.tracks[i].unmute()}},Mix.prototype.gain=function(masterGain){if("number"==typeof masterGain){masterGain=u.constrain(masterGain,0,1),this.options.gain=masterGain;for(var i=0;i<this.tracks.length;i++)this.tracks[i].gain(this.tracks[i].gain())}return this.options.gain},Mix.prototype.updateTween=function(){TWEEN.update()},Mix.prototype.report=function(){for(var report="",i=0;i<this.tracks.length;i++)report+=this.tracks[i].gain()+"	"+this.tracks[i].currentTime()+"	"+this.tracks[i].name+"\n";console.log(report)},module.exports=Mix},{"./debug":2,"./detect":3,"./track":6,"./track-html5":5,"./utils":7}],5:[function(require,module,exports){function dummy(){return this}var u=require("./utils"),debug=(require("./detect"),require("./debug")),HTML5Track=function(name,opts,mix){console.log("HTML5 TRACK");var track=this,defaults={source:!1,gain:1,start:0,cachedTime:0,startTime:0,looping:!1,autoplay:!0,muted:mix.muted?!0:!1};track.options=u.extend(defaults,opts||{}),track.name=name,track.status={loaded:!1,ready:!1,playing:!1},track.mix=mix,track.events={},track.tweens={},track.element=void 0,debug.log(1,'createTrack "'+track.name+'", mode: "html5", autoplay: '+track.options.autoplay),"string"==typeof track.options.source&&0!==track.options.source.indexOf("blob:")?(track.options.source+=track.mix.options.fileTypes[0],track.element=document.createElement("audio")):"object"==typeof track.options.source&&(track.element=track.options.source,track.source=track.element.src),track.useElement()};HTML5Track.prototype.on=u.events.on,HTML5Track.prototype.one=u.events.one,HTML5Track.prototype.off=u.events.off,HTML5Track.prototype.trigger=u.events.trigger,HTML5Track.prototype.useElement=function(){var track=this;track.options.looping&&(track.element.loop=!0),track.options.muted&&(track.element.muted=!0),track.options.autoplay&&(track.element.autoplay=!0);var ready=function(){track.status.loaded=!0,track.options.autoplay&&track.play(),track.trigger("load",track)};track.element.addEventListener("load",ready,!1),track.element.addEventListener("canplaythrough",ready,!1),track.element.addEventListener("error",function(){track.trigger("loadError")}),track.element.src=track.options.source,track.element.load()},HTML5Track.prototype.play=function(){var track=this;return debug.log(1,'Playing track "'+track.name+'" >'),track.gain(track.options.gain),track.status.ready=!0,track.element.play(),track.trigger("play",track),track},HTML5Track.prototype.pause=function(at){var track=this;if(track.status.ready&&track.status.playing)return track.element.pause(),debug.log(2,'Pausing track "'+track.name+'" at '+track.options.cachedTime),track.trigger("pause",track),track},HTML5Track.prototype.stop=function(){var track=this;if(track.status.ready&&track.status.playing)return track.element.pause(),track.element.currentTime=0,track.status.playing=!1,track.trigger("stop",track),debug.log(2,'Stopping track "'+track.name),track},HTML5Track.prototype.pan=dummy,HTML5Track.prototype.tweenPan=dummy,HTML5Track.prototype.gain=function(val){var track=this;return"number"==typeof val?(val=u.constrain(val,0,1),track.element.volume=val*track.mix.options.gain,debug.log(2,'"'+track.name+'" setting gain to '+track.options.gain),track.trigger("gain",track.options.gain,track),track):track.element.volume},HTML5Track.prototype.tweenGain=function(_val,_tweenDuration){var track=this;return new Promise(function(resolve,reject){("number"!=typeof _val||"number"!=typeof _tweenDuration)&&reject(Error("Invalid value for duration.")),debug.log(2,'"'+track.name+'" tweening gain '+track.options.gain+" -> "+_val+" ("+_tweenDuration+"ms)"),track.tweens.gain&&track.tweens.gain.stop(),track.tweens.gain=new TWEEN.Tween({currentGain:track.options.gain}).to({currentGain:_val},_tweenDuration).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function(){track.gain(this.currentGain)}).onComplete(function(){resolve(track)}).start()})},HTML5Track.prototype.mute=function(){return this.options.muted=!0,this},HTML5Track.prototype.unmute=function(){return this.element.muted=!1,this},HTML5Track.prototype.currentTime=function(setTo){if(this.status.ready){var track=this;return"number"==typeof setTo?(debug.log(2,'setting track "'+track.name+'" to time',setTo),track.element.currentTime=setTo,track):track.element.currentTime}},HTML5Track.prototype.formattedTime=function(includeDuration){return includeDuration?u.timeFormat(this.currentTime())+"/"+u.timeFormat(this.duration()):u.timeFormat(this.currentTime())},HTML5Track.prototype.duration=function(){return this.element.duration||0},module.exports=HTML5Track},{"./debug":2,"./detect":3,"./utils":7}],6:[function(require,module,exports){function playCreateNodes(_this){if(debug.log(2,'Creating nodes for track "'+_this.name+'"'),_this.nodes={},_this.addNode("panner").addNode("gain"),_this.options.nodes.length)for(var i=0;i<_this.options.nodes.length;i++)_this.addNode(_this.options.nodes[i]);_this.nodes.lastnode.connect(_this.mix.context.destination)}function playElementSource(_this){_this.nodes||(playCreateNodes(_this),_this.element.addEventListener("ended",function(){_this.trigger("ended",_this)},!1)),_this.status.ready=!0,_this.trigger("ready",_this),_this.options.looping?_this.element.loop=!0:_this.element.loop=!1,_this.gain(_this.options.gain),_this.pan(_this.options.pan),_this.options.startTime=_this.element.currentTime-_this.options.cachedTime;var startFrom=_this.options.cachedTime||0;debug.log(2,'Playing track (element) "'+_this.name+'" from '+startFrom+" ("+_this.options.startTime+") gain "+_this.gain()),_this.element.currentTime=startFrom,_this.element.play(),_this.trigger("play",_this)}function setEndTimer(){var _this=this,startFrom=_this.options.cachedTime||0,timerDuration=_this.source.buffer.duration-startFrom;_this.onendtimer=setTimeout(function(){_this.trigger("ended",_this),_this.options.looping&&(bowser&&bowser.chrome&&Math.floor(bowser.version)>=42?(_this.stop(),_this.play()):setEndTimer.call(_this))},1e3*timerDuration)}function playBufferSource(_this){_this.status.ready=!1,_this.source=null;var finish=function(){playCreateNodes(_this),_this.status.ready=!0,_this.trigger("ready",_this),_this.source.loop=_this.options.looping?!0:!1,_this.gain(_this.options.gain),_this.pan(_this.options.pan),_this.options.startTime=_this.source.context.currentTime-_this.options.cachedTime;var startFrom=_this.options.cachedTime||0;debug.log(2,'Playing track (buffer) "'+_this.name+'" from '+startFrom+" ("+_this.options.startTime+") gain "+_this.gain()),"function"==typeof _this.source.start?_this.source.start(0,startFrom):_this.source.noteOn(startFrom),_this.onendtimer=!1,setEndTimer.call(_this),_this.trigger("play",_this)};if("function"==typeof _this.mix.context.createGain)_this.mix.context.decodeAudioData(_this.options.audioData,function(decodedBuffer){if(!_this.status.ready){_this.source=_this.mix.context.createBufferSource();var sourceBuffer=decodedBuffer;_this.source.buffer=sourceBuffer,finish()}});else if("function"==typeof _this.mix.context.createGainNode){_this.source=_this.mix.context.createBufferSource();var sourceBuffer=_this.mix.context.createBuffer(_this.options.audioData,!0);_this.source.buffer=sourceBuffer,finish()}}function playSingleElement(_this){debug.log(2,'Playing track (single element) "'+_this.name+'" >'),_this.gain(_this.options.gain),_this.status.ready=!0,_this.element.play(),_this.trigger("play",_this)}function timeFormat(seconds){var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60),s=Math.floor(seconds-60*m)<10?"0"+Math.floor(seconds-60*m):Math.floor(seconds-60*m);return m+":"+s}var u=require("./utils"),detect=require("./detect"),debug=require("./debug"),Track=function(name,opts,mix){if(this.defaults={sourceMode:"buffer",source:!1,nodes:[],gain:1,gainCache:!1,pan:0,panX:0,panY:0,panZ:0,start:0,cachedTime:0,startTime:0,looping:!1,autoplay:!0,muted:mix.muted?!0:!1},this.options=u.extend(this.defaults,opts||{}),this.options.gainCache===!1&&(this.options.gainCache=this.options.gain),this.name=name,this.status={loaded:!1,ready:!1,playing:!1},this.mix=mix,this.events={},this.tweens={},this.nodes=void 0,this.onendtimer=void 0,this.element=void 0,this.source=void 0,"string"==typeof this.options.source&&0!==this.options.source.indexOf("blob:")?this.options.source+=this.mix.options.fileTypes[0]:"object"==typeof this.options.source&&(this.options.sourceMode="element"),debug.log(2,'createTrack "'+this.name+'", mode: "'+this.options.sourceMode+'", autoplay: '+this.options.autoplay),detect.webAudio===!0){if(!this.options.source)return void debug.log(2,'Creating track "'+name+'" without a source');"buffer"===this.options.sourceMode?this.loadBufferSource():"element"===this.options.sourceMode&&("object"==typeof this.options.source?this.useHTML5elementSource():this.createHTML5elementSource())}else{if(debug.log(2,"creating html5 element for track "+name),this.element=document.querySelector("audio#"+name),!this.element){var el=document.createElement("audio");el.id=name,document.body.appendChild(el),this.element=document.querySelector("audio#"+name)}var canplay=function(){this.status.loaded||(this.status.loaded=!0,this.status.ready=!0,this.options.autoplay||this.pause(),this.trigger("load",this))},_this=this;_this.element.addEventListener("canplaythrough",canplay,!1),_this.element.addEventListener("load",canplay,!1),_this.element.addEventListener("ended",function(){_this.options.looping?(debug.log(2,"Track "+_this.name+" looping"),_this.element.currentTime=0,_this.element.play()):(_this.trigger("ended",_this),_this.mix.removeTrack(_this.name))},!1),this.createHTML5elementSource(this.options.source)}};Track.prototype.on=u.events.on,Track.prototype.one=u.events.one,Track.prototype.off=u.events.off,Track.prototype.trigger=u.events.trigger,Track.prototype.createHTML5elementSource=function(){var _this=this;if(_this.options.source){debug.log(2,'Track "'+this.name+'" creating HTML5 element source: "'+_this.options.source+_this.mix.options.fileTypes[0]+'"'),_this.status.ready=!1;var src=_this.options.source;_this.options.source=document.createElement("audio"),_this.options.source.crossOrigin="",_this.options.source.src=src,_this.useHTML5elementSource()}},Track.prototype.useHTML5elementSource=function(){var _this=this;if(_this.options.source){debug.log(2,'Track "'+this.name+'" use HTML5 element source: "'+_this.options.source+'"'),_this.element=_this.options.source,_this.options.source.crossOrigin="",_this.options.source=_this.element.src,_this.options.looping&&(_this.element.loop=!0),_this.options.muted&&(_this.element.muted=!0),_this.mix.context&&(_this.source=_this.mix.context.createMediaElementSource(_this.element));var ready=function(){_this.status.loaded=!0,_this.options.autoplay&&_this.play(),_this.trigger("load",_this)};return _this.element.addEventListener("canplaythrough",ready),_this.element.addEventListener("error",function(){_this.trigger("loadError")}),_this.element.load(),_this}},Track.prototype.loadBufferSource=function(forcePlay){var _this=this;if(_this.options.source){debug.log(2,'Track "'+this.name+'" webAudio source: "'+_this.options.source+'"');var request=new XMLHttpRequest;request.open("GET",_this.options.source,!0),request.responseType="arraybuffer",request.onload=function(){debug.log(2,'"'+_this.name+'" loaded "'+_this.options.source+'"'),_this.options.audioData=request.response,_this.status.loaded=!0,_this.trigger("load",_this),forcePlay?_this.play(!0):_this.options.autoplay&&_this.play()},request.onerror=function(){debug.log(1,'couldn’t load track "'+_this.name+'" with source "'+_this.options.source+'"'),_this.trigger("loadError",_this)},request.send()}},Track.prototype.addNode=function(nodeType){var _this=this;if(_this.nodes.lastnode||(_this.nodes.lastnode=_this.source),debug.log(2," +  addNode "+nodeType),"analyze"===nodeType){_this.nodes.processor=_this.mix.context.createScriptProcessor(2048,1,1),_this.nodes.analyser=_this.mix.context.createAnalyser(),_this.nodes.analyser.smoothingTimeConstant=.5,_this.nodes.analyser.fftSize=32,_this.nodes.processor.connect(_this.mix.context.destination),_this.nodes.analyser.connect(_this.nodes.processor),_this.options.bufferLength=_this.nodes.analyser.frequencyBinCount,_this.analysis={raw:new Uint8Array(_this.nodes.analyser.frequencyBinCount),average:0,low:0,mid:0,high:0};var third=Math.round(_this.options.bufferLength/3),scratch=0;_this.nodes.lastnode.connect(_this.nodes.analyser),_this.nodes.processor.onaudioprocess=function(){_this.nodes.analyser.getByteFrequencyData(_this.analysis.raw),scratch=0;for(var i=0;i<_this.options.bufferLength;i++)scratch+=_this.analysis.raw[i];_this.analysis.average=scratch/_this.options.bufferLength/256,scratch=0;for(var i=0;third>i;i++)scratch+=_this.analysis.raw[i];_this.analysis.low=scratch/third/256,scratch=0;for(var i=third;2*third>i;i++)scratch+=_this.analysis.raw[i];_this.analysis.mid=scratch/third/256,scratch=0;for(var i=2*third;i<_this.options.bufferLength;i++)scratch+=_this.analysis.raw[i];_this.analysis.high=scratch/third/256,_this.trigger("analyse",_this.analysis)}}else if("gain"===nodeType)_this.mix.context.createGainNode?_this.nodes.gain=_this.mix.context.createGainNode():_this.nodes.gain=_this.mix.context.createGain(),_this.nodes.lastnode.connect(_this.nodes.gain),_this.nodes.lastnode=_this.nodes.gain;else if("panner"===nodeType){if(window.AudioContext)_this.nodes.panner=_this.mix.context.createPanner();else{if(!window.webkitAudioContext)return _this;_this.nodes.panner=_this.mix.context.createPanner()}_this.nodes.lastnode.connect(_this.nodes.panner),_this.nodes.lastnode=_this.nodes.panner}else if("convolver"===nodeType){if(!_this.mix.context.createConvolver)return _this;_this.nodes.convolver=_this.mix.context.createConvolver()}else"compressor"===nodeType?(_this.nodes.compressor=_this.mix.context.createDynamicsCompressor(),_this.nodes.lastnode.connect(_this.nodes.compressor),_this.nodes.lastnode=_this.nodes.compressor):"delay"===nodeType&&(detect.nodes.delayNode?_this.nodes.delay=_this.mix.context.createDelayNode():_this.nodes.delay=_this.mix.context.createDelay(),_this.nodes.delay.delayTime=0,_this.nodes.lastnode.connect(_this.nodes.delay),_this.nodes.lastnode=_this.nodes.delay);return _this},Track.prototype.play=function(bufferSourceLoaded){var _this=this;if(!_this.status.loaded)return void debug.log(1,'Can’t play track "'+_this.name+'", not loaded');if(_this.status.playing!==!0)return _this.status.playing=!0,detect.webAudio?detect.webAudio&&"buffer"===_this.options.sourceMode?bufferSourceLoaded?playBufferSource(_this):(_this.status.playing=!1,_this.loadBufferSource(!0)):detect.webAudio&&"element"===_this.options.sourceMode&&playElementSource(_this):playSingleElement(_this),_this},Track.prototype.pause=function(at){if(this.status.ready&&this.status.playing){var _this=this;return"number"==typeof at?_this.options.cachedTime=at:_this.options.cachedTime=_this.currentTime(),_this.status.playing=!1,_this.onendtimer&&clearTimeout(_this.onendtimer),detect.webAudio===!0?"buffer"===_this.options.sourceMode?"function"==typeof _this.source.stop?_this.source.stop(0):"function"==typeof _this.source.noteOff&&_this.source.noteOff(0):"element"===_this.options.sourceMode&&_this.element.pause():_this.element.pause(),debug.log(2,'Pausing track "'+_this.name+'" at '+_this.options.cachedTime),_this.trigger("pause",_this),_this}},Track.prototype.stop=function(){if(this.status.ready&&this.status.playing){var _this=this;if(_this.status.playing)return _this.onendtimer&&clearTimeout(_this.onendtimer),_this.options.cachedTime=_this.options.startTime=0,detect.webAudio===!0&&"buffer"===_this.options.sourceMode?"function"==typeof _this.source.stop?_this.source.stop(0):"function"==typeof _this.source.noteOff&&_this.source.noteOff(0):(_this.options.autoplay=!1,_this.element.pause(),_this.element.currentTime=0),debug.log(2,'Stopping track "'+_this.name),_this.status.playing=!1,_this.trigger("stop",_this),_this.options.gain=_this.options.gainCache,_this}},Track.prototype.pan=function(angleDeg){if(detect.webAudio&&this.status.ready&&this.nodes.panner){if("string"==typeof angleDeg&&("front"===angleDeg?angleDeg=0:"back"===angleDeg?angleDeg=180:"left"===angleDeg?angleDeg=270:"right"===angleDeg&&(angleDeg=90)),"number"==typeof angleDeg){this.options.pan=angleDeg%360;var angleRad=.017453292519943295*(-angleDeg+90),x=this.options.panX=Math.cos(angleRad),y=this.options.panY=Math.sin(angleRad),z=this.options.panZ=-.5;return this.nodes.panner.setPosition(x,y,z),this.trigger("pan",this.options.pan,this),this}return this.options.pan}},Track.prototype.tweenPan=function(angleDeg,tweenDuration){var _this=this;return new Promise(function(resolve,reject){return detect.tween&&detect.webAudio&&_this.status.ready&&_this.nodes.panner||reject(Error("nope nope nope")),("number"!=typeof angleDeg||"number"!=typeof tweenDuration)&&reject(Error("Not a valid tween duration.")),debug.log(2,'"'+_this.name+'" tweening pan2d'),_this.tweens.pan&&_this.tweens.pan.stop(),_this.tweens.pan=new TWEEN.Tween({currentAngle:_this.options.pan}).to({currentAngle:angleDeg},tweenDuration).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function(){_this.pan(this.currentAngle)}).onComplete(function(){resolve(_this)}).start(),_this})},Track.prototype.gainCache=function(setTo){return"number"==typeof setTo?(this.options.gainCache=setTo,this):this.options.gainCache},Track.prototype.gain=function(val){return"number"==typeof val?(val=u.constrain(val,0,1),this.options.muted?(this.gainCache(val),this.options.gain=0):this.options.gain=val,this.status.playing&&(detect.webAudio?this.nodes&&this.nodes.gain&&(this.nodes.gain.gain.value=this.options.gain*this.mix.options.gain):this.element.volume=this.options.gain*this.mix.options.gain),debug.log(2,'"'+this.name+'" setting gain to '+this.options.gain),this.trigger("gain",this.options.gain,this),this):this.options.gain},Track.prototype.tweenGain=function(_val,_tweenDuration){var _this=this;return new Promise(function(resolve,reject){("number"!=typeof _val||"number"!=typeof _tweenDuration)&&reject(Error("Invalid value for duration.")),debug.log(2,'"'+_this.name+'" tweening gain '+_this.options.gain+" -> "+_val+" ("+_tweenDuration+"ms)"),_this.tweens.gain&&_this.tweens.gain.stop(),_this.tweens.gain=new TWEEN.Tween({currentGain:_this.options.gain}).to({currentGain:_val},_tweenDuration).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function(){_this.gain(this.currentGain)}).onComplete(function(){resolve(_this)}).start()})},Track.prototype.mute=function(){return this.gainCache(this.options.gain),this.gain(0),this.options.muted=!0,"element"===this.options.sourceMode&&(this.element.muted=!0),this},Track.prototype.unmute=function(){return this.options.muted=!1,"element"===this.options.sourceMode&&(this.element.muted=!1),this.gain(this.options.gainCache),this},Track.prototype.currentTime=function(setTo){return this.status.ready?"number"==typeof setTo?(debug.log(2,'setting track "'+this.name+'" to time',setTo),detect.webAudio&&"buffer"===this.options.sourceMode?this.status.playing?(this.pause(setTo),this.play()):this.options.cachedTime=setTo:this.element.currentTime=setTo,this):this.status.playing?detect.webAudio&&"buffer"===this.options.sourceMode?this.source.context.currentTime-this.options.startTime||0:this.element.currentTime||0:this.options.cachedTime||0:void 0},Track.prototype.formattedTime=function(includeDuration){return this.status.ready?includeDuration?timeFormat(this.currentTime())+"/"+timeFormat(this.duration()):timeFormat(this.currentTime()):void 0},Track.prototype.duration=function(){return this.status.ready?detect.webAudio&&"buffer"===this.options.sourceMode?this.source.buffer.duration||0:this.element.duration||0:void 0},module.exports=Track},{"./debug":2,"./detect":3,"./utils":7}],7:[function(require,module,exports){var u={};module.exports=u,u.extend=function(){for(var output={},args=arguments,l=args.length,i=0;l>i;i++)for(var key in args[i])args[i].hasOwnProperty(key)&&(output[key]=args[i][key]);return output},u.constrain=function(val,min,max){return min>val?min:val>max?max:val},u.timeFormat=function(seconds){var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60),s=Math.floor(seconds-60*m)<10?"0"+Math.floor(seconds-60*m):Math.floor(seconds-60*m);return m+":"+s},u.events={},u.events.on=function(type,callback){return this.events[type]=this.events[type]||[],this.events[type].push(callback),this},u.events.one=function(type,callback){var _this=this;return this.events[type]=this.events[type]||[],this.events[type].push(function(){_this.off(type),callback()}),this},u.events.off=function(type){return"*"===type?this.events={}:this.events[type]=[],this},u.events.trigger=function(type){if(this.events[type])for(var args=Array.prototype.slice.call(arguments,1),i=0,l=this.events[type].length;l>i;i++)"function"==typeof this.events[type][i]&&this.events[type][i].apply(this,args)}},{}]},{},[1]);