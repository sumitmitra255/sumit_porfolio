import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')

// Read blog data
const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/blogData.json'), 'utf-8'))

async function generateStaticPages() {
  console.log('🚀 Starting static site generation...')
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    console.log('❌ dist directory not found. Run "npm run build" first.')
    process.exit(1)
  }

  // Read the built HTML file
  const indexPath = path.join(distDir, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.log('❌ index.html not found in dist. Run "npm run build" first.')
    process.exit(1)
  }

  let template = fs.readFileSync(indexPath, 'utf-8')

  // Routes to generate static pages for
  const routes = [
    '/',
    '/sumit-mitra/',
    '/sumit-mitra',
    '/blog'
  ]

  // Add blog post routes dynamically
  blogData.forEach(post => {
    routes.push(`/blogs/${post.slug}`)
  })

  // Generate static HTML for each route
  for (const route of routes) {
    console.log(`📄 Processing ${route}...`)
    
    // Update canonical URL for this route
    const canonicalUrl = `https://sumitmitra255.github.io${route}`
    let html = template.replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`
    )

    // Add meta tags for better SEO
    let routeTitle
    if (route === '/' || route === '/sumit-mitra' || route === '/sumit-mitra/') {
      routeTitle = 'Sumit Mitra | Full-Stack Architect & GenAI Builder'
    } else if (route === '/blog') {
      routeTitle = 'Blog | Sumit Mitra | Full-Stack Architect & GenAI Builder'
    } else if (route.startsWith('/blogs/')) {
      const post = blogData.find(p => `/blogs/${p.slug}` === route)
      routeTitle = post ? `${post.title} | Blog | Sumit Mitra` : `Blog Post | Sumit Mitra | Full-Stack Architect & GenAI Builder`
    } else {
      routeTitle = `Sumit Mitra | Full-Stack Architect & GenAI Builder${route}`
    }
    
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${routeTitle}</title>`
    )

    // Add structured data for the specific route
    const structuredData = generateStructuredData(route)
    const existingSchema = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/)
    
    if (existingSchema) {
      html = html.replace(existingSchema[0], structuredData)
    } else {
      html = html.replace('</head>', `${structuredData}\n  </head>`)
    }

    // Determine output file path
    let outputPath
    if (route === '/' || route === '/sumit-mitra' || route === '/sumit-mitra/') {
      outputPath = path.join(distDir, 'index.html')
    } else {
      const cleanRoute = route.replace(/^\//, '').replace(/\/$/, '')
      const routeDir = path.join(distDir, cleanRoute)
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true })
      }
      outputPath = path.join(routeDir, 'index.html')
    }

    // Write the HTML file
    fs.writeFileSync(outputPath, html)
    console.log(`✅ Generated ${outputPath}`)
  }

  // Copy additional static files from public if they don't exist
  const publicDir = path.join(rootDir, 'public')
  if (fs.existsSync(publicDir)) {
    const copyPublicFiles = (srcDir, destDir) => {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      
      const files = fs.readdirSync(srcDir)
      files.forEach(file => {
        const srcPath = path.join(srcDir, file)
        const destPath = path.join(destDir, file)
        
        if (fs.statSync(srcPath).isDirectory()) {
          copyPublicFiles(srcPath, destPath)
        } else {
          if (!fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath)
          }
        }
      })
    }
    copyPublicFiles(publicDir, distDir)
  }

  // Generate a comprehensive sitemap
  const sitemap = generateSitemap(routes)
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
  console.log('✅ Generated sitemap.xml')

  // Generate robots.txt if it doesn't exist
  const robotsPath = path.join(distDir, 'robots.txt')
  if (!fs.existsSync(robotsPath)) {
    const robots = generateRobots()
    fs.writeFileSync(robotsPath, robots)
    console.log('✅ Generated robots.txt')
  }

  console.log('🎉 Static site generation complete!')
  console.log('📁 Output directory:', distDir)
  console.log('🌐 Ready to deploy to GitHub Pages!')
  console.log('📋 Generated files:')
  
  // List generated files
  const listFiles = (dir, prefix = '') => {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const relativePath = path.relative(distDir, filePath)
      console.log(`   📄 ${relativePath}`)
      
      if (fs.statSync(filePath).isDirectory()) {
        listFiles(filePath, prefix + '  ')
      }
    })
  }
  listFiles(distDir)
}

