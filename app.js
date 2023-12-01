const express = require ('express');
const app =  express();

const port = process.env.PORT || 5001;

app.use("/api/users", require("./src/routes/UserRoutes"));

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });