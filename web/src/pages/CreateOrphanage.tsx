import React, { useState, FormEvent, ChangeEvent } from "react";
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus, FiX } from "react-icons/fi";
import api from '../services/api';

import happyMapIcon from '../utils/happyIcon';
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";

interface Orphanage {
  name: string,
  latitude: number,
  longitude: number,
  description: string,
  open_on_weekends: string,
  opening_hours: string,
  instructions: string,
}

export default function CreateOrphanage() {
  const history = useHistory();
  const [markerPosition, setMarkerPosition] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [about, setAbout] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);



  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setMarkerPosition({
      latitude: lat,
      longitude: lng
    })
  }

  async function handleSubmit(event: FormEvent) {
    const data = new FormData();
    event.preventDefault();
    const { latitude, longitude } = markerPosition;
    data.append('latitude', latitude.toString());
    data.append('longitude', longitude.toString());
    data.append('name', name);
    data.append('instructions', instructions);
    data.append('about', about);
    data.append('opening_hours', openingHours);
    data.append('open_on_weekends', openOnWeekends.toString());
    for (const image of images) {
      data.append('images', image);
    }
    await api.post('/orphanages', data);
    alert('Orfanato cadastrado com sucesso!')
    history.push('/app')
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const mewImages = Array.from(event.target.files);
    setImages([...images, ...mewImages]);
    const newPreview = mewImages.map(image => URL.createObjectURL(image));
    setPreviewImages([...previewImages, ...newPreview]);
  }

  function handleExclusion(index: number) {
    console.log(index)
    setPreviewImages(previewImages.filter((preview, i) => index !== i));
    setImages(images.filter((preview, i) => index !== i));
  }

  return (
    <div id="page-create-orphanage">
      <main>

        <Sidebar />

        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-23.0916096, -46.8844544]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              <Marker interactive={false} icon={happyMapIcon} position={[markerPosition.latitude, markerPosition.longitude]} />
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="about"
                maxLength={300}
                value={about}
                onChange={e => setAbout(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map((preview, index) => {
                    return (
                      <div key={index} className="image-area" >
                        <img src={preview} alt="test" className="new-image" />
                        <button onClick={() => handleExclusion(index)} className="delete-image-button">
                          <FiX size={23} color="#FF669D" />
                        </button>
                      </div>
                    )
                  })
                }
                <label htmlFor="images[]" id="add" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                <input onChange={handleUpload} multiple type="file" id="images[]" style={{ display: "none" }} />
              </div>

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de atendimento</label>
              <input
                id="opening_hours"
                value={openingHours}
                onChange={e => setOpeningHours(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" onClick={e => setOpenOnWeekends(true)} className={openOnWeekends ? "active" : ''}>Sim</button>
                <button type="button" onClick={e => setOpenOnWeekends(false)} className={!openOnWeekends ? "active" : ''} >Não</button>
              </div>

            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}


