import { useContext } from "react";
import { StateContext } from "./StateContextProvider.jsx";

export const useStateContext = () => useContext(StateContext);
