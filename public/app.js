document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      console.log(id);
      event.target.closest("li").remove();
    });
  }
  if (event.target.dataset.type === "edit") {
    const form = document.getElementById(event.target.dataset.id.toString());
    form.style.display = "block";
    const li = event.target.closest(".li-form");
    li.style.display = "none";
  }
  if (event.target.dataset.type === "cancel") {
    const form = document.getElementById(event.target.dataset.id.toString());
    form.style.display = "none ";
    const liForm = document.getElementById(
      `liForm${event.target.dataset.id.toString()}`
    );
    liForm.style.display = "block";
  }
});

document.addEventListener("submit", (event) => {
  if (
    event.target.tagName.toLowerCase() === "form" &&
    event.target.name === "edit"
  ) {
    event.preventDefault();
    const inputValue = event.target
      .querySelector('input[type="text"]')
      .value.trim();
    const id = event.target.dataset.id;

    edit(id, inputValue).then(() => {
      console.log(inputValue);
    });

    const form = document.getElementById(event.target.dataset.id.toString());
    form.style.display = "none";
    const liForm = document.getElementById(
      `liForm${event.target.dataset.id.toString()}`
    );
    liForm.querySelector("li").childNodes[0].textContent = inputValue;

    liForm.style.display = "block";
  }
});

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}
async function edit(id, newData) {
  await fetch(`/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify({
      title: newData,
    }),
  });
}
