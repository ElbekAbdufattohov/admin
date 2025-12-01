const btn = document.getElementById("toggle")
const bg = document.getElementById("bg")
const settings = document.getElementById("settings")
const students = document.getElementById("students")
let teachersCard = document.getElementById("tichers-card");
let form = document.getElementById("form");
let outerModal = document.getElementById("outer-modal");
let addTicher = document.getElementById("addTicher");
let pagination = document.getElementById("pagenishn");
let pageNumberEl = document.getElementById("page-number");
let sortName = document.getElementById("sort-name");

let search = document.getElementById("search");
let searchValue = "";
let sortNameValue = "";
let currentPage = 1;
let currentEditID = null;

const limit = 12;
const API = "https://692cc656e5f67cd80a492c59.mockapi.io/teachers";



btn.onclick = () => {
    bg.classList.toggle("bg-white");
    bg.classList.toggle("bg-gray-800");
    bg.classList.toggle("text-white");

    btn.textContent = bg.classList.contains("bg-gray-800") ? "☀️" : "🌙";
}




/* ------------ SEARCH EVENT ------------ */
search.addEventListener("input", function (e) {
    searchValue = e.target.value.trim().toLowerCase();
    currentPage = 1;
    getData();
});


/* ------------ SORT EVENT ------------ */
sortName.addEventListener("change", function (e) {
    sortNameValue = e.target.value;
    getData();
});


/* ------------ GET DATA ------------ */
async function getData() {
    try {
        teachersCard.innerHTML = "";

        let res = await axios.get(API);
        let data = res.data;

        if (searchValue) {
            data = data.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchValue) ||
                    item.profession.toLowerCase().includes(searchValue)
            );
        }

        if (sortNameValue === "asc") data.sort((a, b) => a.name.localeCompare(b.name));
        if (sortNameValue === "desc") data.sort((a, b) => b.name.localeCompare(a.name));

        let totalCount = data.length;
        let totalPages = Math.ceil(totalCount / limit);

        let start = (currentPage - 1) * limit;
        let end = start + limit;
        let pageData = data.slice(start, end);

        pageData.forEach((el) => {
            teachersCard.innerHTML += `
        <div class="border-1 border-gray-500 w-full max-w-[350px] rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg hover:scale-[1.03] duration-300">

        <a href="./singl.html?teacherId=${el.id}" class="w-[110px] h-[110px]">
            <img class="w-full h-full rounded-full object-cover border-3 border-gray-200  " src="${el.avatar}" alt="">
        </a>

        <h2 class=" text-xl font-semibold">${el.name}</h2>

        <span class="px-3 py-1 text-sm rounded-full bg-gray-300 ">
            ${el.profession}
        </span>

        <div class="flex gap-[10px]">
            <h1 class="">Age: ${el.age}</h1>
            <h1 class="">Exp: ${el.experience}</h1>
        </div>

        <h1 class="">⭐ ${el.rating}</h1>

        <div class="flex flex-col gap-2  text-sm ">
            <p class="flex items-center gap-[10px]"><img class="w-[15px] h-[15px]" src="../assets/image/phone.svg" alt=""> ${el.phone}</p>
            <p class="flex items-center gap-[10px]"><img class="w-[15px] h-[15px]" src="../assets/image/emili.svg" alt=""> ${el.email}</p>
            <p class="flex items-center gap-[10px]"><img class="w-[15px] h-[15px]" src="../assets/image/telegram.svg" alt=""> ${el.telegram}</p>
            <p class="flex items-center gap-[10px]"><img class="w-[15px] h-[15px]" src="../assets/image/in.png" alt=""> ${el.linkedin}</p>
        </div>

        <div class="flex gap-4 pt-3">
            <button onclick="editTeacher(${el.id})"
                class="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-700">
                Edit
            </button>
            <button onclick="deleteTeacher(${el.id})"
                class="bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700">
                Delete
            </button>
        </div>
        </div>
      `;
        });

        pageNumberEl.textContent = `${currentPage} / ${totalPages}`;
    } catch (err) {
        console.log(err);
    }
}


/* ------------ PAGINATION ------------ */
function nextPage() {
    currentPage++;
    getData();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getData();
    }
}


/* ------------ MODAL CLOSE ------------ */
outerModal.addEventListener("click", () => {
    outerModal.classList.add("hidden");
});

form.addEventListener("click", (e) => e.stopPropagation());


/* ------------ ADD NEW ------------ */
addTicher.addEventListener("click", () => {
    currentEditID = null;      // reset
    form.reset();
    outerModal.classList.remove("hidden");
});


/* ------------ SUBMIT (CREATE / EDIT) ------------ */
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let tObj = {
        name: form.name.value,
        avatar: form.avatar.value,
        profession: form.profession.value,
        age: form.age.value,
        experience: form.experience.value,
        rating: form.rating.value,
        phone: form.phone.value,
        email: form.email.value,
        telegram: form.telegram.value,
        linkedin: form.linkedIn.value
    };

    if (!currentEditID) {
        await axios.post(API, tObj);
    } else {
        await axios.put(`${API}/${currentEditID}`, tObj);
    }

    outerModal.classList.add("hidden");
    currentPage = 1;
    getData();
});


/* ------------ DELETE ------------ */
async function deleteTeacher(id) {
    await axios.delete(`${API}/${id}`);
    getData();
}


/* ------------ EDIT ------------ */
async function editTeacher(id) {
    const item = await axios.get(`${API}/${id}`);

    currentEditID = id;

    form.name.value = item.data.name;
    form.avatar.value = item.data.avatar;
    form.profession.value = item.data.profession;
    form.age.value = item.data.age;
    form.experience.value = item.data.experience;
    form.rating.value = item.data.rating;
    form.phone.value = item.data.phone;
    form.email.value = item.data.email;
    form.telegram.value = item.data.telegram;
    form.linkedIn.value = item.data.linkedin;

    outerModal.classList.remove("hidden");
}
