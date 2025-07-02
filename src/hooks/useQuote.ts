import { useState, useEffect } from 'react';

interface Quote {
    text: string;
    author: string;
}

const fallbackQuotes: Quote[] = [
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
    { text: "So many books, so little time.", author: "Frank Zappa" },
    { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
    { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
    { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
    { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
    { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
    { text: "We accept the love we think we deserve.", author: "Stephen Chbosky" },
    { text: "Imperfection is beauty, madness is genius and it's better to be absolutely ridiculous than absolutely boring.", author: "Marilyn Monroe" },
    { text: "Life is what happens to us while we are making other plans.", author: "Allen Saunders" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Happiness depends upon ourselves.", author: "Aristotle" },
];

export function useQuote() {
    const [quote, setQuote] = useState<Quote>(fallbackQuotes[0]);
    const colors = [
        '#16a085', '#27ae60', '#2c3e50', '#f39c12',
        '#e74c3c', '#9b59b6', '#FB6964', '#342224',
        '#472E32', '#BDBB99', '#77B1A9', '#73A857'
    ];
    const [color, setColor] = useState(colors[0]);

    const fetchQuote = async () => {
        try {
            const res = await fetch('https://quotes15.p.rapidapi.com/quotes/random/?language_code=en', {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'quotes15.p.rapidapi.com',
                    'x-rapidapi-key': '60c8295da6mshae19a2632a12d90p108498jsn023dec9376e1',
                },
            });

            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();

            // API response has { content: string, originator: { name: string } }
            setQuote({
                text: data.content,
                author: data.originator?.name || 'Unknown',
            });

            const newColor = colors[Math.floor(Math.random() * colors.length)];
            setColor(newColor);
            document.body.style.color = newColor;
        } catch (e) {
            // fallback
            const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            setQuote(fallback);

            const newColor = colors[Math.floor(Math.random() * colors.length)];
            setColor(newColor);
            document.body.style.color = newColor;

            console.error('Error fetching quote, using fallback:', e);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    return { quote, color, fetchQuote };
}
