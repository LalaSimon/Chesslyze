type OpeningNameType = {
  openingName: string
}

export const OpeningName = ({ openingName }: OpeningNameType) => {
  return (
    <section className="flex flex-col text-center">
      <span>Opening:</span> <span>{!openingName ? '-' : openingName}</span>
    </section>
  )
}
