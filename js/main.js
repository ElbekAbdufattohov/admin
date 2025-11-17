const btn = document.getElementById("toggle")
const bg = document.getElementById("bg")


btn.onclick = () => {
    bg.classList.toggle("bg-white");
    bg.classList.toggle("bg-gray-800");
    bg.classList.toggle("text-white");

    btn.textContent = bg.classList.contains("bg-gray-800") ? "☀️" : "🌙";
}
