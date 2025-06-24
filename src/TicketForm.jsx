import { useState } from "react"
import { supabase } from "./supabaseClient"

/**
 * TicketForm component allows users to submit a support ticket.
 * Includes fields for name, email, issue title, description, and priority.
 * Submits the data to the Supabase 'Tickets' table.
 * 
 * @author Kalen Cha
 * @version 1.0.0
 */
function TicketForm() {
    // State for the form fields.
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        title: "",
        description: "",
        priority: "Low",
        status: "Open"
    })

    // State for displaying success/error message.
    const [message, setMessage] = useState("")

    /**
    * Handles input changes by updating form state.
    * @param {Object} e - The event object from input.
    */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    /**
    * Submits the form data to Supabase.
    * Shows a success or error message after submission.
    * Resets the form on success.
    * @param {Object} e - The form submit event.
    */
    const handleSubmit = async (e) => {
        e.preventDefault()

        const { error } = await supabase.from("Tickets").insert([formData])

        if (error) {
            setMessage("Failed to submit ticket.")
            console.error(error)
        } else {
            setMessage("Ticket submitted successfully!")
            setFormData({
                name: "",
                email: "",
                title: "",
                description: "",
                priority: "Low",
                status: "Open"
            })
            window.location.reload()
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto bg-white p-6 rounded shadow"
        >
            <h2 className="text-2xl font-bold mb-4">Submit a Support Ticket</h2>

            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full p-2 border rounded"
                required
            />
            <input

                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Issue title"
                className="w-full p-2 border rounded"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue..."
                className="w-full p-2 border rounded"
                required
            ></textarea>

            <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Submit Ticket
            </button>

            {message && <p className="text-center mt-2">{message}</p>}
        </form>
    )
}

export default TicketForm
