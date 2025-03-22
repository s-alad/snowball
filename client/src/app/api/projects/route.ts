import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET handler for retrieving all projects or a specific project
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        const client = await clientPromise
        const db = client.db('beantown')
        const collection = db.collection('projects')

        // If ID is provided, return a specific project
        if (id) {
            const project = await collection.findOne({ _id: new ObjectId(id) })
            if (!project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 })
            }
            return NextResponse.json(project)
        }

        // Otherwise, return all projects
        const projects = await collection.find({}).toArray()
        return NextResponse.json(projects)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST handler for creating a new project
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Basic validation
        if (!body.title || !body.description || !body.fundingGoal) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('beantown')
        const collection = db.collection('projects')

        // Format the project data
        const project = {
            title: body.title,
            description: body.description,
            category: body.category || 'Other',
            fundingGoal: Number(body.fundingGoal),
            raised: 0,
            backers: 0,
            duration: Number(body.duration) || 30,
            deadline: new Date(Date.now() + (body.duration || 30) * 24 * 60 * 60 * 1000),
            status: 'active',
            image: body.image || '',
            creator: body.creator || '',
            createdAt: new Date(),
            milestones: body.milestones || [],
            updates: [],
        }

        // Insert the new project
        const result = await collection.insertOne(project)

        return NextResponse.json({
            message: 'Project created successfully',
            id: result.insertedId,
            project: {
                ...project,
                _id: result.insertedId
            }
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating project:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// PATCH handler for updating an existing project
export async function PATCH(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
        }

        const body = await request.json()

        const client = await clientPromise
        const db = client.db('beantown')
        const collection = db.collection('projects')

        // Prepare the update data
        const updateData: any = {}

        // Only include fields that are being updated
        if (body.title) updateData.title = body.title
        if (body.description) updateData.description = body.description
        if (body.category) updateData.category = body.category
        if (body.fundingGoal) updateData.fundingGoal = Number(body.fundingGoal)
        if (body.duration) {
            updateData.duration = Number(body.duration)
            updateData.deadline = new Date(Date.now() + body.duration * 24 * 60 * 60 * 1000)
        }
        if (body.image) updateData.image = body.image
        if (body.milestones) updateData.milestones = body.milestones
        if (body.status) updateData.status = body.status

        // Update the project
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json({
            message: 'Project updated successfully',
            updated: result.modifiedCount > 0
        })
    } catch (error) {
        console.error('Error updating project:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE handler for removing a project
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db('beantown')
        const collection = db.collection('projects')

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Project deleted successfully' })
    } catch (error) {
        console.error('Error deleting project:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
} 