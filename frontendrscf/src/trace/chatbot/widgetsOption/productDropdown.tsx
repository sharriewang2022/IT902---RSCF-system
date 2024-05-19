import React from "react";
import {useDispatch} from "react-redux";
import {styled} from "styled-components";
import {AppDispatch} from "../redux/chatbotStore";
import {startCount} from "../redux/features/messages-slice";

const StyledSelect = styled.select`
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 5rem;
  appearance: none;
`;

const ProductDropdown: React.FC<any> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.actionProvider.handleUserInput(parseInt(e.target.value));
    setTimeout(() => {
      dispatch(startCount());
    }, 5000);
  };
  return (
    <StyledSelect onChange={handleProduct} title="Enter your product name">
      <option>Select an Option</option>
      {Array.from({ length: 30 }, (_, i) => i + 18).map((product) => (
        <option key={product} value={product}>
          {product}
        </option>
      ))}
    </StyledSelect>
  );
};

export default ProductDropdown;
