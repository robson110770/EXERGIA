
import React, { useRef } from 'react';

interface ChartCardProps {
    title: string;
    caption?: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, caption, children }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        const defaultFileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        const fileName = window.prompt("Enter a filename for the PNG image:", defaultFileName);

        if (!fileName || !chartContainerRef.current) {
            return;
        }

        const svg = chartContainerRef.current.querySelector('svg');
        if (!svg) {
            console.error("Could not find SVG element to export.");
            alert("Error: Could not find chart element to export.");
            return;
        }

        try {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const svgSize = svg.getBoundingClientRect();

            // Increase resolution for better quality
            const scale = 2;
            canvas.width = svgSize.width * scale;
            canvas.height = svgSize.height * scale;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                 alert("Error: Could not create canvas context for export.");
                 return;
            }

            // Fill background based on current theme to avoid transparency issues
            ctx.fillStyle = getComputedStyle(chartContainerRef.current.parentElement || document.body).backgroundColor || 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, svgSize.width * scale, svgSize.height * scale);

                const pngFile = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
                link.href = pngFile;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            img.onerror = () => {
                alert("Error: Could not load chart image for export.");
            }
            // Use btoa for Base64 encoding, handling UTF-8 characters correctly.
            img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;

        } catch (error) {
            console.error("Chart export failed:", error);
            alert(`An error occurred during export: ${error instanceof Error ? error.message : String(error)}`);
        }
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg relative flex flex-col h-full">
            <button
                onClick={handleExport}
                className="absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-colors z-10"
                aria-label="Export chart as PNG"
                title="Export chart as PNG"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>
            <h3 className="text-md font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                {title}
            </h3>
            <div ref={chartContainerRef} className="flex-grow">
                {children}
            </div>
            {caption && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic leading-relaxed px-2">
                        {caption}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChartCard;
