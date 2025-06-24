/**
 * TicketList.jsx
 * 
 * Displays a paginated list of support tickets and allows for searching, filtering, editing, resolving, and deleting.
 * 
 * Technologies: React, Supabase, Tailwind CSS
 * 
 * @author Kalen
 * @version 1.0.0
 */
import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

function TicketList() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("All")
    const [currentPage, setCurrentPage] = useState(1)
    const ticketsPerPage = 5
    const [editingTicket, setEditingTicket] = useState(null)
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        title: "",
        description: "",
        priority: "Low",
        status: "Open"
    })

    /**
    * Fetches all tickets from Supabase and updates the local state.
    */
    const fetchTickets = async () => {
        const { data, error } = await supabase.from("Tickets").select("*")
        if (error) console.error("Error fetching tickets:", error)
        else setTickets(data)
        setLoading(false)
    }

    useEffect(() => { fetchTickets() }, [])

    /**
    * Deletes a ticket by ID after user confirmation.
    * 
    * @param {string} ticketId - The ID of the ticket to delete
    */
    const handleDelete = async (ticketId) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return
        const { error } = await supabase.from("Tickets").delete().eq("id", ticketId)
        if (error) console.error("Failed to delete ticket:", error)
        else fetchTickets()
    }

    /**
    * Sets the selected ticket into editing mode.
    * 
    * @param {Object} ticket - The ticket object to be edited
    */
    const handleEdit = (ticket) => {
        setEditingTicket(ticket.id)
        setEditForm(ticket)
    }

    /**
    * Saves changes made to an edited ticket.
    * 
    * @param {string} ticketId - The ID of the ticket being updated
    */
    const saveEdit = async (ticketId) => {
        const { error } = await supabase.from("Tickets").update(editForm).eq("id", ticketId)
        if (error) console.error("Failed to update ticket:", error)
        else {
            setEditingTicket(null)
            fetchTickets()
        }
    }

    /**
    * Updates the status of a ticket to 'Resolved'.
    * 
    * @param {string} ticketId - The ID of the ticket to resolve
    */
    const handleResolve = async (ticketId) => {
        const { error } = await supabase.from("Tickets").update({ status: "Resolved" }).eq("id", ticketId)
        if (error) console.error("Failed to resolve ticket:", error)
        else fetchTickets()
    }

    /**
    * Filters the full ticket list based on the selected priority and search term.
    *
    * @type {Array<Object>} filteredTicketsRaw - The filtered array of ticket objects
    */
    const filteredTicketsRaw = tickets.filter(ticket =>
        (priorityFilter === "All" || ticket.priority === priorityFilter) &&
        (ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const indexOfLastTicket = currentPage * ticketsPerPage
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage
    const filteredTickets = filteredTicketsRaw.slice(indexOfFirstTicket, indexOfLastTicket)

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Ticket Management</h2>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="p-2 border rounded-md shadow-sm"
                    >
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search title or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full sm:w-72 p-2 border rounded-md shadow-sm"
                    />
                </div>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : tickets.length === 0 ? (
                    <p className="text-center">No tickets submitted yet.</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            {filteredTickets.map((ticket) => (
                                <div key={ticket.id} className="bg-white p-5 rounded-xl shadow border border-gray-100">
                                    {editingTicket === ticket.id ? (
                                        <>
                                            {["name", "email", "title"].map((field) => (
                                                <input
                                                    key={field}
                                                    type="text"
                                                    value={editForm[field]}
                                                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                                                    className="w-full p-2 mb-2 border rounded"
                                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                                />
                                            ))}
                                            <textarea
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                className="w-full p-2 mb-2 border rounded"
                                                placeholder="Description"
                                            ></textarea>
                                            {[['priority', ['Low', 'Medium', 'High']], ['status', ['Open', 'Resolved']]].map(([field, options]) => (
                                                <select
                                                    key={field}
                                                    value={editForm[field]}
                                                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                                                    className="w-full p-2 mb-2 border rounded"
                                                >
                                                    {options.map((opt) => <option key={opt}>{opt}</option>)}
                                                </select>
                                            ))}
                                            <div className="space-x-3">
                                                <button onClick={() => saveEdit(ticket.id)} className="text-green-600">Save</button>
                                                <button onClick={() => setEditingTicket(null)} className="text-gray-600">Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-semibold text-blue-600">{ticket.title} <span className="text-sm text-gray-500">({ticket.priority})</span></h3>
                                            <p className="text-gray-700">{ticket.description}</p>
                                            <p className="text-sm text-gray-500 mt-1">By {ticket.name} ({ticket.email})</p>
                                            <p className="text-sm text-gray-400">Status: {ticket.status} | {new Date(ticket.created_at).toLocaleString()}</p>
                                            <div className="mt-2 space-x-4">
                                                {ticket.status !== "Resolved" && (
                                                    <button onClick={() => handleResolve(ticket.id)} className="text-green-600 hover:underline text-sm">Resolve</button>
                                                )}
                                                <button onClick={() => handleEdit(ticket)} className="text-blue-600 hover:underline text-sm">Edit</button>
                                                <button onClick={() => handleDelete(ticket.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                            >Previous</button>
                            <span className="text-sm">Page {currentPage}</span>
                            <button
                                disabled={indexOfLastTicket >= filteredTicketsRaw.length}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                            >Next</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default TicketList
