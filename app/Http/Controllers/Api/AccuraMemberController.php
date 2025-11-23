<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccuraMemberRequest;
use App\Models\AccuraMember;
use Illuminate\Http\Request;

class AccuraMemberController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->query('q');
        $members = AccuraMember::when($q, fn($query) =>
            $query->where(function($q2) use ($q) {
                $q2->where('first_name', 'like', "%{$q}%")
                   ->orWhere('last_name', 'like', "%{$q}%")
                   ->orWhere('ds_division', 'like', "%{$q}%");
            })
        )->orderBy('id', 'desc')->paginate(10);

        return response()->json($members);
    }

    public function store(StoreAccuraMemberRequest $request)
    {
        $data = $request->validated();

        // Append " ACCURA" to last_name
        if (!str_ends_with($data['last_name'], 'ACCURA')) {
            $data['last_name'] = trim($data['last_name']) . ' ACCURA';
        }

        // Ensure summary contains ACCURA as text area
        $data['summary'] = 'ACCURA';

        $member = AccuraMember::create($data);

        return response()->json(['success' => true, 'member' => $member], 201);
    }

    public function show(AccuraMember $accura_member)
    {
        return response()->json($accura_member);
    }

    public function update(StoreAccuraMemberRequest $request, AccuraMember $member)
    {
        $data = $request->validated();

        if (!str_ends_with($data['last_name'], 'ACCURA')) {
            $data['last_name'] = trim($data['last_name']) . ' ACCURA';
        }

        // Do not overwrite summary unless you want to enforce 'ACCURA'
        $data['summary'] = 'ACCURA';

        $member->update($data);

        return response()->json(['success' => true, 'member' => $member]);
    }

    public function destroy(AccuraMember $member)
    {
        $member->delete();
        return response()->json(['success' => true]);
    }
}
