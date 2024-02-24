import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import copy from "copy-to-clipboard";
import { useState } from "react";

export default function Voice(){
    const [isCopied, setIsCopied] = useState(false);
    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const handleCopy = () => {
        copy(transcript);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
    };

    if (!browserSupportsSpeechRecognition) {
        return null
    }
    return (
        <>
            <div className="container">
                <h2>Speech to Text Converter</h2>
                <br/>
                <p>A React hook that converts speech from the microphone to text and makes it available to your React
                    components.</p>

                <div className="main-content" onClick={handleCopy}>
                    {transcript}
                </div>

                <div className="btn-style">
                    <button onClick={handleCopy}>
                        {isCopied ? 'Copied!' : 'Copy to clipboard'}
                    </button>
                    <button onClick={startListening}>Start Listening</button>
                    <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
                </div>
            </div>
        </>
    );
}