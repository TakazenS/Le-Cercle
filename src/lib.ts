export function setUrl(address: string) {
    if (localStorage.getItem("le-cercle-server-url")) {
        localStorage.removeItem("le-cercle-server-url");
    }
    localStorage.setItem("le-cercle-server-url", address);
}

export function getUrl(): string | null {
    return localStorage.getItem("le-cercle-server-url");
}

