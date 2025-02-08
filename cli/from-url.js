
import deckfmt from "../dist/altered-deckfmt.umd.cjs";

export default async function fromUrl(url) {
  // console.log("fromUrl:", url)

  const deckId = url.match(/decks\/([A-Z0-9]+)/)?.[1]
  if (!deckId) {
    console.error("Invalid deck URL, could not extract deck ID")
    process.exit(1)
  }

  const response = await fetch(`https://api.altered.gg/deck_user_lists/${deckId}`)
  const json = await response.json()
  // console.log(json)

  const hero = json.alterator.reference
  const cards = Object.values(json.deckCardsByType)
    .reduce((acc, val) => {
      if (typeof val === "object" && val.deckUserListCard) {
        return val.deckUserListCard.reduce((acc2, card) => {
          acc2[card.card.reference] = card.quantity
          return acc2
        }, acc)
      } else {
        return acc  
      }
    }, { [hero]: 1 });

  // console.dir(cards, { depth: null })
  const text = Object.entries(cards)
    .map(([card, qty]) => `${qty} ${card}`)
    .join("\n")
  const encoded = deckfmt.encodeList(text);
  console.log(encoded)
}
