/**
 * Motivational Quotes API Service
 * Using quotable.io - free, no API key required
 */

export interface Quote {
  content: string;
  author: string;
}

const FALLBACK_QUOTES: Quote[] = [
  {
    content: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    content: 'Small daily improvements are the key to staggering long-term results.',
    author: 'Unknown',
  },
  {
    content: 'You don\'t have to be great to start, but you have to start to be great.',
    author: 'Zig Ziglar',
  },
  {
    content: 'Success is the sum of small efforts repeated day in and day out.',
    author: 'Robert Collier',
  },
  {
    content: 'A journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
  },
  {
    content: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    content: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
  },
];

export const fetchDailyQuote = async (): Promise<Quote> => {
  try {
    const response = await fetch('https://api.quotable.io/random?tags=inspirational|motivational', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    
    return {
      content: data.content,
      author: data.author,
    };
  } catch (error) {
    console.log('Failed to fetch quote, using fallback:', error);
    // Return random fallback quote
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
};