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
    // Find the document where the actual filename (from file_url) matches the slug
    // For old documents with random number filenames, fallback to checking the title
    const document = data.find(doc => {
      if (!doc.file_url) return false
      const fileName = doc.file_url.split('/').pop()?.replace('.pdf', '') || ''
      const isRandomNumber = /^0\.\d{10,}$/.test(fileName)
      
      if (isRandomNumber) {
        const cleanTitle = doc.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        return cleanTitle === slug.toLowerCase()
      }
      
      return fileName.toLowerCase() === slug.toLowerCase()
    })

    if (document && document.file_url) {
      // Instead of redirecting (which changes the URL in the address bar),
      // we fetch the file from Supabase and stream it directly to the user.
      // This keeps the clean URL in the browser and hides the Supabase URL entirely!
      try {
        const res = await fetch(document.file_url)
        return new NextResponse(res.body, {
          headers: {
            'Content-Type': res.headers.get('Content-Type') || 'application/pdf',
            'Content-Disposition': `inline; filename="${slug}.pdf"`,
          },
        })
      } catch (err) {
        return NextResponse.redirect(document.file_url) // Fallback to redirect if fetch fails
      }
    }
  }

  // If no document is found, redirect back to home page
  return NextResponse.redirect(new URL('/', request.url))
}
