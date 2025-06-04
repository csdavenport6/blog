use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    console_log!("Computing fibonacci({}) in WebAssembly", n);
    
    if n <= 1 {
        return n as u64;
    }
    
    let mut a = 0u64;
    let mut b = 1u64;
    
    for _ in 2..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    
    b
}

#[wasm_bindgen]
pub fn fibonacci_sum(a: u32, b: u32) -> u64 {
    console_log!("Computing fibonacci({}) + fibonacci({}) in WebAssembly", a, b);
    fibonacci(a) + fibonacci(b)
}

#[wasm_bindgen]
pub fn prime_count(limit: u32) -> u32 {
    console_log!("Counting primes up to {} in WebAssembly", limit);
    
    if limit < 2 {
        return 0;
    }
    
    let mut sieve = vec![true; (limit + 1) as usize];
    sieve[0] = false;
    sieve[1] = false;
    
    let mut p = 2;
    while p * p <= limit {
        if sieve[p as usize] {
            let mut multiple = p * p;
            while multiple <= limit {
                sieve[multiple as usize] = false;
                multiple += p;
            }
        }
        p += 1;
    }
    
    sieve.iter().filter(|&&is_prime| is_prime).count() as u32
}

#[wasm_bindgen]
pub fn matrix_multiply_sum(size: u32) -> f64 {
    console_log!("Computing {}x{} matrix multiplication in WebAssembly", size, size);
    
    let n = size as usize;
    let mut a = vec![vec![1.0; n]; n];
    let mut b = vec![vec![2.0; n]; n];
    let mut c = vec![vec![0.0; n]; n];
    
    // Initialize matrices with some pattern
    for i in 0..n {
        for j in 0..n {
            a[i][j] = (i + j) as f64;
            b[i][j] = (i * j + 1) as f64;
        }
    }
    
    // Matrix multiplication
    for i in 0..n {
        for j in 0..n {
            for k in 0..n {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    
    // Sum all elements
    c.iter().flatten().sum()
}

#[wasm_bindgen(start)]
pub fn main() {
    console_log!("WebAssembly module loaded!");
}
