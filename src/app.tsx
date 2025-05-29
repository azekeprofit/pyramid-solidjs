import { useSelector } from '@xstate/store/solid';
import { For, render, Show } from "solid-js/web";
import { board } from './board';
import { Panel } from './panel';

function App() {
    const b = useSelector(board, b => b.context);
    return <div>
        <div class='flex'>
            <div class="">
                <For each={b().rows}>{
                    (row, i) => <div class="text-zero text-center capitalize">
                        <For each={row}>{(cell, j) =>
                            <div class='bg-[silver] w-size m-margin h-height inline-block cursor-pointer mb-bottom hex font-bold font-[Georgia]'>
                                <div class='text-small h-3 bg-bg m-0.5'>{cell.letter}</div>
                                <div class="text-big">{cell.op}{cell.num}</div>
                            </div>}</For>
                    </div>
                }</For>
            </div>
            <Panel title='TARGET' titleClass='bg-bg' cell={b().target} cellClass='m-3 bg-bg' />
        </div>
        <p>
            <Show when={['correct', 'incorrect'].includes(b().state)}>
                <Panel title='ANSWER' titleClass='bg-title text-white' cell={b().answer} cellClass='bg-cell' />
            </Show>
        </p>
        <div tabIndex={0} autofocus onkeypress={e => board.send({ type: 'enter', key: e.key })}></div>
        <p>{b().combo}</p>
        <p>{b().state}</p>
        <p>{b().found.join(' ')}</p>
        <p>{b().cheat.join(' ')}</p>
        <p>
            <button onClick={() => board.send({ type: 'randomize' })}>new board</button>
        </p>
    </div>;
}
render(() => <App />, document.body!);