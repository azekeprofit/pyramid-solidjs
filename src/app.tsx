import { useSelector } from '@xstate/store/solid';
import { For, render, Show } from "solid-js/web";
import { board, type state } from './board';
import { Panel } from './panel';
import { Cell } from './cell';


function borderColor(state: state) {
    return { correct: 'border-cell', incorrect: 'border-red-600' }[state] ?? 'border-bg'
}


function bgColor(state: state) {
    return { correct: 'bg-cell', incorrect: 'bg-red-600' }[state] ?? 'bg-bg'
}



function App() {
    const b = useSelector(board, b => b.context);

    let input: HTMLDivElement = null!;

    return <>
        <p>Game "Pyramid" as played in Korean game show <a href="https://www.netflix.com/title/81653386">Devil's Plan</a>.</p>
        <p>Press letters or click on cells to start entering combinations. If equation made of 3 cells equals to target -- you win.</p>
        <div style='background-image:url("./steel.jpg")' class='w-150 font-[Georgia]'>
            <div class='flex'>
                <div class='w-40 text-bg font-bold m-10'>
                    <For each={b().found}>
                        {(row) => <div>{row.toUpperCase()}</div>}
                    </For>
                </div>
                <div class="">
                    <For each={b().rows}>{
                        (row, i) => <div class="text-zero text-center">
                            <For each={row}>{(cell, j) => <Cell tagClass='bg-bg' cell={cell} onClick={() => { board.send({ type: 'enter', key: cell.letter }); input.focus() }} />}</For>
                        </div>
                    }</For>
                </div>
                <Panel title='TARGET' titleClass='bg-bg' cell={b().target} cellClass='m-3 bg-bg' />
            </div>
            <div class='h-sizeborder flex m-5'>
                <Show when={['enter2nd', 'enter3rd', 'correct', 'incorrect', 'found'].includes(b().state)}>
                    <div class={`w-50 ml-40 mr-2 border-4 ${borderColor(b().state)}`}>
                        <For each={b().combo.split('')}>
                            {(char) => <Cell tagClass={bgColor(b().state)} cell={b().letters[char]} />}
                        </For>
                    </div>
                </Show>
                <Show when={['enter2nd', 'enter3rd', 'correct', 'incorrect', 'found'].includes(b().state)}>
                    <Panel title='ANSWER' titleClass={b().state == 'correct' ? `bg-title text-white` : `${bgColor(b().state)} text-black`} cell={b().answer} cellClass={b().state == 'correct' ? `bg-cell` : `bg-white`} />
                </Show>
                <Show when={b().state == 'exhausted'}>
                    <div class='w-100 m-2 text-center text-red-500 font-bold'>EXHAUSTED</div>
                </Show>
            </div>
            <div ref={input} tabIndex={0} autofocus onkeypress={e => board.send({ type: 'enter', key: e.key })}></div>

            <p>
                <button class='font-[Georgia]' onClick={() => { board.send({ type: 'randomize' }); input.focus() }}>RESET</button>
            </p>
        </div></>;
}
render(() => <App />, document.body!);