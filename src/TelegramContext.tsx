import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramUser {
    id: number;
    first_name: string;
    username?: string;
    last_name?: string;
    language_code?: string;
    is_premium?: boolean;
}

interface TelegramWebApp {
    ready: () => void;
    sendData: (data: string) => void;
    initDataUnsafe: {
        user?: TelegramUser;
    };
}

interface TelegramContextType {
    telegram: TelegramWebApp | { sendData: (data: string) => void };
    user: TelegramUser | null;
    isTelegram: boolean;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider = ({ children }: { children: ReactNode }) => {
    const [telegram, setTelegram] = useState<TelegramContextType['telegram'] | null>(null);
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [isTelegram, setIsTelegram] = useState(false);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        // Проверяем наличие tg и присутствие initDataUnsafe.user
        if (tg && tg.initDataUnsafe?.user) {
            tg.ready();
            setTelegram(tg);
            setUser(tg.initDataUnsafe.user);
            setIsTelegram(true);
        } else {
            setTelegram({
                sendData: (data: string) => console.log('Mock sendData:', data),
            });
            setUser({ id: 0, first_name: 'Guest', username: 'guest' });
            setIsTelegram(false);
        }

        // Диагностика для отладки
        console.log('Telegram.WebApp exists:', !!tg);
        console.log('User exists:', !!tg?.initDataUnsafe?.user);
    }, []);

    if (!telegram) return null; // Ждём инициализации

    return (
        <TelegramContext.Provider value={{ telegram, user, isTelegram }}>
            {children}
        </TelegramContext.Provider>
    );
};

export const useTelegram = (): TelegramContextType => {
    const context = useContext(TelegramContext);
    if (context === undefined) {
        throw new Error('useTelegram must be used within a TelegramProvider');
    }
    return context;
};