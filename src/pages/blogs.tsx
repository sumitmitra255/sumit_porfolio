import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import blogData from "@/data/blogData.json";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogData.find((p: BlogPost) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main>
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 animate-gradient"></div>
          
          {/* Floating elements for visual interest */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto py-20">
              <div className="text-center fade-in">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  Blog post <span className="gradient-text">not found</span>
                </h1>
                <p className="text-muted-foreground text-lg mb-8">The blog post you're looking for doesn't exist.</p>
                <Link 
                  to="/blog" 
                  className="inline-flex items-center glass-card px-6 py-3 rounded-full font-medium text-primary hover-lift"
                >
                  ← Back to blog
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10 animate-gradient"></div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto py-20">
            <article className="fade-in">
              <header className="mb-12">
                <div className="text-center mb-8">
                  <span className="inline-block px-4 py-2 glass-card text-sm font-medium text-primary mb-4 rounded-full">
                    {post.date} • {post.readTime}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-6 leading-tight">
                  <span className="gradient-text">{post.title}</span>
                </h1>
                
                <div className="flex items-center justify-center text-muted-foreground mb-6">
                  <span>By {post.author}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>
              
              <div className="space-y-6 fade-in">
                <div className="glass-card rounded-xl p-8 fade-in">
                  <h3 className="text-xl font-heading font-semibold mb-3 text-primary">Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{post.summary}</p>
                </div>
                
                <div className="glass-card rounded-xl p-8 fade-in">
                  <h3 className="text-xl font-heading font-semibold mb-3 text-primary">Content</h3>
                  <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                    {post.content}
                  </div>
                </div>
              </div>

              <div className="text-center mt-12 fade-in">
                <Link 
                  to="/blog" 
                  className="inline-flex items-center glass-card px-6 py-3 rounded-full font-medium text-primary hover-lift"
                >
                  ← Back to blog
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
