import React, { useEffect, useState } from "react";
import API from "../api";
import useAuth from "../hooks/useAuth";

export default function Books() {
  const auth = useAuth();
  const userRole = auth?.userRole || null;
  const isLoggedIn = auth?.isLoggedIn || false;

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Pagination & Loading State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch books with filters & pagination
  const fetchBooks = async (currentPage = 1, reset = false) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchQuery || "",
        // category: category || "",
        department: department || "",
        page: currentPage,
        limit: 25
      }).toString();

      const res = await API.get(`/api/books?${queryParams}`);
      
      // robust data extraction
      const data = res.data || {};
      const newBooks = Array.isArray(data.books) ? data.books : [];
      const more = !!data.hasMore;

      if (reset) {
        setBooks(newBooks);
        setPage(1);
      } else {
        setBooks((prev) => [...(prev || []), ...newBooks]);
        setPage(currentPage);
      }
      setHasMore(more);
      setMessage({ text: "", type: "" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to fetch books.", type: "error" });
      if (reset) setBooks([]); // Ensure books is valid array on error
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch available categories and departments dynamically
  const fetchFilters = async () => {
    try {
      const [
        // catRes, 
        depRes] = await Promise.all([
        // API.get("/api/books/categories"),
        API.get("/api/books/departments"),
      ]);
      // setCategories(catRes.data || []);
      setDepartments(depRes.data || []);
    } catch (err) {
      console.error("Failed to fetch filter data:", err);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchFilters();
    // Initial fetch handled by the filter effect below
  }, []);

  // ✅ Auto-update books when search/filter changes (with debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBooks(1, true); // Reset to page 1
    }, 500); // 0.5s debounce

    return () => clearTimeout(delay);
  }, [searchQuery, 
    // category,
     department]);

  // ✅ Load More Handler
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBooks(page + 1, false);
    }
  };

  // ✅ Handle book request
  const handleRequest = async (bookId, title) => {
    if (!isLoggedIn) {
      setMessage({ text: "Please log in to request a book.", type: "error" });
      return;
    }

    setMessage({ text: `Requesting "${title}"...`, type: "info" });
    try {
      await API.post(`/api/issues/request/${bookId}`);
      setMessage({
        text: `Successfully requested "${title}". Check 'My Books' for status.`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        text:
          err.response?.data?.msg ||
          "Request failed. You might have already issued this book.",
        type: "error",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 pb-20">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-4 border-red-600 inline-block pb-2">
        📚 Book Catalog
      </h2>

      {/* 🔍 Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-8">
        {/* Live Search */}
        <input
          type="text"
          placeholder="Search by Title or Author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />

        {/* Dynamic Department Filter */}
        {/* <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">All Departments</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select> */}
      </div>

      {/* ⚠️ Message */}
      {message.text && (
        <div
          className={`p-3 mb-6 rounded-lg text-sm font-medium ${
            message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 📖 Book List */}
      {(!books || books.length === 0) && !loading ? (
        <p className="text-gray-600 text-center mt-10 text-lg">
          No books found. Try changing search or filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
          {books && books.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600 italic mb-3">
                  by {b.author}
                </p>
                <p className="text-sm font-medium mb-2">
                  Available:{" "}
                  <span
                    className={`${
                      b.copiesAvailable > 0
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }`}
                  >
                    {b.copiesAvailable}
                  </span>
                </p>
                {/* <p className="text-xs text-gray-500 mb-4">
                  Department: {b.department || "N/A"}
                </p> */}

                {!isLoggedIn && (
                  <button className="w-full bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg cursor-not-allowed">
                    Login to Request
                  </button>
                )}

                {isLoggedIn && b.copiesAvailable > 0 && (
                  <button
                    onClick={() => handleRequest(b._id, b.title)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition duration-150"
                  >
                    Request Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🌀 Loader */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
        </div>
      )}

      {/* 🔽 Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105"
          >
            Load More Books
          </button>
        </div>
      )}
    </div>
  );
}
