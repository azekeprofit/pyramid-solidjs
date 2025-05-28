import { useSelector } from '@xstate/store/solid';
import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";
import { For, render } from "solid-js/web";

const letters = `a
bc
def
ghij`;

const ops = ['+', '-', '*', '÷'] as const;

interface cell {
    letter: string;
    op: typeof ops[number];
    num: number;
}

function randomize() {
    return {
        rows: letters.split('\n').map(row => row.split('').map(letter => {
            const op = ops[Math.floor(Math.random() * 4)];
            const num = Math.floor(Math.random() * 21) + 1;
            return { letter, op, num };
        }))
    }
}

const board = createStoreWithProducer(produce, {
    context: randomize(),
    on: {
        randomize
    }
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
        <button onClick={()=>board.send({ type: 'randomize' })}>new board</button>
    </div>;
}
render(() => <App />, document.body!);