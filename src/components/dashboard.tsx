import { useCallback, useEffect, useMemo, useState } from "react";
// import { useRef } from "react";
import getTeams from "../api_torn_service/get-teams";
import Logos from "./logos";
import useAPIKey from "./api-key-validator/api-key-store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const API_KEY: string = useAPIKey.getState().apiKey;
  // const isFirstRender = useRef(true);
  const [allTeamsData, setAllTeamsData]: any = useState(null);

  const fetchAllTeamsData = useCallback(async () => {
    try {
      const data = await getTeams();
      if(data.error) throw new Error(data.error.error)
      setAllTeamsData(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  }, []);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return; // Skip the very first intentional mount-unmount cycle
    // }
    if (!API_KEY) {
      console.warn("No ApiKEY")
      return;
    }
    fetchAllTeamsData();
  }, [API_KEY]);

  useAPIKey.subscribe(
    (state) => {
      console.log("state", state)
      if (!state.apiKey) {
        console.warn("No Api KEY")
        return;
      }
      fetchAllTeamsData();
    }
  )




  // Compute stats using useMemo for performance optimization
  const stats = useMemo(() => {
    if (!!allTeamsData?.elimination) {
      const teams = allTeamsData?.elimination;
      const totalTeams = teams?.length;
      const totalParticipants = teams.reduce((acc: any, t: any) => acc + t.participants, 0);
      const activeTeams = teams.filter((t: any) => !t.eliminated).length;
      const avgLives =
        totalTeams > 0
          ? Math.round(teams.reduce((acc: any, t: any) => acc + t.lives, 0) / totalTeams)
          : 0;

      return { totalTeams, totalParticipants, activeTeams, avgLives };
    }
  }, [allTeamsData]);

  const renderCaptains = (team: any) => {
    const captain = team?.leaders?.captain;
    const viceCaptains = team?.leaders?.vice_captains ?? [];

    return (
      <div className="px-6 py-1 text-sm font-mono text-slate-400 flex flex-wrap gap-x-2 items-center">
        <span>{`Captain: `}
          <a
            href={`https://www.torn.com/profiles.php?XID=${captain?.id}`}
            className="text-blue-600 underline hover:text-blue-800 transition-colors"
          >
            {`${captain?.name} [${captain?.id}]`}
          </a>
        </span>

        {viceCaptains.length > 0 && (
          <div className="flex items-center gap-1">
            <span>{`Vice Captains: `}</span>
            {viceCaptains.map((viceCaptain: any, index: number) => (
              <span key={viceCaptain?.name ?? index}>
                <a
                  href={`https://www.torn.com/profiles.php?XID=${viceCaptain?.id}`}
                  className="text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  {`${viceCaptain?.name} [${viceCaptain?.id}]`}
                </a>
                {index < viceCaptains.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleTeamOverview = (teamId: number) => {
    navigate(`/app/teamOverview/${teamId}`, { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
            <span className="block text-sm text-slate-400 mb-2">Total Teams</span>
            <div className="text-3xl font-bold text-slate-100">{stats?.totalTeams}</div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
            <span className="block text-sm text-slate-400 mb-2">Total Participants</span>
            <div className="text-3xl font-bold text-slate-100">
              {stats?.totalParticipants.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
            <span className="block text-sm text-slate-400 mb-2">Avg Lives / Team</span>
            <div className="text-3xl font-bold text-slate-100">{stats?.avgLives}</div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
            <span className="block text-sm text-slate-400 mb-2">Active Teams</span>
            <div className="text-3xl font-bold text-emerald-500">{stats?.activeTeams}</div>
          </div>
        </section>

        {/* Dynamic Table Section */}
        <section className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <div className="w-full text-left border-collapse">
              <div>
                <div className="grid grid-cols-6 justify-between bg-slate-900/40 border-b border-slate-700">
                  <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">ID | Team Name</div>
                  <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Participants</div>
                  <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Score</div>
                  <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Lives</div>
                  <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">W / L</div>
                  <div className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</div>
                </div>
              </div>
              <div className="divide-y divide-slate-700">
                {allTeamsData?.elimination?.map((team: any, index: number) => (<div key={`allTeamsData-elimination-${index}-${team?.id}`}>
                  <div
                    className="grid grid-cols-6 justify-between hover:bg-slate-700/30 transition-colors"
                    onClick={()=>handleTeamOverview(team?.id)}
                  >
                    <div className="flex items-center px-6 text-sm font-semibold text-slate-100">#{team?.id}<Logos teamId={team?.id}></Logos></div>
                    <div className="px-6 py-4 text-sm text-slate-100">{team?.participants.toLocaleString()}</div>
                    <div className="px-6 py-4 text-sm text-slate-100">{team?.score.toLocaleString()}</div>
                    <div className="px-6 py-4 text-sm text-slate-100">{team?.lives}</div>
                    <div className="px-6 py-4 text-sm text-slate-100">{`${team?.wins} / ${team?.losses}`}</div>
                    <div className="px-6 py-4 text-sm">
                      {team?.eliminated ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">
                          Eliminated
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  {renderCaptains(team)}
                </div>))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard