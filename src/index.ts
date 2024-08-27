import { App } from "./app";
import { options } from "./data/connect";
import { seed } from "./data/seed";

new App().app.listen(3000, () => {
  console.log("Running Server");
});

// console.log("Books: ",seed.book);
// console.log("Avaible Books: ",seed.seedBooks);