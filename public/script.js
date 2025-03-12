document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('status');
    const downloadLink = document.getElementById('downloadLink');
    const file = fileInput.files[0];
  
    statusDiv.textContent = 'Processing...';
    downloadLink.style.display = 'none';
  
    if (file.type === 'image/png') {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('http://localhost:3000/remove-watermark', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
  
        if (data.error) throw new Error(data.error);
  
        statusDiv.textContent = 'Watermark removed successfully!';
        downloadLink.href = data.outputPath;
        downloadLink.download = 'cleaned_image.png';
        downloadLink.style.display = 'block';
      } catch (error) {
        statusDiv.textContent = `Error: ${error.message}`;
      }
    } else {
      statusDiv.textContent = 'Bitte lade ein PNG hoch.';
    }
  });