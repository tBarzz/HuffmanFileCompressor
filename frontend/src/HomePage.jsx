import { useState } from "react";
import FileDropArea from "./components/FileDropArea";
import OperationsButtons from "./components/OperationsButtons"

function HomePage(){
    const [selectedFile, setSelectedFile] = useState(null);
    const [resFile, setResFile] = useState(null);
    const [resFileName, setResFileName] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [status, setStatus] = useState("idle");
    return(
        <div className = "HomePage">

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
                    PROCESS BAR
                </div>
            )}

            {status === "success" && (
                <div className = "DownloadButton">
                    DOWNLOAD
                </div>
            )}

            {status === "failure" && (
                <div className = "ErrorMessage">
                    ERROR MESSAGE
                </div>
            )}
        </div>
    );
}

export default HomePage;