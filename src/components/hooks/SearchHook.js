import { useState, useEffect } from 'react';

const useSearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for controlling the visibility of the search bar

  const toggleSearchBar = () => {
    setIsSearchOpen(prevState => !prevState); // Toggle the visibility of the search bar
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl (or Cmd on Mac) + I is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault(); // Prevent the default action (e.g., opening the browser's "Inspect" panel)
        toggleSearchBar(); // Toggle the search bar visibility
      }
    };

    // Add the keydown event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return {
    isSearchOpen,
    toggleSearchBar,
  };
};

export default useSearchBar;
