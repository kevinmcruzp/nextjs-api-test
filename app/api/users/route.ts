import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const requestId = `users_${Date.now()}`
  console.log(`[${requestId}] ✅ Received GET request to /api/users`)
  
  const abortController = new AbortController()
  
  req.signal.addEventListener("abort", () => {
    console.log(`[${requestId}] ⚠️ Request aborted by client`)
    abortController.abort()
  })

  try {
    console.log(`[${requestId}] 🔄 Fetching from /api/list-users...`)
    
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/list-users`, {
      signal: abortController.signal,
      cache: 'no-store'
    }).then(res => res.json())

    console.log(`[${requestId}] ✅ Fetched ${result.users?.length || 0} users successfully`)

    return NextResponse.json({ 
      result,
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

    console.error(`[${requestId}] ❌ Error:`, error)
    return NextResponse.json(
      { error: (error as Error).message, requestId }, 
      { status: 500 }
    )
  }
}