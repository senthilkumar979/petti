// Script to create favicon.ico from logo.png
// This creates a simple HTML page to generate favicon

const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");

const faviconHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Favicon Generator</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f0f0f0;
            text-align: center;
        }
        .favicon-item { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin: 20px auto;
            max-width: 400px;
        }
        .favicon-item img { 
            border: 1px solid #ddd; 
            border-radius: 4px;
            margin: 10px;
        }
        .download-btn {
            background: #2196f3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px;
            font-size: 16px;
        }
        .download-btn:hover {
            background: #1976d2;
        }
        .instructions {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>🎨 Favicon Generator</h1>
    
    <div class="instructions">
        <h3>📋 Instructions:</h3>
        <ol>
            <li>Right-click on the favicon below</li>
            <li>Select "Save image as..."</li>
            <li>Save as <code>favicon.ico</code> in the <code>public/</code> directory</li>
            <li>This will be the icon shown in browser tabs</li>
        </ol>
    </div>

    <div class="favicon-item">
        <h3>Favicon (32x32)</h3>
        <img id="favicon-32" width="32" height="32" style="background: white;">
        <br>
        <button class="download-btn" onclick="downloadFavicon()">
            Download favicon.ico
        </button>
    </div>

    <div class="favicon-item">
        <h3>Apple Touch Icon (180x180)</h3>
        <img id="apple-touch" width="180" height="180" style="background: white;">
        <br>
        <button class="download-btn" onclick="downloadAppleTouch()">
            Download apple-touch-icon.png
        </button>
    </div>

    <script>
        // Load the logo
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = function() {
            // Generate 32x32 favicon
            const faviconCanvas = document.createElement('canvas');
            const faviconCtx = faviconCanvas.getContext('2d');
            faviconCanvas.width = 32;
            faviconCanvas.height = 32;
            faviconCtx.drawImage(logo, 0, 0, 32, 32);
            
            const faviconImg = document.getElementById('favicon-32');
            faviconImg.src = faviconCanvas.toDataURL('image/png');
            
            // Generate 180x180 Apple touch icon
            const appleCanvas = document.createElement('canvas');
            const appleCtx = appleCanvas.getContext('2d');
            appleCanvas.width = 180;
            appleCanvas.height = 180;
            appleCtx.drawImage(logo, 0, 0, 180, 180);
            
            const appleImg = document.getElementById('apple-touch');
            appleImg.src = appleCanvas.toDataURL('image/png');
        };
        logo.src = './logo.png';
        
        function downloadFavicon() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 32;
            canvas.height = 32;
            ctx.drawImage(logo, 0, 0, 32, 32);
            
            const link = document.createElement('a');
            link.download = 'favicon.ico';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        function downloadAppleTouch() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 180;
            canvas.height = 180;
            ctx.drawImage(logo, 0, 0, 180, 180);
            
            const link = document.createElement('a');
            link.download = 'apple-touch-icon.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    </script>
</body>
</html>
`;

// Write the favicon generator HTML
const faviconPath = path.join(publicDir, "favicon-generator.html");
fs.writeFileSync(faviconPath, faviconHTML);

console.log("✅ Generated favicon-generator.html");
console.log(
  "🌐 Open http://localhost:3003/favicon-generator.html in your browser"
);
console.log("📥 Download favicon.ico and apple-touch-icon.png");
console.log("💡 Save them in the public/ directory");
