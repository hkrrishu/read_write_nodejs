const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (req.url === "/") {
    // form
    res.setHeader("Content-Type", "text/html");
    res.end(`
    <form action="/message" method="POST">
        <label>Name:</label>
        <input type="text" name="username">
        <button type="submit">Add</button>
    </form>
    `);
  }else if (url === '/message') {

        // Response after clicking Add
        res.setHeader("Content-Type", "text/html");

        let body = [];
        req.on("data",(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        })
        req.on("end",()=>{
            let buffer = Buffer.concat(body);

            console.log(buffer);
            let formData = buffer.toString();
            console.log(formData);

            let formValues = formData.split("=")[1];
            console.log(formValues);

            fs.writeFile('formValues.txt', formValues,(err)=>{
                res.statusCode = 302; //redirected
                res.setHeader('Location','/');
                res.end();
            });
        });
    }
    else {
        if(req.url === "/read"){
            //read from file
            fs.readFile('formValues.txt', (err, data)=>{
                console.log(data.toString());
                res.end(`
                    <h1>${data.toString()}</h1>
                `);
            })

        }
    }

});

server.listen(3000, () => {
  console.log("Server is running");
});
