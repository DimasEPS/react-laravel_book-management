import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BookList from "@/Components/Books/BookList";
import BookForm from "@/Components/Books/BookForm";
import DeleteConfirmation from "@/Components/Books/DeleteConfirmation";
import webApiService from "@/Services/webApi";

export default function BookManagement({ auth }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [deletingBook, setDeletingBook] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Load books on component mount
    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await webApiService.getBooks();
            setBooks(data);
        } catch (err) {
            setError("Gagal memuat data buku: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = () => {
        setEditingBook(null);
        setShowForm(true);
    };

    const handleEditBook = (book) => {
        setEditingBook(book);
        setShowForm(true);
    };

    const handleDeleteBook = (book) => {
        setDeletingBook(book);
        setShowDeleteConfirm(true);
    };

    const handleFormSubmit = async (bookData) => {
        try {
            setFormLoading(true);
            setError("");

            if (editingBook) {
                await webApiService.updateBook(editingBook.id, bookData);
                setSuccess("Buku berhasil diperbarui!");
            } else {
                await webApiService.createBook(bookData);
                setSuccess("Buku berhasil ditambahkan!");
            }

            setShowForm(false);
            setEditingBook(null);
            await loadBooks();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Gagal menyimpan buku: " + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setFormLoading(true);
            setError("");

            await webApiService.deleteBook(deletingBook.id);
            setSuccess("Buku berhasil dihapus!");
            setShowDeleteConfirm(false);
            setDeletingBook(null);
            await loadBooks();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Gagal menghapus buku: " + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingBook(null);
        setError("");
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setDeletingBook(null);
    };

    // Filter books based on search term
    const filteredBooks = books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.description &&
                book.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
    );

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Buku
                </h2>
            }
        >
            <Head title="Manajemen Buku" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Dashboard Buku
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Kelola koleksi buku Anda dengan mudah
                                    </p>
                                </div>
                                <button
                                    onClick={handleAddBook}
                                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Tambah Buku
                                </button>
                            </div>                            {/* Search Section */}
                            <div className="mb-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Cari buku berdasarkan judul, penulis, atau deskripsi..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Alert Messages */}
                            {error && (
                                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                    <span className="block sm:inline">
                                        {error}
                                    </span>
                                    <span
                                        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                                        onClick={clearMessages}
                                    >
                                        <svg
                                            className="fill-current h-6 w-6 text-red-500"
                                            role="button"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <title>Close</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </span>
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                    <span className="block sm:inline">
                                        {success}
                                    </span>
                                    <span
                                        className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                                        onClick={clearMessages}
                                    >
                                        <svg
                                            className="fill-current h-6 w-6 text-green-500"
                                            role="button"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <title>Close</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </span>
                                </div>
                            )}

                            {/* Stats Section */}
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-blue-600 text-sm font-medium">
                                        Total Buku
                                    </div>
                                    <div className="text-blue-900 text-2xl font-bold">
                                        {books.length}
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-green-600 text-sm font-medium">
                                        Hasil Pencarian
                                    </div>
                                    <div className="text-green-900 text-2xl font-bold">
                                        {filteredBooks.length}
                                    </div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-purple-600 text-sm font-medium">
                                        Penulis Unik
                                    </div>
                                    <div className="text-purple-900 text-2xl font-bold">
                                        {
                                            new Set(
                                                books.map((book) => book.author)
                                            ).size
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Book List */}
                            <BookList
                                books={filteredBooks}
                                onEdit={handleEditBook}
                                onDelete={handleDeleteBook}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showForm && (
                <BookForm
                    book={editingBook}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                    loading={formLoading}
                />
            )}

            {showDeleteConfirm && deletingBook && (
                <DeleteConfirmation
                    book={deletingBook}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    loading={formLoading}
                />
            )}
        </AuthenticatedLayout>
    );
}
