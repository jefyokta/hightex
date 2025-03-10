<?php

use App\Http\Controllers\ChapterController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }

    return back()->withErrors([
        'email' => 'Email atau password salah.',
    ]);
});


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');
Route::get('/test', function () {
    return  Inertia::render('Tes', ['name' => 'jefyokta', "chapter" => [
        "number" => 1,
        "text" => "PENDAHULUAN"
    ]]);
});
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::prefix('/document')->group(function () {
        Route::get('/', [DocumentController::class, 'index'])->name('document');
        Route::get("/create", [DocumentController::class, 'create']);
        Route::post("/", [DocumentController::class, 'store'])->name('document.store');
        Route::post('/{chapter}', [DocumentController::class, 'save']);
        Route::prefix("/{document}")->group(function () {
            Route::delete('/', [DocumentController::class, 'delete'])->name('document.delete');
            Route::get('/{chapter}', [ChapterController::class, 'showChapter']);
            Route::get("/abstract");
            Route::get('/settings');
        });
    });
});



require __DIR__ . '/auth.php';
