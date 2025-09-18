const form = document.querySelector('#img-form')
const img = document.querySelector('#img')
const outputPath = document.querySelector('#output-path')
const filename = document.querySelector('#filename')
const heightInput = document.querySelector('#height')
const widthInput = document.querySelector('#width')

function loadImage(e)
{
    const file = e.target.files[0]
    if(!isFileImg(file))
    {
        filename.innerText = "";
        form.style.display = 'none'
        outputPath.innerText = "";
        showToast("File ảnh không hợp lệ", "error")
        return
    }

    const image  = new Image()

    image.src = URL.createObjectURL(file);
    image.onload = function(){
        heightInput.value = this.height
        widthInput.value = this.width
    }

    filename.innerText = file.name;
    form.style.display = 'block'
    outputPath.innerText = path.join(os.homedir(),'result');
    showToast("Tải ảnh thành công!", "success")
}

function sendImage(e)
{
    e.preventDefault()
    const height = heightInput.value
    const width = widthInput.value
    const imgPath = webUtils.getFilePath(img.files[0]);

    if(!img.files[0])
    {
        showToast("Vui lòng chọn ảnh", error)
        return 
    }

    if(height === '')
    {
        showToast("Nhập chiều cao ảnh", error)
        return 
    }

    if(width === '')
    {
        showToast("Nhập chiều dài ảnh", error)
        return 
    }

    ipcRenderer.send('image:resize',
        {imgPath, width,height}
    )
}
ipcRenderer.on('image:done',() => {
    showToast("Xử lí ảnh thành công", 'success')
})

function isFileImg(file)
{
    const acceptedType = ['image/gif','image/png','image/jpeg']
    return file && acceptedType.includes(file['type']);
}

function showToast(message, status = "info") {
  let backgroundColor = "";

  switch (status) {
    case "success":
      backgroundColor = "linear-gradient(to right, #00b09b, #96c93d)"; 
      break;
    case "error":
      backgroundColor = "linear-gradient(to right, #e53935, #e35d5b)";
      break;
    case "warning":
      backgroundColor = "linear-gradient(to right, #fbc02d, #ffa000)"; 
      break;
    default:
      backgroundColor = "linear-gradient(to right, #2196F3, #21CBF3)";
  }

  Toastify.toast({
    text: message,
    duration: 2500,
    gravity: "bottom",   
    position: "right",   
    stopOnFocus: true,
    style: {
      background: backgroundColor,
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "14px",
      transition: "all 0.5s ease-in-out",
    },
    onClick: function(){}
  });
}

img.addEventListener('change', loadImage)
form.addEventListener('submit', sendImage)