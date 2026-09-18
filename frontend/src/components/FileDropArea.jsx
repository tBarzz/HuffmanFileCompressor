import { useRef } from "react";
import { useState } from "react";

function FileDropArea(){
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
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