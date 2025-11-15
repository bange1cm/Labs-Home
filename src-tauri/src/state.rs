use std::sync::Mutex;

lazy_static::lazy_static! {
    pub static ref QEMU_PID: Mutex<Option<u32>> = Mutex::new(None);
}
