import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from "@chakra-ui/react";

interface AlertMessageProps {
  message: string | null;
  onClose: () => void;
  
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Alert status='error' mb={2}>
      <AlertIcon />
      <Box width="100%">
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>
          {message}
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf='flex-start'
        position='relative'
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  );
};

export default AlertMessage;
