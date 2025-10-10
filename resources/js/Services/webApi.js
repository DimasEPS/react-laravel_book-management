// Web API Service for session-based authentication

class WebApiService {
    constructor() {
        this.baseURL = "/ajax";
    }

    // Get CSRF token from meta tag
    getCsrfToken() {
        return document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
    }

    // Get headers with CSRF token
    getHeaders() {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        const csrfToken = this.getCsrfToken();
        if (csrfToken) {
            headers["X-CSRF-TOKEN"] = csrfToken;
        }

        return headers;
    }

    // Generic request method
    async request(url, options = {}) {
        const config = {
            headers: this.getHeaders(),
            credentials: "same-origin", // Include cookies for session
            ...options,
        };

        try {
            const response = await fetch(`${this.baseURL}${url}`, config);

            // Handle non-JSON responses
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { message: response.statusText };
            }

            if (!response.ok) {
                if (response.status === 401) {
                    // Redirect to login if unauthorized
                    window.location.href = "/login";
                    return;
                }
                throw new Error(data.message || "Something went wrong");
            }

            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    // Book CRUD methods
    async getBooks() {
        return this.request("/books");
    }

    async getBook(id) {
        return this.request(`/books/${id}`);
    }

    async createBook(bookData) {
        return this.request("/books", {
            method: "POST",
            body: JSON.stringify(bookData),
        });
    }

    async updateBook(id, bookData) {
        return this.request(`/books/${id}`, {
            method: "PUT",
            body: JSON.stringify(bookData),
        });
    }

    async deleteBook(id) {
        return this.request(`/books/${id}`, {
            method: "DELETE",
        });
    }

    // Check if user is authenticated (session-based)
    isAuthenticated() {
        // For session-based auth, we'll rely on server-side checks
        // This method is mainly for compatibility with existing code
        return true;
    }

    // Logout via form submission to handle CSRF properly
    logout() {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";

        const csrfInput = document.createElement("input");
        csrfInput.type = "hidden";
        csrfInput.name = "_token";
        csrfInput.value = this.getCsrfToken();
        form.appendChild(csrfInput);

        document.body.appendChild(form);
        form.submit();
    }
}

export default new WebApiService();
