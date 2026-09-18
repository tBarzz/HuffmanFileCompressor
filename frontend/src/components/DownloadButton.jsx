import { useRef } from "react";

function DownloadButton({resFile, resFileName}){

    const fileDisplayRef = useRef(null);

    function handleDownload(){
        const url = URL.createObjectURL(resFile);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = resFileName;

        link.click();
        URL.revokeObjectURL(url);
    }
    return(
        <div className = "DownloadParent">
            <div 
                className = "DownloadFileDisplay"
                ref = {fileDisplayRef}
                onWheel={(event) => {
                    fileDisplayRef.current.scrollLeft += event.deltaY;
                }}
            >
                {resFileName}
            </div>
            <button 
                className = "DownloadButton"
                onClick = {handleDownload}
            >
                DOWNLOAD
            </button>
        </div>
    );
}

export default DownloadButton;