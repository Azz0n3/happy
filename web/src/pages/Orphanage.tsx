import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
// import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import happyMapIcon from '../utils/happyIcon';
import api from '../services/api';
import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";

interface Orphanage {
  name: string,
  latitude: number,
  longitude: number,
  about: string,
  open_on_weekends: string,
  opening_hours: string,
  instructions: string,
  images: Array<{
    id: number,
    url: string
  }>
}

interface Params {
  id: string
}

export default function Orphanage() {
  const params: Params = useParams();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true
    if (mounted.current) {
      api.get(`orphanages/${params.id}`).then(response => {
        setOrphanage(response.data);
      });
      mounted.current = false;
    }
  }, [params.id]);

  if (!orphanage) return (
    <div>
      <p>Carregando...</p>
    </div>
  )

  return (
    <div id="page-orphanage">
      <main>

        <Sidebar />

        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex] ? orphanage.images[activeImageIndex].url : ''} alt={orphanage.name} />
          <div className="images">
            {
              orphanage.images.map((image, index) => {
                return (
                  <button key={image.id} className={index === activeImageIndex ? "active" : ""} type="button" onClick={() => {
                    setActiveImageIndex(index);
                  }} >
                    <img src={image.url} alt={orphanage.name} />
                  </button>
                )
              })
            }
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={happyMapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>

              <footer>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`} rel="noopener noreferrer" target="_blank">Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                {orphanage.opening_hours}
              </div>

              {
                orphanage.open_on_weekends ? (
                  < div className="open-on-weekends">
                    <FiInfo size={32} color="#37C77F" />
                    Atendemos <br />
                    Fim de semana
                  </div>
                ) : (
                    < div className="open-on-weekends dont-open">
                      <FiInfo size={32} color="#FFBCD4" />
                      Não atendemos <br />
                      Fim de semana
                    </div>
                  )
              }

            </div>
            {/* 
            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div >
  );
}