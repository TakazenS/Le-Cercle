import { useServers } from "./ServersProvider.tsx";

export function ServersList() {
    const { servers } = useServers();

    return (
        <ul>
            {servers.map(s => (
                <li key={s.id}>
                    {s.name} — {s.url}
                </li>
            ))}
        </ul>
    );
}