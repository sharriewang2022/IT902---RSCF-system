import {chatbotStore} from "./chatbotStore";
import {Provider} from "react-redux";

export const ChatbotProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={chatbotStore}>{children}</Provider>;
};
