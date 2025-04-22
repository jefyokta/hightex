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
        $images = Image::where("user_id", Auth::user()->id)->get();

        return Inertia::render('Images/Images', ["images" => $images]);
    }


    public function show(Image $image)
    {
        if ($image->user_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $path = "images/{$image->name}";

        if (!Storage::disk('local')->exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $content = Storage::disk('local')->get($path);

        $mime = Storage::mimeType($path);
        // $mime = $c->mimeType($path);

        return response($content, 200)->header('Content-Type', $mime);
    }


    public function images()
    {
        $images = Image::where("user_id", Auth::user()->id)->get()->pluck('id');


        return response()->json(["data" => $images]);
    }
    public function store(Request $request)
    {
        $user = Auth::user();
        // dd($request);
        $request->validate(["image" => 'required|image|mimes:jpg,jpeg,png|max:2048']);
        $image = $request->file('image');
        $size = $image->getSize();
        $currentTotal = Image::where('user_id', $user->id)->sum('size');

        if (($currentTotal + $size) > $this->maxTotalImg) {
            return back()->with('error', 'Total image size exceeds limit');
        }

        $filename = uniqid() . '.' . $image->getClientOriginalExtension();

        Storage::disk('local')->putFileAs("images", $image, $filename);

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
