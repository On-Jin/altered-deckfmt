
import deckfmt from "../dist/altered-deckfmt.umd.cjs";
import fs from "fs";

export default async function fromJson(path) {
  
  let json;
  try {
    json = JSON.parse(fs.readFileSync(path, "utf8"))
  } catch (e) {
    console.error(`Failed to parse JSON file (${path}): ${e.message}`)
    process.exit(1)
  }
  
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
  console.log(encoded);
  process.exit(0);
}
