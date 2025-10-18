// Web API Service for session-based authentication
import axios from "axios";

class WebApiService {
    constructor() {
        this.baseURL = "/api";
        this.setupAxiosDefaults();
    }

    // Setup axios default configuration
    setupAxiosDefaults() {
        // Set default base URL
        axios.defaults.baseURL = this.baseURL;

        // Set default headers
        axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        axios.defaults.headers.common["Accept"] = "application/json";
        axios.defaults.headers.common["Content-Type"] = "application/json";

        // Include cookies with requests
        axios.defaults.withCredentials = true;

        // Setup CSRF token
        const token = this.getCsrfToken();
        if (token) {
            axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
        }

        // Setup response interceptor for error handling
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    if (error.response.status === 401) {
                        // Redirect to login if unauthorized
                        window.location.href = "/login";
                        return Promise.reject(error);
                    } else if (error.response.status === 419) {
                        // CSRF token mismatch - reload the page to get a fresh token
                        console.error("CSRF token mismatch - reloading page");
                        window.location.reload();
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // Get CSRF token from meta tag
    getCsrfToken() {
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        if (!token) {
            console.error("CSRF token not found in meta tag");
        }

        return token;
    }

    // Update CSRF token in axios headers
    updateCsrfToken() {
        const token = this.getCsrfToken();
        if (token) {
            axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
        }
    }

    // Generic request method using axios
    async request(url, options = {}) {
        try {
            const config = {
                url: url,
                ...options,
            };

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error("API Error:", error);

            // Handle specific error cases
            if (error.response) {
                const { status, data } = error.response;

                if (status === 422) {
                    // Validation error
                    console.error("Validation error:", data);
                }

                throw new Error(
                    data.message ||
                        `HTTP ${status}: ${error.response.statusText}`
                );
            } else if (error.request) {
                // Network error
                throw new Error("Network error: Please check your connection");
            } else {
                // Other error
                throw new Error(error.message || "Something went wrong");
            }
        }
    }

    // Book CRUD methods
    async getBooks() {
        return this.request("/books", {
            method: "GET",
        });
    }

    async getBook(id) {
        return this.request(`/books/${id}`, {
            method: "GET",
        });
    }

    async createBook(bookData) {
        return this.request("/books", {
            method: "POST",
            data: bookData,
        });
    }

    async updateBook(id, bookData) {
        return this.request(`/books/${id}`, {
            method: "PUT",
            data: bookData,
        });
    }

    async deleteBook(id) {
        return this.request(`/books/${id}`, {
            method: "DELETE",
        });
    }

    // Refresh CSRF token by making a request to get a new one
    async refreshCsrfToken() {
        try {
            const response = await axios.get("/csrf-token", {
                withCredentials: true,
            });

            if (response.data && response.data.csrf_token) {
                // Update the meta tag with new token
                const metaTag = document.querySelector(
                    'meta[name="csrf-token"]'
                );
                if (metaTag) {
                    metaTag.setAttribute("content", response.data.csrf_token);
                }

                // Update axios default headers
                this.updateCsrfToken();

                return response.data.csrf_token;
            }
        } catch (error) {
            console.error("Failed to refresh CSRF token:", error);
        }
        return null;
    }

    // Check if user is authenticated (session-based)
    isAuthenticated() {
        // For session-based auth, we'll rely on server-side checks
        // This method is mainly for compatibility with existing code
        return true;
    }

    // Logout using axios
    async logout() {
        try {
            await axios.post("/logout");
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback to form submission if axios fails
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
}

export default new WebApiService();
