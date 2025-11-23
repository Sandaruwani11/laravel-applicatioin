<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccuraMember extends Model
{
    protected $table = 'accura_members';
    protected $fillable = [
        'first_name',
        'last_name',
        'ds_division',
        'email',
        'summary'
    ];
}
