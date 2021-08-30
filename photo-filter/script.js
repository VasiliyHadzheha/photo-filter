const savePicture = document.querySelector(".btn-save");
const fileInput = document.querySelector('input[type="file"]');
const imageContainer = document.querySelector('.img-container');
const inputContainer = document.getElementById("input-container");
const btnReset = document.querySelector(".btn-reset");
const base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
const morning = 'morning/';
const day = 'day/';
const evening = 'evening/';
const night = 'night/';
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
const btn = document.querySelector('.btn-next');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

let i = 0;
let img = new Image();

savePicture.addEventListener('click', saveImage);
btn.addEventListener('click', getImage);
btnReset.addEventListener("click", reset);
inputContainer.addEventListener("input", event => inputChangeValue(event));
fileInput.addEventListener('change', onFileInputChange);

getImage();

function saveImage() {
  let link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
  };

function viewBgImage(src, filter) {
  img = new Image(); 
  img.src = src;
  img.setAttribute('crossOrigin', 'anonymous'); 
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
  };
}

function getImage() {
  fileInput.value = "";
  const filter = ctx.filter;
  if (i === 20) i = 0;
  const index = i % images.length;
  let hours = new Date().getHours();
  let imageSrc;
  if (hours >= 6 && hours < 12) {
    imageSrc = `${base}${morning}${images[index]}`;
  }
  else if (hours >= 12 && hours < 18) {
    imageSrc = `${base}${day}${images[index]}`;
  }
  else if (hours >= 18 && hours < 23) {
    imageSrc = `${base}${evening}${images[index]}`;
  }
  else {
    imageSrc = `${base}${night}${images[index]}`;
  }
  viewBgImage(imageSrc, filter);
  i++;
  btn.disabled = true;
  setTimeout(function() { btn.disabled = false }, 300);
} 

function onFileInputChange() {
  const filter = ctx.filter;
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
  }
  reader.readAsDataURL(file);
}

function inputChangeValue(event) {
  const input= event.target;
  const filterType = input.id.replace("input-", "");
  const measure = filterType === "blur" ? "px" : "%";
  const filters = ctx.filter !== "none" ? ctx.filter.split(" ") : "blur(0px) invert(0) sepia(0) saturate(100%)".split(" ");
  const currentFilterIndex = filters.findIndex((filter) => filter.includes(filterType));
  const outputId = input.id.replace("input", "output");
  const output = document.getElementById(outputId);

  filters[currentFilterIndex] = `${filterType}(${input.value}${measure})`;
  ctx.filter = filters.join(" ");
  if (event.needToReset) input.value = ((input.id === "input-saturate") || (input.id === "input-brightness") || (input.id === "input-opacity")) ? 100 : 0;
  if (input.id === "input-opacity") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = input.value / 100;
  }
  output.value = input.value;
  ctx.drawImage(img, 0, 0);
};

function reset () {
  const inputs = document.querySelectorAll("#input-container input");
  for (let i = 0; i < inputs.length; i++) {
    inputChangeValue({target: inputs[i], needToReset: true});
  }
  ctx.filter = "none";
  ctx.drawImage(img, 0, 0);
}
