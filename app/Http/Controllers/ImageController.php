<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ImageController extends Controller
{

    protected $maxTotalImg = 10 * 1024 * 1024;


    public function index()
    {
        $images = Image::where("user_id", Auth::user()->id);

        return Inertia::render('Images/Images');
    }
    public function store(Request $request)
    {
        $user = Auth::user();
        $request->validate(['required|image|mimes:jpg,jpeg,png|max:2048']);

        $image = $request->file('image');
        $size = $image->getSize();
        $currentTotal = Image::where('user_id', $user->id)->sum('size');

        if (($currentTotal + $size) > $this->maxTotalImg) {
            return back()->with('error', 'Total image size exceeds limit');
        }

        $filename = uniqid() . '.' . $image->getClientOriginalExtension();
        Storage::disk('local')->putFile("images/{$filename}", $image);

        Image::create([
            'name' => $filename,
            'user_id' => $user?->id,
            'size' => $size
        ]);
    }

    public function delete(Image $image)
    {

        Storage::disk('local')->delete('images/' + $image->name);
        $image->delete();
    }
}
