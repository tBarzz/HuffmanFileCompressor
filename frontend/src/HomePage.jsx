import { useState, useEffect } from "react";
import FileDropArea from "./components/FileDropArea";
import OperationsButtons from "./components/OperationsButtons"
import DownloadButton from "./components/DownloadButton";
import ProcessBarAnimation from "./components/ProcessBarAnimation";
import ErrorDisplay from "./components/ErrorDisplay";
import RHSAnimation from "./components/RHSAnimation";

function HomePage(){
    const [selectedFile, setSelectedFile] = useState(null);
    const [resFile, setResFile] = useState(null);
    const [resFileName, setResFileName] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [status, setStatus] = useState("idle");

    const [clustered, setClustered] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

        useEffect(() => {

            if(!isHovered) return;

            setClustered(prev => !prev);

            const interval = setInterval(() => {
            setClustered(prev => !prev);
            }, 1000);

            return () => clearInterval(interval);
        }, [isHovered]);

    return(
        <div className = "HomePage">

            <div className = "HomePageUI">
                <div className = "AppName">
                    <span className="H">H</span>uffman<br />
                    <span className="F">F</span>ile<br />
                    <span className="C">C</span>ompressor
                </div>

                <div className = "AppDescription">
                    Fast, simple and efficient file compression and decompression
                </div>

                <div className = "DropBox">
                    <FileDropArea
                        selectedFile = {selectedFile}
                        setSelectedFile = {setSelectedFile}
                    />
                </div>

                <div className = "OperationsUnit">
                    <OperationsButtons
                        selectedFile = {selectedFile}
                        setResFile = {setResFile}
                        setResFileName = {setResFileName}
                        setFileError = {setFileError}
                        setStatus = {setStatus}
                    />
                </div>

                {status === "processing" && (
                    <div className = "ProcessBar">
                        <ProcessBarAnimation />
                    </div>
                )}

                {status === "success" && (
                    <div className = "Download">
                        <DownloadButton
                            resFile = {resFile}
                            resFileName = {resFileName}
                        />
                    </div>
                )}

                {status === "failure" && (
                    <div className = "ErrorMessage">
                        <ErrorDisplay 
                            fileError = {fileError}
                        />
                    </div>
                )}

            </div>

            <RHSAnimation 
                clustered = {clustered}
            />

            <div className = "CoreAnimationSensor"
                onMouseEnter = {() => setIsHovered(true)}
                onMouseLeave = {() => setIsHovered(false)}>
            </div>


        </div>
    );
}

export default HomePage;