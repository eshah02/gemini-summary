import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// GET ALL TASKS
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("TodoDB");

    const tasks = await db.collection("tasks").find({}).toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ADD TASK WITH SUMMARY
export async function POST(request) {
  try {
    const { title, description = "" } = await request.json();

    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    // --- Generate Summary (Gemini 2.5 Flash) ---
    let summary = "Summary not available";
    if (genAI) {
      try {
        const prompt = `
          Generate a concise one-sentence summary for this task:
          Title: "${title}"
          Details: "${description}"
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        summary = result.response.text();
      } catch (err) {
        console.error("Gemini Error:", err);
      }
    }

    // --- Insert into MongoDB ---
    const client = await clientPromise;
    const db = client.db("TodoDB");

    const newTask = {
      title,
      description,
      summary,
      done: false,
      createdAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(newTask);

    return NextResponse.json({ ...newTask, _id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE TASK (DONE)
export async function PUT(request) {
  try {
    const { id, done } = await request.json();

    const client = await clientPromise;
    const db = client.db("TodoDB");

    await db.collection("tasks").updateOne(
      { _id: new ObjectId(id) },
      { $set: { done } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE TASK
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const client = await clientPromise;
    const db = client.db("TodoDB");

    await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
