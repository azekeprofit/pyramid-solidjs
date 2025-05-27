import { For, render } from "solid-js/web";

const board = [
    [1],
    [2, 3],
    [4, 5, 6],
    [7, 8, 9, 10]];

function App() {
    return <div class="block">
        <For each={board}>{
            (row, i) => <div class="text-zero text-center">
                <For each={row}>{(cell, j) =>
                    <div class='bg-[silver] w-s m-m h-h inline-block cursor-pointer mb-mb hex font-bold font-[Georgia] text-f'>
                        {cell}
                    </div>}</For>
            </div>
        }</For></div>;
}
render(() => <App />, document.body!);