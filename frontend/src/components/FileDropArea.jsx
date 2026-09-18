import { useRef } from "react";

function FileDropArea({selectedFile, setSelectedFile}){
    const fileInputRef = useRef(null);
    return(
        <div className = "fileDropArea">

            <input
                type = "file"
                ref = {fileInputRef}
                onChange={(event) => setSelectedFile(event.target.files[0])}
            />

            <button onClick={() => fileInputRef.current.click()}>
                UPLOAD
            </button>

            <div 
                className = "collectionBox"
                onDragOver = {(event) => event.preventDefault()}
                onDrop = {(event) => {
                    event.preventDefault();
                    setSelectedFile(event.dataTransfer.files[0]);
                }}>
                <p className = { selectedFile ? "selectedFile" : "placeHolder" }> 
                    { selectedFile ? selectedFile.name : "Drag and drop files here." } 
                </p>
            </div>
        </div>
    );
}

export default FileDropArea;