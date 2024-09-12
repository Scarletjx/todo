import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";

// Define the interface for the component's props
interface SearchBarProps {
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  handleSearch,
  clearSearch,
}) => {
  return (
    <InputGroup
      ml="auto"
      mt={4}
      mb={4}
      bg="grey.100"
      width="30%"
      borderRadius="xl"
    >
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="blue" />
      </InputLeftElement>
      <Input
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <InputRightElement>
        {searchQuery && (
          <IconButton
            size="xs"
            isRound={true}
            aria-label="Clear search"
            icon={<CloseIcon boxSize={2} />}
            color="white"
            bg="grey.200"
            onClick={clearSearch}
          />
        )}
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchBar;
