import { NextResponse } from "next/server"

export async function GET(req: Request) {
  console.log('Received GET request to /api/users')
  const abortController = new AbortController()
  
  req.signal.onabort = () => {
    console.log('Request aborted by client (req.signal.onabort)')
    abortController.abort()
  }

  try {
    const result = await someAsyncOperation(abortController.signal)
    
    if (req.signal.aborted) {
      return new NextResponse(null, { status: 499 })
    }

    return NextResponse.json({ result })
    
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return new NextResponse(null, { status: 499 })
    }
    
    console.error('Error in request:', error)
    return NextResponse.json(
      { error: (error as Error).message }, 
      { status: 500 }
    )
  }
}

async function someAsyncOperation(signal: AbortSignal) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve('Operation Result')
    }, 5000)
    
    // Cancela a operação se o signal for abortado
    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      reject(new Error('AbortError'))
    })
  })
}