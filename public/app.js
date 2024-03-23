document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;
    console.log("remove", id);
    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }

  if (event.target.dataset.type === "edit") {
    const newData = prompt("Введите новое название", [
      event.target.closest("li").childNodes[0].textContent.trim(),
    ]);

    const id = event.target.dataset.id;

    edit(id, newData).then(() => {
      event.target.closest("li").childNodes[0].textContent = newData;
    });
  }
});

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}
async function edit(id, newData) {
  console.log(newData);
  await fetch(`/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify({
      title: newData,
    }),
  });
}
