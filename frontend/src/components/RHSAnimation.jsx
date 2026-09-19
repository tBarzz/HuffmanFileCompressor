import { useEffect, useState } from "react";

function randomCoordinates(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) +min;
}
function generatePositions(pointCount) {
    return Array.from({length : pointCount}, () => ({
        scatteredX: randomCoordinates(20, 380),
        scatteredY: randomCoordinates(20, 380),

        clusteredX: randomCoordinates(150, 250),
        clusteredY: randomCoordinates(150, 250)
    }));
}
const pointCount = 200;
const positions = generatePositions(pointCount);

function RHSAnimation() {

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
        <div className = "RHSAnimation"
            onMouseEnter={ () => setIsHovered(true) }
            onMouseLeave={ () => setIsHovered(false) }
        >
            {Array.from({length:pointCount},(_,i) => (
                <div 
                    className = "point" 
                    key = {i}
                    style = {{
                        left: clustered ? positions[i].clusteredX : positions[i].scatteredX,
                        top: clustered ? positions[i].clusteredY : positions[i].scatteredY
                    }}></div>
                    
            ))}
        </div>
    );
}

export default RHSAnimation;