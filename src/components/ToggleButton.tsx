import React from "react";
import { IconButton } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

// Define the interface for the component's props
interface ToggleButtonProps {
  bg: string;
  isRound: boolean;
  ariaLabel: string;
  isToggled: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  bg,
  isRound,
  ariaLabel,
  isToggled,
  onToggle,
}) => {
  return (
    <IconButton
      p={1}
      color="#8D9CB8"
      isRound={isRound}
      bg={bg}
      size="ml"
      fontSize="33px"
      icon={isToggled ? <ChevronDownIcon /> : <ChevronUpIcon />}
      onClick={onToggle}
      aria-label={ariaLabel}
    />
  );
};

export default ToggleButton;
