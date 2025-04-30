<?php

use App\Http\Controllers\ChapterController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get("/docs",function(){
    return '';
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

// Route::get('/stream', function () {
//     return \response()->stream(function () {

//         echo str_repeat('T', random_int(1, 1000));
//         flush();
//         sleep(2);
//         echo str_repeat('E', random_int(1, 1000));
//         flush();
//         sleep(2);
//         echo str_repeat('S', random_int(1, 1000));
//         flush();
//         sleep(2);
//         echo str_repeat('T', random_int(1, 1000));
//         flush();

//         sleep(2);
//         echo 'done';
//     });
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'document' => Auth::user()->document
    ]);
})->middleware(['auth'])->name('dashboard');
Route::get('/test', function () {
    return  Inertia::render('Tes', ['name' => 'jefyokta', "chapter" => [
        "number" => 1,
        "text" => "PENDAHULUAN"
    ]]);
});
Route::middleware('auth')->group(function () {
    Route::post('/image', [ImageController::class, 'store'])->name('image.store');
    Route::get('/image', [ImageController::class, "images"])->name("image");
    Route::get('/image/{image}', [ImageController::class, "show"])->name("image.show");

    Route::get("/images", [ImageController::class, 'index'])->name('image.index');

    Route::get('/test', [DocumentController::class, 'compile']);
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
            Route::get('/{chapter}', [ChapterController::class, 'showChapter'])->name('document.show');
            Route::get('/{chapter}/raw', [ChapterController::class, 'raw'])->name('document.raw');
            Route::get("/abstract");
            Route::get('/settings');
        });
    });
});



require __DIR__ . '/auth.php';
