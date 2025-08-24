export async function getAllPosts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/api/blog/posts`, {
      cache: 'no-store', // Disable caching for fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    const posts = await response.json();
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/api/blog/posts/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch post');
    }
    
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostsByTag(tag) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/api/blog/posts/tag/${tag}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts by tag');
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}