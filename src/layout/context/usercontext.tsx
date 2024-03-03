import {
    createContext,
    useContext,
    useEffect, useRef,
    useState
} from "react";
import {account} from "../../service/appwrite";
import {useRouter} from "next/navigation";
import {ID, Models} from "appwrite";
import {Company} from "../../service/types/company/Company";

const UserContext = createContext({} as UserContextProps);

export function useUser() {
    return useContext(UserContext);
}

export interface UserContextProps {
    current: Models.Session | null;
    company: Company | null;
    selectCompany: (company: Company) => Promise<void>;
    login: (email: string, password: string) => Promise<Models.Session>;
    logout: () => Promise<void>;
    createRecovery: (email: string) => Promise<Models.Token>;
    register: (email: string, password: string) =>   Promise<Models.User<Models.Preferences>>;
    updateRecovery: (password: string, password2: string)=> Promise<void>;
    loadingUser: Boolean;
}

export function UserProvider(props: { children: any }) {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState<Company| null>(null);
    const [loadingUser, setLoadingUser] = useState(true)

    const router = useRouter();

    async function login(email: string, password: string) {
        return  account.createEmailSession(email, password);
    }

    async function selectCompany(company: Company){
        localStorage.setItem("cid", JSON.stringify(company))
        setCompany(company)
    }

    async function createRecovery(email: string) {
        let token = await account.createRecovery(email, window.location.origin + '/auth/verify');

        router.push(`/auth/login`)
        return token
    }

    async function updateRecovery(password: string, password2: string) {
        const urlParams = new URLSearchParams(window.location.search);
        const secret = urlParams.get('secret');
        const userId = urlParams.get('userId');
        await account.updateRecovery(userId as string, secret as string, password, password2);
        router.push('/auth/login');
    }

    async function logout() {
        await account.deleteSession("current");
        localStorage.removeItem("cid")
        setUser(null);
        setCompany(null)
        window.location.replace('/landing')
    }

    async function register(email: string, password: string) {
        return account.create(ID.unique(), email, password);
    }

    async function init() {
        try {
            const loggedIn = await account.get();
            setUser(loggedIn as any);
            setCompany(JSON.parse(localStorage.getItem("cid") as string))
        } catch (err) {
            setUser(null);
        } finally {
            setLoadingUser(false)
        }
    }

    useEffect(() => {
        init();
    }, []);

    const value: UserContextProps = {
        current: user,
        company: company,
        selectCompany,
        login,
        logout,
        register,
        createRecovery,
        updateRecovery,
        loadingUser
    };

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
}
