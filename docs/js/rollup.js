// 导入打包产物
import { Evaluator } from "rollup-web";
// import { Evaluator } from "../rollup-web/dist/index.js";

const Eval = new Evaluator();
await Eval.useWorker("./js/bundle_worker.js");
await Eval.createEnv();
console.time();
await Eval.evaluate("./src/main.ts");
console.timeEnd();
