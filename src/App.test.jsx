import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { server } from "./mocks/server";

describe("App", () => {
  it("renders draw card button", () => {
    render(<App />);
    const drawCardButton = screen.getByTestId("draw_btn");
    expect(drawCardButton).toBeInTheDocument();
    expect(drawCardButton).toHaveTextContent(/draw card/i);
  });

  it("renders 52 cards remaining initially", () => {
    render(<App />);
    const remainingCards = screen.getByTestId("remaining_cards");
    expect(remainingCards).toBeInTheDocument();
    expect(remainingCards).toHaveTextContent(/52 cards remaining/i);
  });

  it("renders 51 cards remaining after drawing a card", async () => {
    render(<App />);
    const drawCardButton = screen.getByTestId("draw_btn");
    await userEvent.click(drawCardButton);
    const remainingCards = screen.getByTestId("remaining_cards");
    expect(remainingCards).toHaveTextContent(/51 cards remaining/i);
  });

  it("returns the response from the fetch request to draw a card", async () => {
    render(<App />);

    // Mock the response for the first draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "6H",
                image: "https://deckofcardsapi.com/static/img/6H.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/6H.svg",
                  png: "https://deckofcardsapi.com/static/img/6H.png",
                },
                value: "6",
                suit: "HEARTS",
              },
            ],
            remaining: 51,
          });
        }
      )
    );

    // first draw card request
    const drawCardButton = screen.getByTestId("draw_btn");
    await userEvent.click(drawCardButton);
    const remainingCards = await screen.findByTestId("remaining_cards");
    expect(remainingCards).toHaveTextContent(/51 cards remaining/i);
  });

  it("renders the first card image after one drawing and with no previous card, display a placeholder", async () => {
    render(<App />);
    const drawCardButton = screen.getByTestId("draw_btn");
    await userEvent.click(drawCardButton);
    const cardImage = screen.getByTestId("next_card_img");
    expect(cardImage).toBeInTheDocument();
    const previousImagePlaceholder = screen.getByTestId("previous_card");
    expect(previousImagePlaceholder.children.length).toBe(0);
  });

  it("renders the second card image next to the first card image after two drawings", async () => {
    render(<App />);
    const drawCardButton = screen.getByTestId("draw_btn");
    await userEvent.click(drawCardButton);
    await userEvent.click(drawCardButton);
    const cardImage = screen.getByTestId("previous_card_img");
    const cardImage2 = screen.getByTestId("next_card_img");
    expect(cardImage, cardImage2).toBeInTheDocument();
  });

  it("renders the snap value message when two consecutive cards have the same value", async () => {
    render(<App />);

    // Mock the response for the first draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "5H",
                image: "https://deckofcardsapi.com/static/img/5H.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/5H.svg",
                  png: "https://deckofcardsapi.com/static/img/5H.png",
                },
                value: "5",
                suit: "HEARTS",
              },
            ],
            remaining: 51,
          });
        }
      )
    );

    // first draw card request
    const drawCardButton = screen.getByTestId("draw_btn");
    await userEvent.click(drawCardButton);
    const remainingCards = await screen.findByTestId("remaining_cards");
    expect(remainingCards).toHaveTextContent(/51 cards remaining/i);

    // Mock the response for the second draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "5C",
                image: "https://deckofcardsapi.com/static/img/5C.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/5C.svg",
                  png: "https://deckofcardsapi.com/static/img/5C.png",
                },
                value: "5",
                suit: "CLUBS",
              },
            ],
            remaining: 50,
          });
        }
      )
    );

    // second draw card request
    await userEvent.click(drawCardButton);
    const remainingCards2 = await screen.findByTestId("remaining_cards");
    expect(remainingCards2).toHaveTextContent(/50 cards remaining/i);
    const snapValueMessage = await screen.findByTestId("matching_result");
    expect(snapValueMessage).toHaveTextContent(/^SNAP VALUE!$/);
  });

  it("renders the snap suit message when two consecutive cards have the same suit", async () => {
    render(<App />);

    // Mock the response for the first draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "5H",
                image: "https://deckofcardsapi.com/static/img/5H.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/5H.svg",
                  png: "https://deckofcardsapi.com/static/img/5H.png",
                },
                value: "5",
                suit: "HEARTS",
              },
            ],
            remaining: 51,
          });
        }
      )
    );

    // first draw card request
    const drawCardButton = screen.getByTestId("draw_btn");
    await userEvent.click(drawCardButton);
    const remainingCards = await screen.findByTestId("remaining_cards");
    expect(remainingCards).toHaveTextContent(/51 cards remaining/i);

    // Mock the response for the second draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "6H",
                image: "https://deckofcardsapi.com/static/img/6H.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/6H.svg",
                  png: "https://deckofcardsapi.com/static/img/6H.png",
                },
                value: "6",
                suit: "HEARTS",
              },
            ],
            remaining: 50,
          });
        }
      )
    );

    // second draw card request
    await userEvent.click(drawCardButton);
    const remainingCards2 = await screen.findByTestId("remaining_cards");
    expect(remainingCards2).toHaveTextContent(/50 cards remaining/i);
    const snapSuitMessage = await screen.findByTestId("matching_result");
    expect(snapSuitMessage).toHaveTextContent(/^SNAP SUIT!$/);
  });

  it("renders no message when two consecutive cards have neither same value nor same suit", async () => {
    render(<App />);

    // Mock the response for the first draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "5H",
                image: "https://deckofcardsapi.com/static/img/5H.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/5H.svg",
                  png: "https://deckofcardsapi.com/static/img/5H.png",
                },
                value: "5",
                suit: "HEARTS",
              },
            ],
            remaining: 51,
          });
        }
      )
    );

    // first draw card request
    const drawCardButton = screen.getByTestId("draw_btn");
    await userEvent.click(drawCardButton);
    const remainingCards = await screen.findByTestId("remaining_cards");
    expect(remainingCards).toHaveTextContent(/51 cards remaining/i);

    // Mock the response for the second draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "6C",
                image: "https://deckofcardsapi.com/static/img/6C.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/6C.svg",
                  png: "https://deckofcardsapi.com/static/img/6C.png",
                },
                value: "6",
                suit: "CLUBS",
              },
            ],
            remaining: 50,
          });
        }
      )
    );

    // second draw card request
    await userEvent.click(drawCardButton);
    const remainingCards2 = await screen.findByTestId("remaining_cards");
    expect(remainingCards2).toHaveTextContent(/50 cards remaining/i);
    const snapNoMessage = await screen.findByTestId("matching_result");
    expect(snapNoMessage.textContent).toEqual("");
    expect(snapNoMessage.children.length).toBe(0);
  });

  it("renders, after 52 drawings, 0 cards remaining, the draw card button no longer in the DOM and the matching final result displayed ", async () => {
    render(<App />);

    let remainingCardsCount = 52;

    // Mock the response for the draw card request
    server.use(
      http.get(
        "https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/",
        async () => {
          remainingCardsCount--;
          return HttpResponse.json({
            success: true,
            deck_id: "3p40paa87x90",
            cards: [
              {
                code: "5H",
                image: "https://deckofcardsapi.com/static/img/5H.png",
                images: {
                  svg: "https://deckofcardsapi.com/static/img/5H.svg",
                  png: "https://deckofcardsapi.com/static/img/5H.png",
                },
                value: "5",
                suit: "HEARTS",
              },
            ],
            remaining: remainingCardsCount,
          });
        }
      )
    );

    // draw card request 52 times
    const drawCardButton = screen.getByTestId("draw_btn");
    for (let i = 0; i < 52; i++) {
      await userEvent.click(drawCardButton);

      // Wait for the DOM to update after each click
      await waitFor(() =>
        expect(screen.getByTestId("remaining_cards")).toHaveTextContent(
          `${remainingCardsCount} cards remaining`
        )
      );
    }

    const remainingCards = await screen.findByTestId("remaining_cards");
    expect(remainingCards).toHaveTextContent(/0 cards remaining/i);
    expect(drawCardButton).not.toBeInTheDocument();
    const matchingFinalResult = await screen.findByTestId(
      "matching_final_result"
    );
    expect(matchingFinalResult).toBeInTheDocument();
    expect(matchingFinalResult.children.length).toBe(2);
  });
});
