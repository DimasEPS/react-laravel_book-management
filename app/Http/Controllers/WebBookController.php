<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class WebBookController extends Controller
{
    /**
     * Display a listing of books as JSON for AJAX requests
     */
    public function index()
    {
        return response()->json(Book::all());
    }

    /**
     * Store a newly created book
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'nullable|integer|min:1000|max:' . date('Y'),
        ]);

        $book = Book::create($request->all());
        return response()->json($book, 201);
    }

    /**
     * Display the specified book
     */
    public function show(Book $book)
    {
        return response()->json($book);
    }

    /**
     * Update the specified book
     */
    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'nullable|string',
            'year' => 'nullable|integer|min:1000|max:' . date('Y'),
        ]);

        $book->update($request->all());
        return response()->json($book);
    }

    /**
     * Remove the specified book
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }
}
