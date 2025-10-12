// Script to generate PWA icons from logo.png
// This script will create properly sized icons for PWA

const fs = require("fs");
const path = require("path");

// Icon sizes needed for PWA
const iconSizes = [
  { size: 72, name: "icon-72.png" },
  { size: 96, name: "icon-96.png" },
  { size: 128, name: "icon-128.png" },
  { size: 144, name: "icon-144.png" },
  { size: 152, name: "icon-152.png" },
  { size: 180, name: "icon-180.png" },
  { size: 192, name: "icon-192.png" },
  { size: 384, name: "icon-384.png" },
  { size: 512, name: "icon-512.png" },
];

// Apple touch icon sizes
const appleIconSizes = [
  { size: 120, name: "apple-touch-icon-120x120.png" },
  { size: 152, name: "apple-touch-icon-152x152.png" },
  { size: 180, name: "apple-touch-icon-180x180.png" },
];

const publicDir = path.join(__dirname, "..", "public");
const logoPath = path.join(publicDir, "logo.png");

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error("❌ logo.png not found in public directory");
  process.exit(1);
}

console.log("🎨 Generating PWA icons from logo.png...");
console.log("📁 Source logo:", logoPath);

// Create a simple HTML file that can be used to generate icons
// This is a workaround since we can't directly resize images in Node.js without additional libraries
const generateIconHTML = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>PWA Icon Generator</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            background: #f0f0f0;
        }
        .icon-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-top: 20px;
        }
        .icon-item { 
            text-align: center; 
            background: white; 
            padding: 15px; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .icon-item img { 
            border: 1px solid #ddd; 
            border-radius: 4px;
        }
        .instructions {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .download-btn {
            background: #2196f3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        .download-btn:hover {
            background: #1976d2;
        }
    </style>
</head>
<body>
    <h1>🎨 PWA Icon Generator</h1>
    
    <div class="instructions">
        <h3>📋 Instructions:</h3>
        <ol>
            <li>Right-click on each icon below</li>
            <li>Select "Save image as..."</li>
            <li>Save with the filename shown below each icon</li>
            <li>Place all saved icons in the <code>public/</code> directory</li>
        </ol>
    </div>

    <div class="icon-grid">
        ${iconSizes
          .map(
            (icon) => `
            <div class="icon-item">
                <h4>${icon.name}</h4>
                <img id="icon-${icon.size}" width="${icon.size}" height="${icon.size}" style="background: white;">
                <br>
                <button class="download-btn" onclick="downloadIcon(${icon.size}, '${icon.name}')">
                    Download ${icon.name}
                </button>
            </div>
        `
          )
          .join("")}
        
        ${appleIconSizes
          .map(
            (icon) => `
            <div class="icon-item">
                <h4>${icon.name}</h4>
                <img id="apple-icon-${icon.size}" width="${icon.size}" height="${icon.size}" style="background: white;">
                <br>
                <button class="download-btn" onclick="downloadAppleIcon(${icon.size}, '${icon.name}')">
                    Download ${icon.name}
                </button>
            </div>
        `
          )
          .join("")}
    </div>

    <script>
        // Load the logo
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = function() {
            // Generate all icons
            iconSizes.forEach(icon => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = icon.size;
                canvas.height = icon.size;
                
                // Draw logo scaled to icon size
                ctx.drawImage(logo, 0, 0, icon.size, icon.size);
                
                // Convert to data URL and set as image source
                const img = document.getElementById(\`icon-\${icon.size}\`);
                img.src = canvas.toDataURL('image/png');
            });
            
            // Generate Apple touch icons
            appleIconSizes.forEach(icon => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = icon.size;
                canvas.height = icon.size;
                
                // Draw logo scaled to icon size
                ctx.drawImage(logo, 0, 0, icon.size, icon.size);
                
                // Convert to data URL and set as image source
                const img = document.getElementById(\`apple-icon-\${icon.size}\`);
                img.src = canvas.toDataURL('image/png');
            });
        };
        logo.src = './logo.png';
        
        function downloadIcon(size, filename) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(logo, 0, 0, size, size);
            
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        function downloadAppleIcon(size, filename) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(logo, 0, 0, size, size);
            
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    </script>
</body>
</html>
`;

  return html;
};

// Generate the HTML file
const htmlContent = generateIconHTML();
const htmlPath = path.join(publicDir, "icon-generator.html");
fs.writeFileSync(htmlPath, htmlContent);

console.log("✅ Generated icon-generator.html");
console.log(
  "🌐 Open http://localhost:3003/icon-generator.html in your browser"
);
console.log(
  "📥 Download all the generated icons and save them to the public/ directory"
);
console.log("🔄 Then run: npm run update-manifest");

// Also create a simple script to copy logo.png as favicon
const faviconPath = path.join(publicDir, "favicon.ico");
if (!fs.existsSync(faviconPath)) {
  console.log(
    "📝 Note: You may want to convert logo.png to favicon.ico for the browser tab icon"
  );
}

console.log("\n🎯 Next steps:");
console.log("1. Open http://localhost:3003/icon-generator.html");
console.log("2. Download all the generated icons");
console.log("3. Save them in the public/ directory");
console.log("4. Run: npm run update-manifest");
