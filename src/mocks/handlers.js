import { http, HttpResponse } from 'msw';

// Describe the network
export const handlers = [
  http.get('https://deckofcardsapi.com/api/deck/new/shuffle/', async () => {
    return HttpResponse.json({
      success: true,
      deck_id: '3p40paa87x90',
      shuffled: true,
      remaining: 52,
    });
  }),
  http.get(
    'https://deckofcardsapi.com/api/deck/3p40paa87x90/draw/',
    async () => {
      return HttpResponse.json({
        success: true,
        deck_id: '3p40paa87x90',
        cards: [
          {
            code: '6H',
            image: 'https://deckofcardsapi.com/static/img/6H.png',
            images: {
              svg: 'https://deckofcardsapi.com/static/img/6H.svg',
              png: 'https://deckofcardsapi.com/static/img/6H.png',
            },
            value: '6',
            suit: 'HEARTS',
          },
        ],
        remaining: 51,
      });
    },
  ),
];