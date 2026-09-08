import './App.css'
import Dashboard from './components/dashboard'
import { Route, Routes } from 'react-router-dom'
import TeamOverview from './components/team-overview/team-overview'
import ApiKeyValidator from './components/api-key-validator'

function App() {
  return (<div >
  
            <ApiKeyValidator></ApiKeyValidator>
    <main className='flex flex-col'>

        <Routes>
          <Route path="/app/" element={<Dashboard />} />
          <Route path="/app/teamOverview/:teamId" element={<TeamOverview />} />
          {/* Fallback for 404 Not Found pages */}
          <Route path="/app/*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
    </main>
    </div>
  )
}

export default App
