import React, { useEffect, useState, useRef } from 'react';
import mapMarkerImg from '../images/map-marker.svg';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import mapIcon from '../utils/happyIcon';
import '../styles/pages/orphanages-map.css';
import api from '../services/api';

interface Orphanage {
    name: string,
    latitude: number,
    longitude: number,
    id: number
}

function OrphanagesMaps() {

    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const mounted = useRef(true);

    useEffect(() => {
        if (mounted.current) {
            api.get('orphanages/').then(response => {
                setOrphanages(response.data);
            });
            mounted.current = false
        }
    });

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy" />
                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Jundiaí</strong>
                    <span>São Paulo</span>
                </footer>
            </aside>

            <Map
                center={[-23.0916096, -46.8844544]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer
                    url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                {
                    orphanages.map(orphanage => {
                        return (
                            <Marker
                                key={orphanage.id}
                                position={[orphanage.latitude, orphanage.longitude]}
                                icon={mapIcon}
                            >
                                <Popup closeButton={false} minWidth={248} maxWidth={248} className="map-popup">
                                    {orphanage.name}
                                    <Link to={`/orphanages/${orphanage.id}`}>
                                        <FiArrowRight size={20} color="#FFF" />
                                    </Link>
                                </Popup>
                            </Marker>

                        )
                    })
                }
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>

        </div>
    );
};


export default OrphanagesMaps;