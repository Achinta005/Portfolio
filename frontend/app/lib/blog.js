const blogPosts = [
  {
    id: 1,
    title: "Building Modern Web Applications with React and TypeScript",
    slug: "building-modern-web-apps-react-typescript",
    excerpt: "Exploring the powerful combination of React and TypeScript for creating scalable, maintainable web applications. Learn about best practices, common patterns, and how to set up your development environment.",
    content: `
      <h2>Why React + TypeScript?</h2>
      <p>The marriage of React's component-based architecture with TypeScript's static typing brings several advantages:</p>
      
      <p><strong>Type Safety:</strong> Catch errors at compile time rather than runtime, leading to more robust applications.</p>
      
      <p><strong>Better Developer Experience:</strong> Enhanced IntelliSense, autocomplete, and refactoring capabilities in your IDE.</p>
      
      <p><strong>Self-Documenting Code:</strong> Type definitions serve as inline documentation, making your code more readable and maintainable.</p>
      
      <p><strong>Easier Refactoring:</strong> Large-scale changes become less risky with the compiler catching breaking changes.</p>
      
      <h2>Setting Up Your Development Environment</h2>
      <p>Getting started with React and TypeScript is straightforward. Here's my recommended setup:</p>
      
      <pre><code>npx create-react-app my-app --template typescript
cd my-app
npm start</code></pre>
      
      <p>For more control over your build process, I recommend using Vite:</p>
      
      <pre><code>npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev</code></pre>
      
      <h2>Key Patterns and Best Practices</h2>
      
      <h3>1. Component Props with Interfaces</h3>
      <p>Always define interfaces for your component props:</p>
      
      <pre><code>interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  children 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant} btn-\${size}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};</code></pre>
      
      <h3>2. Custom Hooks with TypeScript</h3>
      <p>Custom hooks become more powerful with proper typing:</p>
      
      <pre><code>interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}</code></pre>
      
      <h2>Common Pitfalls to Avoid</h2>
      <p><strong>Over-typing:</strong> Don't add types to everything. Let TypeScript infer when possible.</p>
      
      <p><strong>Any abuse:</strong> Avoid using <code>any</code> type. Use <code>unknown</code> or proper union types instead.</p>
      
      <p><strong>Missing null checks:</strong> Always handle potential null/undefined values, especially with API data.</p>
      
      <p><strong>Ignoring compiler warnings:</strong> TypeScript warnings are there for a reason. Address them promptly.</p>
      
      <h2>Conclusion</h2>
      <p>The React and TypeScript combination has transformed how I approach frontend development. The initial learning curve pays dividends in code quality, maintainability, and developer productivity.</p>
      
      <p>Start small, gradually adopt TypeScript patterns, and you'll find yourself writing more confident, bug-free code. The ecosystem continues to evolve, with excellent tooling and community support making this stack a joy to work with.</p>
    `,
    date: "2024-12-15",
    readTime: "8 min read",
    tags: ["React", "TypeScript", "Web Development", "Frontend"]
  },
  {
    id: 2,
    title: "The Future of Web Development: Trends to Watch",
    slug: "future-web-development-trends",
    excerpt: "Exploring emerging technologies and methodologies that are shaping the future of web development, from AI integration to progressive web apps.",
    content: `
      <h2>Introduction</h2>
      <p>The web development landscape is constantly evolving, with new technologies, frameworks, and methodologies emerging regularly. As we look ahead, several key trends are shaping how we build and interact with web applications.</p>
      
      <h2>AI-Powered Development</h2>
      <p>Artificial Intelligence is revolutionizing how we write code, debug applications, and optimize performance. From GitHub Copilot to AI-assisted testing, developers are becoming more productive than ever.</p>
      
      <h2>Progressive Web Apps (PWAs)</h2>
      <p>PWAs continue to bridge the gap between web and native applications, offering offline functionality, push notifications, and app-like experiences through the browser.</p>
      
      <h2>WebAssembly Growth</h2>
      <p>WebAssembly is enabling high-performance applications in the browser, allowing languages like Rust, C++, and Go to run at near-native speeds in web environments.</p>
      
      <h2>Serverless Architecture</h2>
      <p>Edge computing and serverless functions are changing how we deploy and scale applications, offering better performance and reduced infrastructure costs.</p>
      
      <h2>Conclusion</h2>
      <p>These trends represent just the beginning of what's possible in web development. Staying informed and adaptable is key to thriving in this rapidly evolving field.</p>
    `,
    date: "2024-12-10",
    readTime: "6 min read",
    tags: ["Web Development", "Trends", "Technology", "AI"]
  },
  {
    id: 3,
    title: "Optimizing Performance in React Applications",
    slug: "optimizing-react-performance",
    excerpt: "Practical strategies for improving the performance of your React applications, including code splitting, memoization, and bundle optimization.",
    content: `
      <h2>Introduction</h2>
      <p>React applications can become slow and unresponsive if not properly optimized. This guide covers essential techniques to keep your React apps running smoothly.</p>
      
      <h2>Code Splitting</h2>
      <p>Break your application into smaller chunks that load only when needed:</p>
      
      <pre><code>const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}</code></pre>
      
      <h2>Memoization</h2>
      <p>Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders:</p>
      
      <pre><code>const ExpensiveComponent = React.memo(({ data }) => {
  const expensiveValue = useMemo(() => {
    return processData(data);
  }, [data]);
  
  return <div>{expensiveValue}</div>;
});</code></pre>
      
      <h2>Bundle Optimization</h2>
      <p>Analyze and optimize your bundle size using tools like webpack-bundle-analyzer and implement tree shaking to remove unused code.</p>
      
      <h2>Virtual Scrolling</h2>
      <p>For large lists, implement virtual scrolling to render only visible items, significantly improving performance with large datasets.</p>
      
      <h2>Conclusion</h2>
      <p>Performance optimization is an ongoing process. Profile your application regularly and apply these techniques where they'll have the most impact.</p>
    `,
    date: "2024-12-05",
    readTime: "10 min read",
    tags: ["React", "Performance", "Optimization", "Frontend"]
  }
];

export function getAllPosts() {
  return blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  return blogPosts.find(post => post.slug === slug);
}

export function getPostsByTag(tag) {
  return blogPosts.filter(post => post.tags.includes(tag));
}