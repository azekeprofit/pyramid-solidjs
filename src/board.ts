import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

const pyramid = `a
bc
def
ghij`;

const ops = ["+", "-", "*", "÷"] as const;
type op = (typeof ops)[number];
interface cell {
  letter: string;
  op: op;
  num: number;
}

const allCombos: string[] = [];
for (let i = 0; i < 1000; i++) {
  const combination = i
    .toString()
    .split("")
    .map((n) =>
      String.fromCharCode(
        n.charCodeAt(0) - "0".charCodeAt(0) + "a".charCodeAt(0)
      )
    )
    .join("")
    .padStart(3, "a");
  const set = new Set(combination);
  if (set.size !== 3) continue;
  allCombos.push(combination);
}

type state =
  | "enter1st"
  | "enter2nd"
  | "enter3rd"
  | "incorrect"
  | "correct"
  | "found"
  | "exhausted";

function randomize() {
  const letters: Record<string, cell> = {};
  const rows = pyramid.split("\n").map((row) =>
    row.split("").map((letter) => {
      const op = ops[Math.floor(Math.random() * 4)];
      const num = Math.floor(Math.random() * 21) + 1;
      return (letters[letter] = { letter, op, num });
    })
  );

  const combinations: Record<string, number> = {};
  const answers: Record<number, number> = {};
  const cheat: Record<number, string[]> = {};
  allCombos.forEach((c) => {
    const result = calc(letters[c[0]], letters[c[1]], letters[c[2]]);
    if (Math.floor(result) === result && result !== 0) {
      combinations[c] = result;
      if (!answers[result]) answers[result] = 0;
      answers[result]++;

      if (!cheat[result]) cheat[result] = [];
      cheat[result].push(c);
    }
  });

  const sortedAnswers = Object.entries(answers)
    .sort(([, a], [, b]) => (a > b ? -1 : 1))
    .slice(3, 10)
    .sort(([a], [b]) =>
      Math.abs(parseInt(a)) > Math.abs(parseInt(b)) ? 1 : -1
    );

  const target = sortedAnswers[0][0];

  // console.dir({ sortedAnswers, cheat, target })
  return {
    rows,
    letters,
    target,
    cheat: cheat[target],
    combo: ``,
    answer: ``,
    found: [] as string[],
    state: "enter1st" as state,
  };
}

function calc2(op: op, a: number, b: number) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "÷":
      return a / b;
  }
}

function calc3(op1: op, op2: op, a: number, b: number, c: number) {
  if (["*", "÷"].includes(op2)) return calc2(op1, a, calc2(op2, b, c));
  return calc2(op2, calc2(op1, a, b), c);
}

function calc(a: cell, b: cell, c: cell) {
  const firstNum = a.op == "-" ? -a.num : a.num;
  return calc3(b.op, c.op, firstNum, b.num, c.num);
}

export const board = createStoreWithProducer(produce, {
  context: randomize(),
  on: {
    randomize,
    checkForExhaustion: (context) => {
      if (context.found.length === context.cheat.length)
        context.state = "exhausted";
      else {
        context.answer = context.combo = "";
        context.state = "enter1st";
      }
    },
    enter: (context, event: { key: string }, enqueue) => {
      if (!Object.keys(context.letters).includes(event.key)) return;
      switch (context.state) {
        case "enter1st":
          context.combo += event.key;
          context.state = "enter2nd";
          break;
        case "enter2nd":
          context.combo += event.key;
          context.state = "enter3rd";
          break;
        case "enter3rd":
          context.combo += event.key;
          context.answer = calc(
            context.letters[context.combo[0]],
            context.letters[context.combo[1]],
            context.letters[context.combo[2]]
          ).toString();
          if (context.cheat.includes(context.combo)) {
            if (context.found.includes(context.combo)) context.state = "found";
            else {
              context.state = "correct";
              context.found.push(context.combo);
            }
          } else {
            context.state = "incorrect";
          }
          enqueue.effect(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            board.send({ type: "checkForExhaustion" });
          });
      }
    },
  },
});
