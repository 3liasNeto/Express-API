import { App } from "./app";
import { options } from "./data/connect";

new App().app.listen(3000, () => {
  console.log("Running Server");
  console.log(options);
});
