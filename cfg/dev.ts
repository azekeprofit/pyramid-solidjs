import { watch } from "fs";
import { bundle } from "./bundle";


function watcher() {
  watch("src", { recursive: true }, (event, filename) => {
    console.log(`Reloaded: ${filename}`);
    bundle(false);
  });
}

console.log('dev watch mode started')
bundle(false);
watcher();
