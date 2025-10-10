import React, { useState } from "react";

const BookForm = ({ book = null, onSubmit, onCancel, loading = false }) => {
    const [formData, setFormData] = useState({
        title: book?.title || "",
        author: book?.author || "",
        description: book?.description || "",
        year: book?.year || "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Judul buku wajib diisi";
        }

        if (!formData.author.trim()) {
            newErrors.author = "Nama penulis wajib diisi";
        }

        if (
            formData.year &&
            (isNaN(formData.year) ||
                formData.year < 1000 ||
                formData.year > new Date().getFullYear())
        ) {
            newErrors.year = "Tahun harus berupa angka yang valid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Convert year to integer if provided
        const submitData = {
            ...formData,
            year: formData.year ? parseInt(formData.year) : null,
        };

        onSubmit(submitData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {book ? "Edit Buku" : "Tambah Buku Baru"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Judul Buku *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    errors.title
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Masukkan judul buku"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="author"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Penulis *
                            </label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    errors.author
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Masukkan nama penulis"
                            />
                            {errors.author && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.author}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="year"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tahun Terbit
                            </label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    errors.year
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Contoh: 2023"
                                min="1000"
                                max={new Date().getFullYear()}
                            />
                            {errors.year && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.year}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Deskripsi
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Masukkan deskripsi buku (opsional)"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading
                                    ? "Menyimpan..."
                                    : book
                                    ? "Update"
                                    : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookForm;
