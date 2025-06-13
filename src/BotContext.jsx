import { createContext, useContext } from 'react';

const BotContext = createContext(null);

export const useBot = () => useContext(BotContext);

export const BotProvider = ({ bot, children }) => (
    <BotContext.Provider value={bot}>{children}</BotContext.Provider>
);