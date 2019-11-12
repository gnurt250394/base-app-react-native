import Voice from 'react-native-voice';

class VoiceManager {
    constructor() {
        Voice.onSpeechStart = this.onSpeechStart;
        Voice.onSpeechRecognized = this.onSpeechRecognized;
        Voice.onSpeechEnd = this.onSpeechEnd;
        Voice.onSpeechError = this.onSpeechError;
        Voice.onSpeechResults = this.onSpeechResults;
        Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    }
    onSpeechStart = e => {
        console.log('onSpeechStart: ', e);
        
    };

    onSpeechRecognized = e => {
        console.log('onSpeechRecognized: ', e);

    };

    onSpeechEnd = e => {
        console.log('onSpeechEnd: ', e);

    };

    onSpeechError = e => {
        return new Promise((resolve, rejects) => {
            try {
                resolve(e)
            } catch (error) {
                rejects(error)
            }
        })
    };

    onSpeechResults = e => {
        return new Promise((resolve, rejects) => {
            try {
                resolve(e)
            } catch (error) {
                rejects(error)
            }
        })
    };

    onSpeechPartialResults = e => {
        return new Promise((resolve, rejects) => {
            try {
                resolve(e)
            } catch (error) {
                rejects(error)
            }
        })
    };

    onSpeechVolumeChanged = e => {
        return new Promise((resolve, rejects) => {
            try {
                resolve(e)
            } catch (error) {
                rejects(error)
            }
        })



    };

    _startRecognizing = async () => {
        try {
            await Voice.start('vi-VN');
        } catch (e) {
            console.error(e);
        }
    };

    _stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    _cancelRecognizing = async () => {
        try {
            await Voice.cancel();
            // NavigationServices.navigate(screenName.TextToSpeech, {
            //     results: this.state.results
            // })
        } catch (e) {
            console.error(e);
        }
    };

    _destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }

    };

}

export default new VoiceManager();
