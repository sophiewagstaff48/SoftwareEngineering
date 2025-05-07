import React, { useState } from "react";

const ImageSearch = () => {
    const [query, setQuery] = useState("");
    const [images, setImages] = useState([]);  // Initialize as an empty array instead of undefined
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState([]);
    const [filter, setFilter] = useState("");


    const handleSearch = async () => {
        try {
            // Changed from query to q to match the backend expectation
            const response = await fetch(`http://localhost:5000/search_images?q=${query}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // The API returns results in a nested structure, so we need to extract the actual images
            if (data.results) {
                setImages(data.results.map(img => ({
                    url: img.thumbnail || img.url,
                    title: img.title || 'Untitled Image'
                })));
            } else {
                setImages([]);
            }
            setError(null);
        } catch (e) {
            console.error("Error fetching images:", e);
            setError("Error fetching images. Please try again.");
            setImages([]);  // Set as empty array on error
        } 
    };


    return (
        <div className="search-wrapper">
          <div className="search-bar">
            <h2 className="search-title">Image Search</h2>
            <input
              type="text"
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for images..."
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
            {error && <p className="search-error">{error}</p>}
          </div>
    
          <div className="image-grid">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="image-card">
                  <img src={image.url} alt={image.title} className="image-thumbnail" />
                  <p className="image-title">{image.title}</p>
                </div>
              ))
            ) : (
              <p className="no-results">No images to display. Try searching for something!</p>
            )}
          </div>
        </div>
      );
};

export default ImageSearch;