import { Link } from "react-router-dom";
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

const Blog = () => {
  const posts = blogData;

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
          <div className="max-w-6xl mx-auto py-20">
            <header className="text-center mb-12 fade-in">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                <span className="gradient-text">Blog</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Thoughts, tutorials, and insights on web development and technology
              </p>
            </header>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className="glass-card rounded-xl overflow-hidden hover-lift fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-heading font-bold mb-3 hover:text-primary transition-colors">
                      <Link to={`/blogs/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">By {post.author}</span>
                      <Link
                        to={`/blogs/${post.slug}`}
                        className="text-primary hover:text-primary/80 font-medium text-sm font-heading"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
