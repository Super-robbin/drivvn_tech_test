import { useEffect, useState } from "react";

const App = () => {
  const [deckInfo, setDeckInfo] = useState({
    deck_id: "",
    remainingCards: 52,
  });
  const [drawnCards, setDrawnCards] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const deck = await response.json();
    setDeckInfo({ ...deckInfo, deck_id: deck.deck_id });
  };

  const drawCard = async () => {
    try {
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckInfo.deck_id}/draw/?count=1`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const drawnCard = await response.json();
      console.log(drawnCard);
      setDrawnCards([...drawnCards, drawnCard.cards[0]]);
      setDeckInfo((prevInfo) => ({
        ...prevInfo,
        remainingCards: drawnCard.remaining,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const snapValue =
    drawnCards[drawnCards.length - 2]?.value ===
      drawnCards[drawnCards.length - 1]?.value && "SNAP VALUE!";
  const snapSuit =
    drawnCards[drawnCards.length - 2]?.suit ===
      drawnCards[drawnCards.length - 1]?.suit && "SNAP SUIT!";

  let valueMatches = 0;
  let suitMatches = 0;

  for (let i = 1; i < drawnCards.length; i++) {
    if (drawnCards[i - 1]?.value === drawnCards[i]?.value) {
      valueMatches++;
    }
  }

  for (let i = 1; i < drawnCards.length; i++) {
    if (drawnCards[i - 1]?.suit === drawnCards[i]?.suit) {
      suitMatches++;
    }
  }

  return (
    <>
      <div className="main_container" id="main_container">
        <div className="stats_container">
          <p
            data-testid="remaining_cards"
            className="remaining_cards"
          >{`${deckInfo.remainingCards} cards remaining`}</p>
          <p data-testid="matching_result" className="matching_result">
            {drawnCards.length > 0 && (snapValue || snapSuit)}
          </p>
        </div>
        <div className="cards_container">
          <div data-testid="previous_card" className="previous_card">
            {drawnCards.length > 1 && (
              <img
                data-testid="previous_card_img"
                className="previous_card_img"
                src={drawnCards[drawnCards.length - 2].image}
                alt="previous card"
              />
            )}
          </div>
          <div data-testid="next_card" className="next_card">
            {drawnCards.length > 0 && (
              <img
                data-testid="next_card_img"
                className="next_card_img"
                src={drawnCards[drawnCards.length - 1].image}
                alt="next card"
              />
            )}
          </div>
        </div>
        {deckInfo.remainingCards !== 0 ? (
          <button
            data-testid="draw_btn"
            className="draw_btn"
            onClick={drawCard}
          >
            Draw card
          </button>
        ) : (
          <div
            data-testid="matching_final_result"
            className="matching_final_result"
          >
            <p>VALUE MATCHES: {valueMatches}</p>
            <p>SUIT MATCHES: {suitMatches}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
