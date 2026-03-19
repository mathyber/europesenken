import React, {FC, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';
import {ScoreboardRow} from '../../types/types';
import {fetchScoreboard, fetchTotalVoters} from '../../lib/api';
import {songsArray} from '../../constants/songs';
import {countryFlags} from '../../constants/countryFlags';
import Flag from '../Flag';

type LoadStatus = 'loading' | 'success' | 'error';

const Scoreboard: FC = () => {
    const [status, setStatus] = useState<LoadStatus>('loading');
    const [rows, setRows] = useState<ScoreboardRow[]>([]);
    const [totalVoters, setTotalVoters] = useState<number>(0);

    const loadData = async () => {
        try {
            const [scoreboardData, votersCount] = await Promise.all([
                fetchScoreboard(),
                fetchTotalVoters(),
            ]);

            const merged: ScoreboardRow[] = songsArray.map(song => {
                const entry = scoreboardData.find(e => e.song_id === song.id);
                return {
                    ...song,
                    likes_count: entry?.likes_count ?? 0,
                    percentage: entry?.percentage ?? 0,
                };
            });

            merged.sort((a, b) => b.likes_count - a.likes_count || a.id - b.id);

            setRows(merged);
            setTotalVoters(votersCount);
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="scoreboard">
            <div className="scoreboard__header">
                <h1>Global Scoreboard</h1>
                <div className="scoreboard__meta">
                    Eurovision 2026{!!totalVoters && ` · ${totalVoters} people swiped`}
                </div>
            </div>

            {status === 'loading' && (
                <div className="scoreboard__loader">
                    <div className="loader" />
                </div>
            )}

            {status === 'error' && (
                <div className="scoreboard__error">
                    Failed to load scoreboard.{' '}
                    <button className="btn gradient" onClick={loadData}>Try again</button>
                </div>
            )}

            {status === 'success' && (
                <>
                    {totalVoters === 0 && (
                        <div className="scoreboard__empty">
                            No likes yet. <Link to="/">Be the first to swipe!</Link>
                        </div>
                    )}
                    <div className="scoreboard__list">
                        {rows.map((row, index) => (
                            <div className="scoreboard__row" key={row.id}>
                                <span className="scoreboard__position">#{index + 1}</span>
                                <div className="scoreboard__info">
                                    <div className="scoreboard__song">{row.artist} — <b>{row.name}</b></div>
                                    <div className="scoreboard__country">
                                        <Flag emoji={countryFlags[row.country]} size={13} />
                                        {row.country}
                                    </div>
                                    <div className="scoreboard__bar">
                                        <div
                                            className="scoreboard__bar-fill"
                                            style={{width: `${row.percentage}%`}}
                                        />
                                    </div>
                                </div>
                                <div className="scoreboard__stats">
                                    <span className="scoreboard__votes">{row.likes_count} ♡</span>
                                    <span className="scoreboard__percent">{row.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Scoreboard;
