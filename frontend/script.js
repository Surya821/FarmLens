const form = document.getElementById("upload-form");
const resultDiv = document.getElementById("result");
const previewImg = document.getElementById("preview-img");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultDiv.innerHTML = "Predicting...";

    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if(!file){
        resultDiv.innerHTML = "Please select an image!";
        return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function(e){
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
    }
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/predict", {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        if(data.error){
            resultDiv.innerHTML = "Error: " + data.error;
        } else {
            resultDiv.innerHTML = `📷 ${data.filename} → 🐄 Predicted: ${data.predicted_class}`;
        }
    } catch (err) {
        resultDiv.innerHTML = "Error: " + err;
    }
});
