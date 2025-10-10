import React from "react";

const BookCard = ({ book, onEdit, onDelete }) => {
    return (
        <div className="book-card bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-all duration-200">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                            {book.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            oleh {book.author}
                        </p>
                        {book.year && (
                            <p className="text-sm text-gray-500">
                                Tahun: {book.year}
                            </p>
                        )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                        <button
                            onClick={() => onEdit(book)}
                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            title="Edit buku"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(book)}
                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Hapus buku"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {book.description && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-700 line-clamp-3">
                            {book.description}
                        </p>
                    </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                    Ditambahkan:{" "}
                    {new Date(book.created_at).toLocaleDateString("id-ID")}
                </div>
            </div>
        </div>
    );
};

export default BookCard;
