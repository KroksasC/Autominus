import { useState, useEffect } from "react";

export function StatusView() {
    const [logged, setLogged] = useState(false);

    // This function checks if there is anything in localStorage to decide if the user is logged in
    const isLogged = () => {
        if (localStorage.getItem("userId")) {  // Assuming user info is saved in localStorage under the key 'user'
            setLogged(true);
        } else {
            setLogged(false);
        }
    };

    // Using useEffect to call isLogged when the component mounts
    useEffect(() => {
        isLogged();
    }, []);

    return (
        <div>
            {logged ? (
                <p>You are logged in.</p>
            ) : (
                <p>You are not logged in. Please log in.</p>
            )}
        </div>
    );
}