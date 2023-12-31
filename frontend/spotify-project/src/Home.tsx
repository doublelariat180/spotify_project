import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faSwatchbook } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { useSpotify } from './spotify_functions';
import Loading from './Loading';
import Error from './Error';
import Invites from './Invites';
import Playlists from './Playlists';

const Home = () => {
    const userInfoObject = useSpotify('https://api.spotify.com/v1/me', 'GET', null);
    const playlistObject = useSpotify('https://api.spotify.com/v1/me/playlists', 'GET', null);
    const [window, setWindow] = useState('invites');

    return (  
        <div className="Home">
            {playlistObject.error && <Error error={playlistObject.error}/>}
            {playlistObject.isPending && <Loading/>}
            {window == 'invites' && <Invites/>}
            {playlistObject.data && window == 'library' && <Playlists userInfoObject={userInfoObject} playlistObject={playlistObject}/>}

            <div className="Buttons-Container">
                <div className="Buttons Invites" onClick={() => setWindow('invites')}>
                    <FontAwesomeIcon icon={faEnvelope} className='Buttons-Icon'/>
                    <p>Invites</p>
                </div>
                <div className="Buttons Library" onClick={() => setWindow('library')}>
                    <FontAwesomeIcon icon={faSwatchbook} className='Buttons-Icon'/>
                    <p>Library</p>
                </div>
            </div>
        </div>
    );
}
 
export default Home;