/*======= Tests =======*/
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        //
    }
}

/*======= Functions =======*/
pub fn get_port() -> &'static str { "8080" }

pub fn get_ip() -> &'static str { "127.0.0.1" }

pub fn get_url() -> String { format!("http://{}:{}", get_ip(), get_port()) }