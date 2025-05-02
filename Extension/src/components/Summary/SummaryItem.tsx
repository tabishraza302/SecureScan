interface SummaryItemType{
    title: string,
    count: number
}

function SummaryItem({title, count}: SummaryItemType) {
    return(
        <div>
            <span className="text-l">
                <span className=" text-muted">{title}: </span>{count}
            </span>
        </div>
    )
}


export default SummaryItem;