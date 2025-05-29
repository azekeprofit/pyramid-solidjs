export function Panel(props: { title: string, cell: string, titleClass: string, cellClass: string }) {
    return <div class={`text-center size-size ${props.cellClass}`}>
        <div class={`border-b-2 border-b-black text-small ${props.titleClass}`}>⋅{props.title}⋅</div>
        <div class={`text-big font-bold m-1`}>
            {props.cell}
        </div>
    </div>
}