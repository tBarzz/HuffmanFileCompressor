import { useState } from "react";
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
    return(
        <div className = "HomePage">

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

            <div className = "DataAnimation">
                <RHSAnimation />
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
    );
}

export default HomePage;