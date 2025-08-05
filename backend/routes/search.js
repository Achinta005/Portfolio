import { Router } from "express";
import { typesenseClient } from "../config/typesense";
const router = Router();

// Page configurations for your specific pages
const pageConfigs = [
  {
    id: "home",
    title: "Home - Portfolio Website",
    description:
      "Welcome to my portfolio showcasing web development projects and skills",
    url: "/",
    category: "main",
    searchPriority: 10,
    keywords: [
      "home",
      "portfolio",
      "developer",
      "freelancer",
      "hire",
      "main",
      "landing",
      "welcome",
      "start",
    ],
    content:
      "This is the main landing page featuring hero section, featured projects, skills overview, and contact information. Perfect entry point for visitors to learn about my work.",
  },
  {
    id: "about",
    title: "About Me - Developer Profile & Experience",
    description:
      "Learn about my background, technical skills, experience, and journey as a developer",
    url: "/about",
    category: "info",
    searchPriority: 9,
    keywords: [
      "about",
      "profile",
      "experience",
      "skills",
      "background",
      "resume",
      "cv",
      "bio",
      "who am i",
      "developer",
      "contact",
    ],
    content:
      "Detailed information about my professional background, technical expertise, education, work experience, and personal interests. Includes downloadable resume and contact details.",
  },
  {
    id: "projects",
    title: "Projects - Development Portfolio & Work Showcase",
    description:
      "Explore my web development projects, GitHub repositories, and technical achievements",
    url: "/projects",
    category: "portfolio",
    searchPriority: 9,
    keywords: [
      "projects",
      "portfolio",
      "work",
      "development",
      "code",
      "github",
      "showcase",
      "apps",
      "demos",
      "live sites",
      "source code",
    ],
    content:
      "Comprehensive showcase of my development projects including web applications, mobile apps, and open source contributions. Each project includes live demos, source code, and technical details.",
  },
  {
    id: "blogs",
    title: "Blog - Tech Articles, Tutorials & Programming Insights",
    description:
      "Read my blog posts about web development, programming tutorials, and technology insights",
    url: "/blogs",
    category: "content",
    searchPriority: 8,
    keywords: [
      "blog",
      "articles",
      "posts",
      "tutorials",
      "writing",
      "tech",
      "programming",
      "guides",
      "latest",
      "news",
      "learn",
      "tips",
    ],
    content:
      "Regular blog posts covering web development tutorials, programming best practices, technology reviews, and industry insights. Updated frequently with practical coding examples and tips.",
  },
];

