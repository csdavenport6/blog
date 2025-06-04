'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { loadWasm, WasmModule } from '@/lib/wasm-loader'

export default function WasmPage() {
  const [result, setResult] = useState<string | null>(null)
  const [input1, setInput1] = useState('10')
  const [input2, setInput2] = useState('20')
  const [wasmModule, setWasmModule] = useState<WasmModule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [demoType, setDemoType] = useState<'fibonacci' | 'primes' | 'matrix'>('fibonacci')

  useEffect(() => {
    const initWasm = async () => {
      try {
        setLoading(true)
        const wasmMod = await loadWasm()
        setWasmModule(wasmMod)
      } catch (err) {
        setError('Failed to load WebAssembly module')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    initWasm()
  }, [])

  const runWasmComputation = async () => {
    if (!wasmModule) return
    
    setLoading(true)
    setError(null)
    
    try {
      const num1 = parseInt(input1)
      const num2 = parseInt(input2)
      
      let computationResult: string
      
      switch (demoType) {
        case 'fibonacci':
          const fibResult = wasmModule.fibonacci_sum(num1, num2)
          computationResult = `fibonacci(${num1}) + fibonacci(${num2}) = ${fibResult.toString()}`
          break
          
        case 'primes':
          const primeResult = wasmModule.prime_count(Math.max(num1, num2))
          computationResult = `Prime count up to ${Math.max(num1, num2)}: ${primeResult}`
          break
          
        case 'matrix':
          const matrixResult = wasmModule.matrix_multiply_sum(Math.min(num1, 50))
          computationResult = `${Math.min(num1, 50)}×${Math.min(num1, 50)} matrix multiplication sum: ${matrixResult.toFixed(2)}`
          break
          
        default:
          computationResult = 'Unknown computation type'
      }
      
      setResult(computationResult)
    } catch (err) {
      setError('Computation failed')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <nav className="mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900">WebAssembly Demo</h1>
          <p className="mt-2 text-gray-600">
            Interactive WebAssembly experiments and demos
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            WebAssembly Rust Computations
          </h2>
          <p className="text-gray-600 mb-6">
            Real WebAssembly functions written in Rust and compiled to WASM. 
            Check the browser console to see WASM logs!
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Computation Type
              </label>
              <select
                value={demoType}
                onChange={(e) => setDemoType(e.target.value as 'fibonacci' | 'primes' | 'matrix')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fibonacci">Fibonacci Sum</option>
                <option value="primes">Prime Count</option>
                <option value="matrix">Matrix Multiplication</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {demoType === 'fibonacci' ? 'First Number (max 50)' : 
                   demoType === 'primes' ? 'Number 1' : 
                   'Matrix Size (max 50)'}
                </label>
                <input
                  type="number"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  max={demoType === 'matrix' ? 50 : demoType === 'fibonacci' ? 50 : 10000}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {demoType === 'fibonacci' ? 'Second Number (max 50)' : 
                   demoType === 'primes' ? 'Number 2' : 
                   'Unused'}
                </label>
                <input
                  type="number"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  max={demoType === 'fibonacci' ? 50 : 10000}
                  disabled={demoType === 'matrix'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
            
            <button
              onClick={runWasmComputation}
              disabled={loading || !wasmModule}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Computing...' : 'Run WASM Computation'}
            </button>
            
            {result && (
              <div className="mt-4 p-4 bg-white rounded border">
                <p className="text-lg">
                  <span className="font-semibold">Result:</span> {result}
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            WebAssembly Functions Available
          </h2>
          <div className="prose text-gray-600">
            <p>The Rust WASM module provides these functions:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><code>fibonacci(n)</code> - Efficient Fibonacci calculation</li>
              <li><code>fibonacci_sum(a, b)</code> - Sum of two Fibonacci numbers</li>
              <li><code>prime_count(limit)</code> - Count primes using Sieve of Eratosthenes</li>
              <li><code>matrix_multiply_sum(size)</code> - Matrix multiplication with summation</li>
            </ul>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm">
                <strong>✅ Success!</strong> You&apos;re now running real WebAssembly compiled from Rust!
                Open the browser console to see WASM logs.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}