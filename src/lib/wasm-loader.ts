let wasmModule: WasmModule | null = null;

export async function loadWasm() {
  if (wasmModule) {
    return wasmModule;
  }

  try {
    // Import the JS bindings
    const wasmBindings = await import('@/wasm/wasm_module.js') as WasmModule;
    
    // Fetch the WASM file
    const wasmBytes = await fetch('/wasm_module_bg.wasm');
    const wasmArrayBuffer = await wasmBytes.arrayBuffer();
    
    // Initialize the WASM module
    await wasmBindings.default(wasmArrayBuffer);
    
    wasmModule = wasmBindings;
    return wasmModule;
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    throw error;
  }
}

export interface WasmModule {
  fibonacci: (n: number) => bigint;
  fibonacci_sum: (a: number, b: number) => bigint;
  prime_count: (limit: number) => number;
  matrix_multiply_sum: (size: number) => number;
  default: (wasmArrayBuffer: ArrayBuffer) => Promise<void>;
}