// Build search index endpoint
router.post("/build-index", async (req, res) => {
  try {
    console.log("Building search index...");

    // Prepare page data
    const enhancedPages = pageConfigs.map((page) => ({
      ...page,
      lastUpdated: Date.now(),
    }));

    // Create collection schema
    const schema = {
      name: "website_pages",
      fields: [
        { name: "title", type: "string" },
        { name: "description", type: "string" },
        { name: "content", type: "string" },
        { name: "url", type: "string" },
        { name: "keywords", type: "string[]" },
        { name: "category", type: "string", facet: true },
        { name: "searchPriority", type: "int32" },
        { name: "lastUpdated", type: "int64" },
      ],
    };

    // Delete existing collection if exists
    try {
      await typesenseClient.collections("website_pages").delete();
      console.log("Deleted existing collection");
    } catch (e) {
      console.log("Creating new collection");
    }

    // Create new collection
    await typesenseClient.collections().create(schema);
    console.log("Collection created successfully");

    // Index all pages
    const indexResponse = await typesenseClient
      .collections("website_pages")
      .documents()
      .import(enhancedPages);

    console.log("Pages indexed successfully");

    // Check for any indexing errors
    const hasErrors = indexResponse.some((result) => !result.success);
    if (hasErrors) {
      console.warn("Some documents had indexing errors:", indexResponse);
    }

    res.json({
      success: true,
      message: "Search index built successfully",
      indexed: enhancedPages.length,
      pages: enhancedPages.map((p) => ({
        id: p.id,
        title: p.title,
        url: p.url,
        keywords: p.keywords.length,
      })),
      indexResponse: indexResponse,
    });
  } catch (error) {
    console.error("Build index error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Main search endpoint
router.get("/search", async (req, res) => {
  try {
    const { q, limit = 10, category, sort } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    // Build search parameters
    const searchParams = {
      q: q.trim(),
      query_by: "title,description,content,keywords",
      highlight_fields: "title,description,content",
      highlight_start_tag: "<mark>",
      highlight_end_tag: "</mark>",
      snippet_threshold: 30,
      num_typos: 2, // Auto spell correction
      typo_tokens_threshold: 1,
      drop_tokens_threshold: 1,
      sort_by: sort || "searchPriority:desc,_text_match:desc",
      per_page: Math.min(parseInt(limit), 50), // Max 50 results
      facet_by: "category",
    };

    // Add category filter if specified
    if (category && category !== "all") {
      searchParams.filter_by = `category:${category}`;
    }

    console.log(`🔍 Searching for: "${q}" with params:`, searchParams);

    const searchResults = await typesenseClient
      .collections("website_pages")
      .documents()
      .search(searchParams);

    // Format results
    const results = searchResults.hits.map((hit) => ({
      id: hit.document.id,
      title: hit.document.title,
      description: hit.document.description,
      url: hit.document.url,
      category: hit.document.category,
      highlights: hit.highlights || [],
      score: hit.text_match_info?.score || 0,
      searchPriority: hit.document.searchPriority,
    }));

    console.log(`Found ${results.length} results for "${q}"`);

    res.json({
      success: true,
      results,
      total: searchResults.found,
      searchTime: searchResults.search_time_ms,
      facets: searchResults.facet_counts || [],
      query: q,
      page: 1,
      totalPages: Math.ceil(searchResults.found / parseInt(limit)),
    });
  } catch (error) {
    console.error("🔍 Search error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Autocomplete endpoint
router.get("/autocomplete", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: [],
      });
    }

    console.log(`💡 Getting autocomplete for: "${q}"`);

    const searchResults = await typesenseClient
      .collections("website_pages")
      .documents()
      .search({
        q: q.trim(),
        query_by: "title,keywords",
        prefix: true,
        num_typos: 1,
        per_page: 5,
        sort_by: "searchPriority:desc,_text_match:desc",
      });

    const suggestions = searchResults.hits.map((hit) => ({
      text: hit.document.title,
      url: hit.document.url,
      category: hit.document.category,
      id: hit.document.id,
    }));

    res.json({
      success: true,
      suggestions,
      query: q,
    });
  } catch (error) {
    console.error("💡 Autocomplete error:", error);
    res.json({
      success: true,
      suggestions: [],
      error: error.message,
    });
  }
});

// Add new page endpoint
router.post("/add-page", async (req, res) => {
  try {
    const {
      title,
      description,
      url,
      keywords = [],
      category = "general",
      content,
      searchPriority = 5,
    } = req.body;

    // Validate required fields
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: "Title and URL are required fields",
      });
    }

    const newPage = {
      id: url.replace(/\//g, "-").replace(/^-/, "") || `page-${Date.now()}`,
      title,
      description: description || title,
      url,
      keywords: Array.isArray(keywords) ? keywords : [],
      category,
      content: content || description || title,
      searchPriority: parseInt(searchPriority),
      lastUpdated: Date.now(),
    };

    console.log("Adding new page:", newPage.id);

    const result = await typesenseClient
      .collections("website_pages")
      .documents()
      .create(newPage);

    res.json({
      success: true,
      message: "Page added to search index successfully",
      page: newPage,
      result: result,
    });
  } catch (error) {
    console.error("Add page error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Update existing page endpoint
router.put("/update-page/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      lastUpdated: Date.now(),
    };

    console.log(`Updating page: ${id}`);

    const result = await typesenseClient
      .collections("website_pages")
      .documents(id)
      .update(updates);

    res.json({
      success: true,
      message: "Page updated successfully",
      result: result,
    });
  } catch (error) {
    console.error("Update page error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Delete page endpoint
router.delete("/delete-page/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Deleting page: ${id}`);

    await typesenseClient.collections("website_pages").documents(id).delete();

    res.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

// Get all pages endpoint
router.get("/pages", async (req, res) => {
  try {
    console.log("Fetching all pages");

    const searchResults = await typesenseClient
      .collections("website_pages")
      .documents()
      .search({
        q: "*",
        per_page: 250,
        sort_by: "searchPriority:desc",
      });

    const pages = searchResults.hits.map((hit) => hit.document);

    res.json({
      success: true,
      pages,
      total: searchResults.found,
    });
  } catch (error) {
    console.error("Get pages error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check for search service
router.get("/health", async (req, res) => {
  try {
    const health = await typesenseClient.health.retrieve();
    const collections = await typesenseClient.collections().retrieve();

    res.json({
      success: true,
      typesense: health,
      collections: collections.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
