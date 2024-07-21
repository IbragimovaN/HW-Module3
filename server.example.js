const server = http.createServer(async (request, response) => {
  if (request.method === "GET") {
    //если мы хотим получить HTML страницу
    const content = await fs.readFile(path.join(basePath, "index.html")); //то читаем.. путь. Тк возвращается промис, исп. async await
    // response.setHeader("Content-Type", "text/html"); //добавляем хедеры
    response.writeHead(200, { "Content-Type": "text/html" }); //считываем код успешно ли добавлен head
    response.end(content); //выводим на локал хост
  } else if (request.method === "POST") {
    const body = [];
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }); //чтобы браузер считывал верно

    request.on("data", (data) => {
      //"on" - это метод объекта "request", который используется для прослушивания определенного события. В данном случае, метод "on" прослушивает событие "data", которое возникает при получении данных от клиента.

      body.push(Buffer.from(data));
      //тк при получении каких-то данных они приходят порциями в виде буфера, доставем их из буфера и кладем в массив

      request.on("end", () => {
        //console.log(body.toString()); //получим в терминале title=some+input+text (title это name которое мы давали инпуту в верстке)
        const title = body.toString().split("=")[1].replaceAll("+", " "); //чтобы достать из title=some+input+text данные без + и =
        addNote(title);
      });
      //чтобы понять когда получение данных закончено, прослушиваем событие end т.е когда выполнится колбэк - получение данных закончено
    });
  }
});
