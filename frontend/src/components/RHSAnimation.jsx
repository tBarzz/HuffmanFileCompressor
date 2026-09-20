import { useEffect, useState } from "react";

function randomCoordinates(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) +min;
}
function clusteredCoordinates(center, radius, angle, axis){
    if(axis === 0)
        return center + radius * Math.cos(angle);
    return center + radius * Math.sin(angle);
}
function generatePositions(pointCount) {
    
    const centerX = 1600;
    const centerY = 400;
    return Array.from({length : pointCount}, () => {

        const angle = Math.random() * 2 * Math.PI
        const radius = randomCoordinates(75,100)

        return {
            scatteredX: randomCoordinates(20, window.innerWidth - 20),
            scatteredY: randomCoordinates(20, window.innerHeight - 20),

            clusteredX: clusteredCoordinates(centerX, radius, angle, 0),
            clusteredY: clusteredCoordinates(centerY, radius, angle, 1)
        }
    });
}
const pointCount = 500;
const positions = generatePositions(pointCount);

function RHSAnimation({clustered, setIsHovered}) {

    
    
    return(
        <div className = "RHSAnimation">
            {Array.from({length:pointCount},(_,i) => (
                <div 
                    className = "point" 
                    key = {i}
                    style = {{
                        left: clustered ? positions[i].clusteredX : positions[i].scatteredX,
                        top: clustered ? positions[i].clusteredY : positions[i].scatteredY
                    }}></div>
                    
            ))}

            <div className = "CoreAnimation">
                <div className="purpleCore"></div>
                <div className="greenCore"></div>
                <div className="orangeCore"></div>
            </div>
        </div>
    );
}

export default RHSAnimation;