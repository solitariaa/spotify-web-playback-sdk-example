import React, { useState, useEffect } from 'react';
import * as DeviceApi from './DeviceApi';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {
    const { data } = props;
    const tracks = data;
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [deviceId, setDeviceId] = useState();
    const [newTracks, setNewTracks] = useState();
    useEffect(() => {
        DeviceApi.get(props.token)
        .then(response => response.json())
        .then(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {//初始化Spotify Player

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }
                setTrack(state.track_window.current_track);
                setPaused(state.paused);
    
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });
    
            }));
            player.connect();

        };
    });
    }, []);
    useEffect(() => {//当data更新的时候，更新播放的tracks列表
        if (tracks != null){
        const newi = {
            "uris": tracks.map(track => "spotify:track:" + track.id),
          };
        console.log(newi);
        setNewTracks(newi);
        }
    }, [props.data]);
    useEffect(() => {//当播放的track列表更新的时候，把正在使用的device的播放列表更改为刚刚更新的列表
        if (deviceId) {
            fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
                method: "PUT",
                headers: {
                    Authorization: 'Bearer ' + props.token
                },
                body: JSON.stringify(newTracks)
                })
                .then(response => {
                    console.log(response.status);

                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.log('No local device found');
        }
    }, [newTracks]);
        

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spot" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback
