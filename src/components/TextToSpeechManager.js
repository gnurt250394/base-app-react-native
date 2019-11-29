
import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    Slider,
    TextInput,
    Keyboard
} from "react-native";
import Tts from "react-native-tts";

class TextToSpeechManager {
    state = {
        voices: [],
        ttsStatus: "initiliazing",
        selectedVoice: null,
        speechRate: 0.5,
        speechPitch: 1,
        text: this.props.navigation.getParam('results')[0] || 'hihi'
    };

    constructor(props) {
        super(props);
        Tts.addEventListener("tts-start", event => {
            this.setState({ ttsStatus: "started" })
        }
        );
        Tts.addEventListener("tts-finish", event => {
            this.setState({ ttsStatus: "finished" })
        }
        );
        Tts.addEventListener("tts-cancel", event => {
            this.setState({ ttsStatus: "cancelled" })
        }
        );
        Tts.setDefaultRate(this.state.speechRate);
        Tts.setDefaultPitch(this.state.speechPitch);
        Tts.getInitStatus().then(this.initTts);
    }

    initTts = async () => {
        const voices = await Tts.voices();
        console.log('voices: ', voices);
        const availableVoices = voices
            .filter(v => !v.networkConnectionRequired && !v.notInstalled)
            .map(v => {
                return { id: v.id, name: v.name, language: v.language };
            });
        let selectedVoice = null;
        if (voices && voices.length > 0) {
            selectedVoice = voices[0].id;
            try {
                await Tts.setDefaultLanguage(voices[0].language);
            } catch (err) {
                // My Samsung S9 has always this error: "Language is not supported"
                console.log(`setDefaultLanguage error `, err);
            }
            await Tts.setDefaultVoice(voices[0].id);
            this.setState({
                voices: availableVoices,
                selectedVoice,
                ttsStatus: "initialized"
            });
        } else {
            this.setState({ ttsStatus: "initialized" });
        }
    };

    readText = async () => {
        Tts.stop();
        Tts.getInitStatus().then((ress) => {
            Tts.speak(this.state.text);
        });

    };

    setSpeechRate = async rate => {
        await Tts.setDefaultRate(rate);
        this.setState({ speechRate: rate });
    };

    setSpeechPitch = async rate => {
        await Tts.setDefaultPitch(rate);
        this.setState({ speechPitch: rate });
    };

    onVoicePress = async voice => {
        try {
            await Tts.setDefaultLanguage(voice.language);
        } catch (err) {
            // My Samsung S9 has always this error: "Language is not supported"
            console.log(`setDefaultLanguage error `, err);
        }
        await Tts.setDefaultVoice(voice.id);
        this.setState({ selectedVoice: voice.id });
    };


}
export default new TextToSpeechManager()