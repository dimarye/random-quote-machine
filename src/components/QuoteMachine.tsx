import React, { useState, useEffect } from 'react';
import { useQuote } from '../hooks/useQuote';
import { Star } from 'lucide-react';

type Quote = {
    text: string;
    author: string;
};

export default function QuoteMachine() {
    const { quote, color, fetchQuote } = useQuote();

    const [favorites, setFavorites] = useState<Quote[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [showFavorites, setShowFavorites] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const isFavorite = favorites.some(
        (fav) => fav.text === quote.text && fav.author === quote.author
    );

    const tweetURL = `https://twitter.com/intent/tweet?hashtags=quotes&text=${encodeURIComponent(
        `"${quote.text}" — ${quote.author}`
    )}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
        setToastMessage('Quote copied!');
        setShowToast(true);
    };

    const toggleFavorite = () => {
        let newFavorites;
        if (isFavorite) {
            newFavorites = favorites.filter(
                (fav) => !(fav.text === quote.text && fav.author === quote.author)
            );
            setToastMessage('Removed from favorites');
        } else {
            newFavorites = [...favorites, { text: quote.text, author: quote.author }];
            setToastMessage('Added to favorites');
        }
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setShowToast(true);
    };

    const openGoogleSearch = () => {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(quote.text)}`;
        window.open(searchUrl, '_blank', 'noopener');
    };

    const removeFavorite = (favToRemove: Quote) => {
        const newFavorites = favorites.filter(
            (fav) => !(fav.text === favToRemove.text && fav.author === favToRemove.author)
        );
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setToastMessage('Removed from favorites');
        setShowToast(true);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    return (
        <>
            <button
                className="btn btn-primary position-fixed"
                style={{ top: 15, left: 15, zIndex: 1100 }}
                onClick={() => setShowFavorites(!showFavorites)}
                aria-expanded={showFavorites}
                aria-controls="favorites-list"
            >
                {showFavorites ? 'Hide Favorites' : `Show Favorites (${favorites.length})`}
            </button>

            {showFavorites && (
                <div
                    id="favorites-list"
                    className="position-fixed bg-white shadow rounded p-3"
                    style={{
                        top: 60,
                        left: 15,
                        width: 320,
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        zIndex: 1090,
                    }}
                >
                    <h5 style={{ color }}>Favorites</h5>
                    {favorites.length === 0 && <p className="text-muted">No favorite quotes yet.</p>}
                    <ul className="list-group">
                        {favorites.map((fav, idx) => (
                            <li
                                key={idx}
                                className="list-group-item d-flex justify-content-between align-items-start"
                            >
                                <div>
                                    <strong>{fav.author || 'Unknown'}</strong>
                                    <br />
                                    <em>"{fav.text}"</em>
                                </div>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeFavorite(fav)}
                                    aria-label="Remove from favorites"
                                    title="Remove from favorites"
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div
                id="quote-box"
                className="quote-box"
                style={{ color }}
            >
                <button
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                >
                    <Star
                        fill={isFavorite ? 'gold' : 'none'}
                        stroke={isFavorite ? 'gold' : 'currentColor'}
                        size={32}
                    />
                </button>

                <div
                    id="text"
                    className="text-center fs-4"
                    style={{ cursor: 'pointer' }}
                    onClick={openGoogleSearch}
                    title="Search this quote on Google"
                >
                    <i className="fa fa-quote-left"></i> {quote.text}
                </div>

                <div
                    id="author"
                    className="text-end fst-italic mt-3"
                    style={{
                        cursor: 'pointer',
                        color,
                        textDecoration: 'underline',
                        userSelect: 'none',
                    }}
                    onClick={() => {
                        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(quote.author)}`;
                        window.open(wikiUrl, '_blank', 'noopener');
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(quote.author)}`;
                            window.open(wikiUrl, '_blank', 'noopener');
                        }
                    }}
                >
                    — {quote.author}
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <a
                        id="tweet-quote"
                        href={tweetURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        aria-label="Share on X"
                    >
                        X
                    </a>
                    <button
                        id="copy-quote"
                        onClick={copyToClipboard}
                        className="btn btn-primary"
                    >
                        Copy
                    </button>
                    <button
                        id="new-quote"
                        onClick={fetchQuote}
                        className="btn btn-primary"
                    >
                        New Quote
                    </button>
                </div>
            </div>

            {showToast && (
                <div
                    className="toast show position-fixed bottom-0 end-0 m-3 align-items-center text-white bg-primary border-0"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    style={{ zIndex: 1050, minWidth: 200 }}
                >
                    <div className="d-flex">
                        <div className="toast-body">{toastMessage}</div>
                        <button
                            type="button"
                            className="btn-close btn-close-white me-2 m-auto"
                            aria-label="Close"
                            onClick={() => setShowToast(false)}
                        ></button>
                    </div>
                </div>
            )}
        </>
    );
}
