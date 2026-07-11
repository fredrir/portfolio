//! Terminal commands compiled to WebAssembly and loaded on demand by the
//! browser terminal. String ABI: the host calls `alloc`, writes UTF-8 into
//! linear memory, calls `run`, and reads the result from the packed
//! pointer/length it returns.

use std::alloc::{Layout, alloc as raw_alloc};

/// Host-callable allocator for passing strings in.
///
/// # Safety
/// The host must treat the returned pointer as owning `len` writable bytes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn alloc(len: usize) -> *mut u8 {
    let layout = Layout::from_size_align(len.max(1), 1).expect("layout");
    unsafe { raw_alloc(layout) }
}

/// Runs a plugin command. Returns (ptr << 32 | len) of a UTF-8 result the
/// host reads out of linear memory. Leaked intentionally: the instance is
/// short-lived and re-created cheaply.
///
/// # Safety
/// `cmd_ptr`/`arg_ptr` must point at valid UTF-8 of the given lengths inside
/// this module's memory (written via `alloc`).
#[unsafe(no_mangle)]
pub unsafe extern "C" fn run(
    cmd_ptr: *const u8,
    cmd_len: usize,
    arg_ptr: *const u8,
    arg_len: usize,
) -> u64 {
    let cmd = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(cmd_ptr, cmd_len)) };
    let args = if arg_len == 0 {
        ""
    } else {
        unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(arg_ptr, arg_len)) }
    };

    let output = match cmd {
        "fract" => fract(args),
        other => format!("unknown plugin command: {other}"),
    };

    let bytes = output.into_bytes().leak();
    ((bytes.as_ptr() as u64) << 32) | bytes.len() as u64
}

/// ASCII Mandelbrot. Argument: zoom step 0-8 (default 0) diving toward a
/// seahorse-valley point.
pub fn fract(args: &str) -> String {
    let zoom: u32 = args.trim().parse().unwrap_or(0).min(8);
    let scale = 3.0 / f64::powi(2.2, zoom as i32);
    let (center_x, center_y) = if zoom == 0 {
        (-0.6, 0.0)
    } else {
        (-0.743_643_887, 0.131_825_904)
    };
    let (cols, rows) = (64usize, 24usize);
    let max_iter = 48 + zoom * 24;
    let palette: &[u8] = b" .:-=+*#%@";

    let mut out = String::with_capacity((cols + 1) * rows + 64);
    for row in 0..rows {
        for col in 0..cols {
            let x0 = center_x + (col as f64 / cols as f64 - 0.5) * scale * 1.6;
            let y0 = center_y + (row as f64 / rows as f64 - 0.5) * scale;
            let (mut x, mut y) = (0.0f64, 0.0f64);
            let mut iter = 0;
            while x * x + y * y <= 4.0 && iter < max_iter {
                let xt = x * x - y * y + x0;
                y = 2.0 * x * y + y0;
                x = xt;
                iter += 1;
            }
            let idx = if iter >= max_iter {
                palette.len() - 1
            } else {
                (iter as usize * (palette.len() - 1)) / max_iter as usize
            };
            out.push(palette[idx] as char);
        }
        out.push('\n');
    }
    out.push_str(&format!(
        "mandelbrot zoom={zoom} (try: fract {}) — computed in WebAssembly (Rust)",
        (zoom + 1).min(8)
    ));
    out
}

#[cfg(test)]
mod tests {
    use super::fract;

    #[test]
    fn renders_deterministic_grid() {
        let a = fract("0");
        let b = fract("0");
        assert_eq!(a, b);
        assert_eq!(a.lines().count(), 25);
        assert!(a.contains('@'));
    }

    #[test]
    fn clamps_zoom() {
        assert!(fract("999").contains("zoom=8"));
        assert!(fract("nonsense").contains("zoom=0"));
    }
}
