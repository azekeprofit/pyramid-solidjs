import { cell } from "./board";

export function Cell(props: { cell: cell, tagClass: string, onClick?: () => void }) {
    return <div
        onClick={props.onClick}
        class='bg-[silver] w-size m-margin h-height inline-block cursor-pointer mb-bottom hex font-bold text-center capitalize'>
        <div class={`text-small h-3 m-0.5 ${props.tagClass}`}>{props.cell.letter}</div>
        <div class="text-big">{props.cell.op}{props.cell.num}</div>
    </div>
}