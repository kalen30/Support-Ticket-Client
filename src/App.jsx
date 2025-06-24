/**
 * Root component for the Support Ticket Management App.
 * 
 * @returns {JSX.Element} The main application layout
 * @author Kalen Cha
 * @version 1.0.0
 */
import TicketList from './TicketList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10">
      <TicketForm />
      <TicketList />
    </div>
  )
}

export default App