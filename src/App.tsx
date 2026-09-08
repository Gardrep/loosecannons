import './App.css'
import Dashboard from './components/dashboard'
import { Route, Routes } from 'react-router-dom'
import TeamOverview from './components/team-overview/team-overview'
import ApiKeyValidator from './components/api-key-validator'

function App() {
  return (<div className='bg-slate-900'>

    <ApiKeyValidator></ApiKeyValidator>
    <main className='flex flex-col bg-slate-900'>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/teamOverview/:teamId" element={<TeamOverview />} />
        {/* Fallback for 404 Not Found pages */}
        <Route path="*" element={<h1 className='text-white'>404 - Page Not Found</h1>} />
      </Routes>
    </main>
  </div>
  )
}

export default App
