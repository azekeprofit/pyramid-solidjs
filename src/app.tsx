import { useSelector } from '@xstate/store/solid';
import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";
import { For, render } from "solid-js/web";

const pyramid = `a
bc
def
ghij`;

const ops = ['+', '-', '*', '÷'] as const;
type op = typeof ops[number];
interface cell {
    letter: string;
    op: op;
    num: number;
}

const allCombos: string[] = [];
for (let i = 0; i < 1000; i++) {
    const combination = i.toString().split('')
        .map(n => String.fromCharCode(n.charCodeAt(0) - '0'.charCodeAt(0) + 'a'.charCodeAt(0)))
        .join('').padStart(3, 'a');
    const set = new Set(combination);
    if (set.size !== 3) continue;
    allCombos.push(combination);
}

function randomize() {
    const letters: Record<string, cell> = {};
    const rows = pyramid.split('\n').map(row => row.split('').map(letter => {
        const op = ops[Math.floor(Math.random() * 4)];
        const num = Math.floor(Math.random() * 21) + 1;
        return letters[letter] = { letter, op, num };
    }));

    const combinations: Record<string, number> = {};
    const answers: Record<number, number> = {};
    const cheat: Record<number, string[]> = {};
    allCombos.forEach(c => {
        const result = calc(letters[c[0]], letters[c[1]], letters[c[2]]);
        if (Math.floor(result) === result) {
            combinations[c] = result;
            if (!answers[result]) answers[result] = 0;
            answers[result]++;

            if (!cheat[result]) cheat[result] = [];
            cheat[result].push(c);
        }
    });

    const sortedAnswers = Object.entries(answers).sort(([, a], [, b]) => a > b ? -1 : 1).slice(3, 10);

    // console.dir({sortedAnswers,cheat})

    return {
        rows,
        sortedAnswers,
        cheat,
    }
}



function calc2(op: op, a: number, b: number) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '÷':
            return a / b;
    }
}

function calc3(op1: op, op2: op, a: number, b: number, c: number) {
    if (['*', '÷'].includes(op2))
        return calc2(op1, a, calc2(op2, b, c))
    return calc2(op2, calc2(op1, a, b), c);
}

function calc(a: cell, b: cell, c: cell) {
    const firstNum = a.op == '-' ? -a.num : a.num;
    return calc3(b.op, c.op, firstNum, b.num, c.num);
}

const board = createStoreWithProducer(produce, {
    context: randomize(),
    on: { randomize }
});

function App() {
    const rows = useSelector(board, b => b.context.rows);
    return <div class="block">
        <For each={rows()}>{
            (row, i) => <div class="text-zero text-center capitalize">
                <For each={row}>{(cell, j) =>
                    <div class='bg-[silver] w-size m-margin h-height inline-block cursor-pointer mb-bottom hex font-bold font-[Georgia]'>
                        <div class='text-small h-3 bg-bg m-0.5'>{cell.letter}</div>
                        <div class="text-big">{cell.op}{cell.num}</div>
                    </div>}</For>
            </div>
        }</For>
        <button onClick={() => board.send({ type: 'randomize' })}>new board</button>
    </div>;
}
render(() => <App />, document.body!);