use std::net::UdpSocket;

/*======= Tests =======*/
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        //
    }
}

/*======= Functions =======*/
pub fn get_global_port() -> &'static str { "8080" }

pub fn get_localhost_ip() -> &'static str { "127.0.0.1" }

pub fn get_lan_ip() -> Option<String> {
    let socket = UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    socket.local_addr().ok().map(|addr| addr.ip().to_string())
}

pub fn get_localhost_url() -> String {format!("{}:{}", get_localhost_ip(), get_global_port())}

pub fn get_lan_url () -> String {format!("{}:{}", get_lan_ip().unwrap_or_else(|| get_localhost_ip().to_string()), get_global_port())}
