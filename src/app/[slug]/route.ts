import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Ignore requests for static files (e.g. favicon.ico, images)
  if (slug.includes('.')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // Fetch all active compliance documents
  const { data } = await supabase
    .from('compliance_documents')
    .select('title, file_url')
    .eq('status', 'active')

  if (data) {
    // Find the document where the title (stripped of all non-alphanumeric characters) matches the slug
    const document = data.find(doc => {
      const cleanTitle = doc.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      return cleanTitle === slug.toLowerCase()
    })

    if (document && document.file_url) {
      // Redirect to the actual Supabase PDF URL
      return NextResponse.redirect(document.file_url)
    }
  }

  // If no document is found, redirect back to home page
  return NextResponse.redirect(new URL('/', request.url))
}
