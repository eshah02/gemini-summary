import clientPromise from '@/lib/mongodb.js';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.TODODB || 'NextTodo';
async function generateSummary(title, description) {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'YOUR_PRODUCTION_DOMAIN_HERE' 
        : 'http://localhost:3000';
    
    try {
        const summaryRes = await fetch(`${baseUrl}/api/summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        });

        if (!summaryRes.ok) {
            console.error("Failed to fetch summary from internal API. Status:", summaryRes.status);
            return 'Summary generation failed (API status error).';
        }

        const data = await summaryRes.json();
        return data.summary;
    } catch (e) {
        console.error("Failed to fetch summary internally:", e);
        return 'Summary generation failed (Network error).';
    }
}
// GET
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const tasks = await db.collection('tasks').find({}).toArray();

    const serializedTasks = tasks.map(task => ({
        ...task,
        _id: task._id.toString(),
    }));

    return NextResponse.json(serializedTasks, { status: 200 });

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: 'Error fetching tasks' }, { status: 500 });
  }
}

// POST
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const body = await request.json();

    if (!body.title) {
        return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const summaryText = await generateSummary(body.title, body.description);
    
    const newTask = {
      title: body.title,
      description: body.description || '',
      isDone: false,
      createdAt: new Date(),
      summary: summaryText, 
    };

    const result = await db.collection('tasks').insertOne(newTask);

    return NextResponse.json({
        ...newTask,
        _id: result.insertedId.toString()
    }, { status: 201 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: 'Error creating task' }, { status: 500 });
  }
}

//Update Task
export async function PATCH(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();

    if (!id || typeof body.isDone === 'undefined') {
        return NextResponse.json({ message: 'Task ID and new status are required' }, { status: 400 });
    }

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDone: body.isDone } }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });

  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
    }

    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: 'Error deleting task' }, { status: 500 });
  }
}