import { supabase } from './supabase';
import { ScoreboardEntry } from '../types/types';

export async function createSession(): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-session');
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data.session_token as string;
}

export async function submitVote(voterToken: string, likedSongIds: number[], sessionToken: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('submit-vote', {
        body: { voter_token: voterToken, liked_song_ids: likedSongIds, session_token: sessionToken }
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
}

export async function fetchScoreboard(): Promise<ScoreboardEntry[]> {
    const { data, error } = await supabase.from('scoreboard').select('*');
    if (error) throw error;
    return data as ScoreboardEntry[];
}

export async function fetchTotalVoters(): Promise<number> {
    const { count, error } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count ?? 0;
}
