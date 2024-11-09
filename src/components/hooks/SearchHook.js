import { useState } from 'react';

const useSearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for controlling the visibility of the search bar

  const toggleSearchBar = () => {
    setIsSearchOpen(prevState => !prevState); // Toggle the visibility of the search bar
  };

  return {
    isSearchOpen,
    toggleSearchBar,
  };
};

export default useSearchBar;
