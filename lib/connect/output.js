'use strict';

var hexTypes = {
    noteOff: 0x8,
    noteOn: 0x9,
    noteAftertouch: 0xA,
    controller: 0xB,
    programChange: 0xC,
    channelAftertouch: 0xD,
    pitchBend: 0xE
};

/**
 * Output wrapper
 *
 * Add helper methods to ease working with
 * native MIDI outputs.
 *
 * @constructor
 * @param {MIDIOutput} native - Native MIDI output to wrap
 */
function Output(native) {
    this.native = native;
    
    this.id = native.id;
    this.manufacturer = native.manufacturer;
    this.name = native.name;
    this.version = native.version;
}

exports.Output = Output;

/**
 * Send a MIDI event to the output
 *
 * @param {EventChannel} event - MIDI event to send
 * @return {void}
 */
Output.prototype.send = function (event) {
    var subtype = event.subtype, data = [],
        lsb, msb, value;
    
    data.push(
        (hexTypes[subtype] << 4) +
            event.channel
    );
    
    switch (subtype) {
    case 'noteOn':
    case 'noteOff':
        data.push(event.note, event.velocity);
        break;
    case 'noteAftertouch':
        data.push(event.note, event.pressure);
        break;
    case 'controller':
        data.push(event.controller, event.value);
        break;
    case 'programChange':
        data.push(event.program);
        break;
    case 'channelAftertouch':
        data.push(event.pressure);
        break;
    case 'pitchBend':
        value = event.value + 8192;
        lsb = value & 127;
        msb = value >> 7;
        
        data.push(lsb, msb);
        break;
    }
    
    this.native.send(data, event.delay || 0);
};