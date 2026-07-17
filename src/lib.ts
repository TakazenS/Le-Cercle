export function get_ip(): string {
    return "127.0.0.1";
}

export function get_port(): string {
    return "8080";
}

export function get_url(): string {
    return `http://${get_ip()}:${get_port()}`;
}
