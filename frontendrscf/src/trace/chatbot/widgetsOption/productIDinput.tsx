import React from "react";
import {styled} from "styled-components";

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid rgb(var(--primary-color));
  color: rgb(var(--primary-color));
  border-radius: 5rem;
  transition: 0.15s;
  &:active {
    transform: scale(0.95);
  }
`;

const ProductIDinput: React.FC<any> = (props) => {
  const options = [
    {
      name: "Please enter the product ID (e.g., id: 00000001).",
      handler: props.actionProvider.handleInputReportID,
      id: 1,
    },
  ];
  return (
    <div className="options-container">
      {options.map((option) => {
        return (
          <StyledButton
            key={option.id}
            className="option-button"
            onClick={option.handler}
          >
            {option.name}
          </StyledButton>
        );
      })}
    </div>
  );
};

export default ProductIDinput;