function generateStructuredData(route) {
  const baseUrl = 'https://sumitmitra255.github.io'
  const fullUrl = `${baseUrl}${route}`
  
  // Check if this is a blog post
  const post = blogData.find(p => `/blogs/${p.slug}` === route)
  
  if (post) {
    // Blog post structured data
    return `  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${post.title}",
      "description": "${post.excerpt}",
      "image": "${baseUrl}/sumit-mitra/profile-photo.jpg",
      "author": {
        "@type": "Person",
        "name": "Sumit Mitra",
        "url": "${baseUrl}/sumit-mitra"
      },
      "publisher": {
        "@type": "Person",
        "name": "Sumit Mitra"
      },
      "datePublished": "${post.date}",
      "dateModified": "${post.date}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${fullUrl}"
      },
      "keywords": "${post.tags.join(', ')}",
      "articleSection": "Technology",
      "wordCount": "500",
      "genre": ["${post.tags.join('", "')}"]
    }
  </script>`
  } else if (route === '/blog') {
    // Blog listing structured data
    return `  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Blog | Sumit Mitra",
      "description": "Thoughts, tutorials, and insights on web development and technology",
      "url": "${fullUrl}",
      "author": {
        "@type": "Person",
        "name": "Sumit Mitra",
        "url": "${baseUrl}/sumit-mitra"
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          ${blogData.map((post, index) => `{
            "@type": "BlogPosting",
            "position": ${index + 1},
            "name": "${post.title}",
            "url": "${baseUrl}/blogs/${post.slug}",
            "description": "${post.excerpt}"
          }`).join(',\n          ')}
        ]
      }
    }
  </script>`
  } else {
    // Default person structured data
    return `  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Sumit Mitra",
      "jobTitle": "Senior Software Engineer",
      "description": "Full-Stack Architect & GenAI Builder with 10+ years of experience",
      "url": "${fullUrl}",
      "image": "${baseUrl}/sumit-mitra/profile-photo.jpg",
      "sameAs": [
        "https://linkedin.com/in/sumitmitra255",
        "https://github.com/sumitmitra255",
        "https://twitter.com/sumitmitra255"
      ],
      "knowsAbout": [
        "Cloud Architecture",
        "Microservices",
        "AI Integration",
        "React Development",
        "Node.js",
        "TypeScript",
        "Python",
        "AWS",
        "Docker",
        "Kubernetes",
        "Machine Learning",
        "DevOps"
      ],
      "offers": {
        "@type": "Service",
        "serviceType": "Software Development Consulting",
        "description": "Full-stack development, cloud architecture, and AI integration services"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9002395305",
        "contactType": "consulting",
        "email": "mitrasumit1@gmail.com"
      }
    }
  </script>`
  }
}

function generateSitemap(routes) {
  const baseUrl = 'https://sumitmitra255.github.io'
  const currentDate = new Date().toISOString().split('T')[0]
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`

  routes.forEach(route => {
    const url = `${baseUrl}${route}`
    sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
`
  })

  sitemap += `</urlset>`
  return sitemap
}

function generateRobots() {
  return `User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 1

User-agent: Yandexbot
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# AI Search Engines
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# Common crawlers
User-agent: *
Allow: /
Crawl-delay: 2

# Sitemap location
Sitemap: https://sumitmitra255.github.io/sumit-mitra/sitemap.xml
`
}

// Run the generation
generateStaticPages().catch(console.error)
