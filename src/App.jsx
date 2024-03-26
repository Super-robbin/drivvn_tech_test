const App = () => {
  return (
    <>
      <div className="main_container">
        <div className="cards_container">
          <div data-testid="previous_card" className="previous_card">
            <img
              data-testid="previous_card_img"
              className="previous_card_img"
              alt="previous card"
            />
          </div>
          <div data-testid="next_card" className="next_card">
            <img
              data-testid="next_card_img"
              className="next_card_img"
              alt="next card"
            />
          </div>
        </div>
        <button data-testid="draw_btn" className="draw_btn">
          Draw card
        </button>
      </div>
    </>
  );
};

export default App;
