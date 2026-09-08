import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useRef } from "react";
import { useParams } from 'react-router-dom';
import getSpecificTeam from '../../api_torn_service/get-specific-team';
import useAPIKey from '../api-key-validator/api-key-store';

// --- Types & Interfaces ---
export interface LastAction {
    status: 'Online' | 'Offline' | 'Idle' | string;
    timestamp: number;
    relative: string;
}

export interface Status {
    description: string;
    details: string;
    state: 'Abroad' | 'Okay' | 'Hospital' | 'Jail' | string;
    color: string;
    until: number;
    plane_image_type: 'private_jet' | string;
}

export interface TeamMember {
    id: number;
    name: string;
    level: number;
    last_action: LastAction;
    status: Status;
    attacks: number;
    score: number;
}

export interface TeamDashboardData {
    eliminationteam: TeamMember[];
}

// Sample Fallback Data matching your JSON schema
const defaultData: TeamDashboardData = {
    eliminationteam: [
        {
            id: 1073741824,
            name: "TESTDATA",
            level: 78,
            last_action: {
                status: "Online",
                timestamp: 1773010000,
                relative: "2 mins ago"
            },
            status: {
                description: "Traveling to Japan",
                details: "In Flight",
                state: "Abroad",
                color: "blue",
                until: 1773013600,
                plane_image_type: "private_jet"
            },
            attacks: 142,
            score: 98500
        },
        {
            id: 1073741825,
            name: "TESTDATA",
            level: 92,
            last_action: {
                status: "Offline",
                timestamp: 1772990000,
                relative: "5 hours ago"
            },
            status: {
                description: "In Hospital",
                details: "Recovering",
                state: "Hospital",
                color: "red",
                until: 1773015000,
                plane_image_type: "none"
            },
            attacks: 210,
            score: 134200
        },
        {
            id: 1073741826,
            name: "TESTDATA",
            level: 65,
            last_action: {
                status: "Online",
                timestamp: 1773011000,
                relative: "Just now"
            },
            status: {
                description: "Idle",
                details: "Ready for orders",
                state: "Okay",
                color: "green",
                until: 0,
                plane_image_type: "private_jet"
            },
            attacks: 88,
            score: 61000
        }
    ]
};

// Helper for Online / Action Status Indicator color
const getActionDotColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'online':
            return 'bg-emerald-500 shadow-emerald-500/50';
        case 'idle':
            return 'bg-amber-500 shadow-amber-500/50';
        default:
            return 'bg-slate-500 shadow-slate-500/50';
    }
};

// Helper for State Badge color
const getStateBadgeClasses = (state: string) => {
    switch (state.toLowerCase()) {
        case 'abroad':
            return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
        case 'hospital':
            return 'bg-red-500/10 text-red-400 border-red-500/20';
        case 'jail':
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        case 'okay':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        default:
            return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
};

const TeamOverview = () => {
    const { teamId } = useParams();
    const [specificTeamData, setSpecificTeamData]: any = useState(defaultData);

    const fetchSpecificTeamData = useCallback(async () => {
        try {
            const data = await getSpecificTeam(parseInt(teamId as string))
            if (data?.error) throw new Error(data.error.error)
            setSpecificTeamData(data);
        } catch (error) {
            console.error("Failed to fetch:", error);
        }
    }, []);

    useEffect(() => {
        fetchSpecificTeamData();
    }, []);

    useAPIKey.subscribe(
        () => {
            if (!specificTeamData) {
                fetchSpecificTeamData();
            }
        }
    )

    // Aggregate Metrics
    const stats = useMemo(() => {
        const members: any = specificTeamData.eliminationteam;
        const totalMembers = members.length;
        const onlineMembers = members.filter((m: any) => m.last_action.status.toLowerCase() === 'online').length;
        const totalAttacks = members.reduce((acc: any, m: any) => acc + m.attacks, 0);
        const totalScore = members.reduce((acc: any, m: any) => acc + m.score, 0);

        return { totalMembers, onlineMembers, totalAttacks, totalScore };
    }, [specificTeamData]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Stats Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg backdrop-blur-sm">
                        <span className="block text-sm font-medium text-slate-400">Total Members</span>
                        <div className="text-3xl font-bold mt-2 text-slate-100">{stats.totalMembers}</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg backdrop-blur-sm">
                        <span className="block text-sm font-medium text-slate-400">Online Now</span>
                        <div className="text-3xl font-bold mt-2 text-emerald-400">{stats.onlineMembers}</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg backdrop-blur-sm">
                        <span className="block text-sm font-medium text-slate-400">Total Attacks</span>
                        <div className="text-3xl font-bold mt-2 text-slate-100">{stats.totalAttacks.toLocaleString()}</div>
                    </div>

                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 shadow-lg backdrop-blur-sm">
                        <span className="block text-sm font-medium text-slate-400">Team Score</span>
                        <div className="text-3xl font-bold mt-2 text-indigo-400">{stats.totalScore.toLocaleString()}</div>
                    </div>
                </section>

                {/* Members Table */}
                <section className="bg-slate-800/80 border border-slate-700/60 rounded-xl shadow-xl overflow-hidden backdrop-blur-sm">
                    <div className="px-6 py-5 border-b border-slate-700/60 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-100">Member Roster</h2>
                        <span className="text-xs bg-slate-700/60 px-3 py-1 rounded-full text-slate-300 font-medium">
                            {specificTeamData.eliminationteam?.length} Users
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Level</th>
                                    <th className="px-6 py-4">Last Action</th>
                                    <th className="px-6 py-4">Status & State</th>
                                    <th className="px-6 py-4">Travel</th>
                                    <th className="px-6 py-4 text-right">Attacks</th>
                                    <th className="px-6 py-4 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 text-sm">
                                {specificTeamData.eliminationteam?.map((member: any) => (
                                    <tr key={member?.id} className="hover:bg-slate-700/30 transition-colors">

                                        {/* Member Name & ID */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${getActionDotColor(member?.last_action.status)}`} />
                                                <div>
                                                    <div className="font-semibold text-slate-100">{member?.name}</div>
                                                    <div className="text-xs font-mono text-slate-500">ID: #{member?.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Level */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-700/80 text-slate-300 border border-slate-600/50">
                                                Lvl {member.level}
                                            </span>
                                        </td>

                                        {/* Last Action */}
                                        <td className="px-6 py-4">
                                            <div className="text-slate-200">{member?.last_action.status}</div>
                                            <div className="text-xs text-slate-400">{member?.last_action.relative}</div>
                                        </td>

                                        {/* Status & State */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStateBadgeClasses(member?.status.state)}`}>
                                                    {member?.status.state}
                                                </span>
                                                <span className="text-xs text-slate-400 max-w-xs truncate" title={`${member?.status.description} - ${member?.status.details}`}>
                                                    {member?.status.description}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Travel Type */}
                                        <td className="px-6 py-4">
                                            {member?.status.plane_image_type === 'private_jet' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                    ✈️ Private Jet
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500">—</span>
                                            )}
                                        </td>

                                        {/* Attacks */}
                                        <td className="px-6 py-4 text-right font-medium text-slate-200">
                                            {member?.attacks.toLocaleString()}
                                        </td>

                                        {/* Score */}
                                        <td className="px-6 py-4 text-right font-semibold text-indigo-400">
                                            {member?.score.toLocaleString()}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default TeamOverview