/*

  Mock W3C Standard Audio Context
    (Edge, Chrome, FF)

    for use with Sinon

*/
import sinon from 'sinon'

class UnprefixedAudioContext {
  constructor(params){

    this.currentTime = (new Date()).getTime()
  }

  createGain(){}

  createBufferSource(){
    let bufferSource = {}
    bufferSource.start = sinon.spy()
    bufferSource.context = { currentTime: 0 }

    return bufferSource
  }

  decodeAudioData(audioData, callback){
    let decodedBuffer = { duration: 1 }
    callback(decodedBuffer)
  }
}

export default UnprefixedAudioContext