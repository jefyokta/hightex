<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['title', 'author', 'keywords', 'abstract', 'id'];

    protected $casts = ['id' => 'string'];


    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'author');
    }
}
