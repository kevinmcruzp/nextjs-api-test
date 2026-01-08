import { NextResponse } from "next/server"

export async function GET(req: Request) {
  let isAborted: boolean = false
  req.signal.onabort = () => {
    console.log('Request aborted')
    isAborted = true
  }

  try {
    // Your main logic here
    const result = await someAsyncOperation()

    if (isAborted) {
      console.log('Not sending response because request was aborted')
      return new NextResponse(null, { status: 499 }) // Client Closed Request
    }

    return NextResponse.json({ result })
  } catch (error) {    
    // Handle other errors
    return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 })
  }
}

async function someAsyncOperation() {
  // Simulate a long-running operation that can be aborted
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Operation Result')
    }, 10000)
  })
  
}