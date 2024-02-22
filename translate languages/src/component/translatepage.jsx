import  { useState, useEffect } from 'react';
import {languages} from "../utils/languages.js";
import "../style/style.css"
import sun from "../assets/sun.png"
import moon from "../assets/sun.png"

function LanguageTranslator() {
    const [inputLanguage, setInputLanguage] = useState(languages[0]);
    const [outputLanguage, setOutputLanguage] = useState(languages[16]); // English
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        translate();
    }, [inputLanguage, outputLanguage, inputText]);

    const translate = () => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage.code}&tl=${outputLanguage.code}&dt=t&q=${encodeURIComponent(inputText)}`;
        fetch(url)
            .then(response => response.json())
            .then(json => {
                setOutputText(json[0].map(item => item[0]).join(""));
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleSwapLanguages = () => {
        setInputLanguage(outputLanguage);
        setOutputLanguage(inputLanguage);
        setInputText(outputText);
        setOutputText('');
    };

    const handleUploadDocument = (e) => {
        const file = e.target.files[0];
        if (
            file.type === "application/pdf" ||
            file.type === "text/plain" ||
            file.type === "application/msword" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (e) => {
                setInputText(e.target.result);
            };
        } else {
            alert("Please upload a valid file");
        }
    };

    const handleDownload = () => {
        if (outputText) {
            const blob = new Blob([outputText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.download = `translated-to-${outputLanguage.code}.txt`;
            a.href = url;
            a.click();
        }
    };

    return (
        <div className={`container ${darkMode ? 'dark' : ''}`}>
            <div className="mode">
                <label className="toggle" htmlFor="dark-mode-btn">
                    <div className="toggle-track">
                        <input type="checkbox" className="toggle-checkbox" id="dark-mode-btn" onChange={() => setDarkMode(!darkMode)} />
                        <span className="toggle-thumb"></span>
                        <img src={moon} alt="" />
                        <img src={sun} alt="" />
                    </div>
                </label>
            </div>

            <div className="card input-wrapper">
                <div className="from">
                    <span className="heading">From :</span>
                    <Dropdown options={languages} onSelect={setInputLanguage} />
                </div>
                <div className="text-area">
          <textarea
              id="input-text"
              cols="30"
              rows="10"
              placeholder="Enter your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
          ></textarea>
                    <div className="chars"><span id="input-chars">{inputText.length}</span> / 5000</div>
                </div>
                <div className="card-bottom">
                    <p>Or choose your document!</p>
                    <label htmlFor="upload-document">
                        <span id="upload-title">Choose File</span>
                        <ion-icon name="cloud-upload-outline"></ion-icon>
                        <input type="file" id="upload-document" hidden onChange={handleUploadDocument} />
                    </label>
                </div>
            </div>

            <div className="center">
                <div className="swap-position" onClick={handleSwapLanguages}>
                    <ion-icon name="swap-horizontal-outline"></ion-icon>
                </div>
            </div>

            <div className="card output-wrapper">
                <div className="to">
                    <span className="heading">To :</span>
                    <Dropdown options={languages} onSelect={setOutputLanguage} />
                </div>
                <textarea
                    id="output-text"
                    cols="30"
                    rows="10"
                    placeholder="Translated text will appear here"
                    value={outputText}
                    disabled
                ></textarea>
                <div className="card-bottom">
                    <p>Download as a document!</p>
                    <button id="download-btn" onClick={handleDownload}>
                        <span>Download</span>
                        <ion-icon name="cloud-download-outline"></ion-icon>
                    </button>
                </div>
            </div>
        </div>
    );
}

function Dropdown({ options, onSelect }) {
    const [isActive, setIsActive] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsActive(false);
    };

    return (
        <div className={`dropdown-container ${isActive ? 'active' : ''}`} onClick={() => setIsActive(!isActive)}>
            <div className="dropdown-toggle">
                <ion-icon name="globe-outline"></ion-icon>
                <span className="selected" data-value={selectedOption.code}>{selectedOption.name}</span>
                <ion-icon name="chevron-down-outline"></ion-icon>
            </div>
            <ul className="dropdown-menu">
                {options.map(option => (
                    <li key={option.code} className={`option ${option === selectedOption ? 'active' : ''}`} onClick={() => handleOptionClick(option)}>{option.name} ({option.native})</li>
                ))}
            </ul>
        </div>
    );
}

export default LanguageTranslator;
