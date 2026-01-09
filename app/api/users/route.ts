import { NextResponse } from "next/server"

export async function GET(req: Request) {
  
  console.log('Received GET request to /api/users')
  
  const abortController = new AbortController()
  
  req.signal.onabort = () => {
    console.log('Request aborted by client')
    abortController.abort()
  }

  try {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/list-users`, {
      signal: abortController.signal,
      cache: 'no-store'
    }).then(res => res.json())

    console.log('Generated users successfully:', result.users)

    if (req.signal.aborted) {
      return new NextResponse(null, { 
        status: 499,
      })
    }

    return NextResponse.json({ 
      result,
    })
    
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return new NextResponse(null, { 
        status: 499,
      })
    }

    console.error(`Error:`, error)
    return NextResponse.json(
      { error: (error as Error).message }, 
      { status: 500 }
    )
  }
}