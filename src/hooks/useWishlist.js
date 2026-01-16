import { useState, useEffect } from 'react';

export default function useWishlist() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('watchlist');
        if (stored) {
            setWishlist(JSON.parse(stored));
        }
    }, []);

    const addToWishlist = (show) => {
        const updated = [...wishlist, show];
        setWishlist(updated);
        localStorage.setItem('watchlist', JSON.stringify(updated));
    };

    const removeFromWishlist = (showId) => {
        const updated = wishlist.filter(item => item.id !== showId);
        setWishlist(updated);
        localStorage.setItem('watchlist', JSON.stringify(updated));
    };

    const isInWishlist = (showId) => {
        return wishlist.some(item => item.id === showId);
    };

    const toggleWishlist = (show) => {
        if (isInWishlist(show.id)) {
            removeFromWishlist(show.id);
        } else {
            addToWishlist(show);
        }
    };

    return { wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist };
}
