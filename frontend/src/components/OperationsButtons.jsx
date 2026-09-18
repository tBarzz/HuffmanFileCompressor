function OperationsButtons({selectedFile, setResFile, setResFileName, setFileError, setStatus}){

    async function handleCompress() {
        const formData = new FormData();

        formData.append("file", selectedFile);

        setResFile(null);
        setResFileName(null);
        setFileError(null);
        setStatus("processing");
        
        try {
            const response = await fetch("/compress", {
                method: "POST",
                body: formData
            });
            if(!response.ok){
                setFileError("Compression Failed.");
                setStatus("failure");
            }
            else{
                const blob = await response.blob();
                const contentDisposition = response.headers.get("Content-Disposition");
                const parts = contentDisposition.split("filename=");
                const fileName = parts[1].slice(1,-1);
                setResFile(blob);
                setResFileName(fileName);
                setStatus("success");
            }
        }
        catch{
            setFileError("Network Error.");
            setStatus("failure");
        }
    }

    async function handleDecompress() {
        const formData = new FormData();

        formData.append("file", selectedFile);

        setResFile(null);
        setResFileName(null);
        setFileError(null);
        setStatus("processing");
        
        try {
            const response = await fetch("/decompress", {
                method: "POST",
                body: formData
            });
            if(!response.ok){
                setFileError("Decompression Failed.");
                setStatus("failure");
            }
            else{
                const blob = await response.blob();
                const contentDisposition = response.headers.get("Content-Disposition");
                const parts = contentDisposition.split("filename=");
                const fileName = parts[1].slice(1,-1);
                setResFile(blob);
                setResFileName(fileName);
                setStatus("success");
            }
        }
        catch{
            setFileError("Network Error.");
            setStatus("failure");
        }
    }
    
    return(
        <div className = "operationsButtons">
            <button 
                className = "compressButton" 
                disabled = {!selectedFile} 
                onClick = {handleCompress}
            >
                COMPRESS
            </button>

            <button 
                className = "decompressButton" 
                disabled = {!selectedFile}
                onClick = {handleDecompress}
            >
                DECOMPRESS
            </button>
        </div>
    );
}

export default OperationsButtons;