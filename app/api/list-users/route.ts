import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const requestId = `list-users_${Date.now()}`
  console.log(`[${requestId}] ✅ Received GET request to /api/list-users`)

  const abortController = new AbortController()
  
  // Com supportsCancellation habilitado, os logs devem funcionar
  req.signal.addEventListener("abort", () => {
    console.log(`[${requestId}] ⚠️ Request aborted by client`)
    abortController.abort()
  })

  try {
    console.log(`[${requestId}] 📝 Generating user list...`)
    // Simulate fetching users with name and id
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'David' },
      { id: 5, name: 'Eve' },
    ]

    console.log(`[${requestId}] ⏳ Starting 5 second delay...`)
    // Delay de 5 segundos com suporte a abort
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 5000)
      
      abortController.signal.addEventListener("abort", () => {
        clearTimeout(timeout)
        reject(new DOMException("Aborted", "AbortError"))
      })
    })

    console.log(`[${requestId}] ⏰ Delay completed`)

    console.log(`[${requestId}] ✅ Request completed successfully - returning ${users.length} users`)
    return NextResponse.json({
      users,
      _meta: { requestId }
    })

  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log(`[${requestId}] 🚫 AbortError caught - request was cancelled`)
      return new NextResponse(null, {
        status: 499,
        headers: { 'X-Request-Id': requestId }
      })
    }

    console.error(`[${requestId}] ❌ Error in /api/list-users:`, error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
