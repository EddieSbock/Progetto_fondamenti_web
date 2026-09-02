import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Contesto } from '../contesto/AuthContext';
import './ModificaPost.css';

const categorie_presenti = ['azione', 'commedia', 'drammatico', 
        'fantascienza', 'horror', 'romantico', 'thriller', 'animazione', 
        'documentario', 'avventura', 'fantasy', 'storico','grottesco']

export default function GestionePost() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { token } = useContext(Contesto);

  const [form, setForm] = useState({
    titolo: "",
    riassunto: "",
    corpo: "",
    cover: "",
    registi: "",
    cast: "",
    voto: 10,
    categorie: []
  });

  const [errore, setErrore] = useState(null);

  useEffect(() => {
    if (id) {
      const recuperaPost = async () => {
        try {
          const post = await axios.get(`http://localhost:3000/api/post/${id}`);
          const p = post.data.post;
          setForm({
            titolo: p.titolo,
            riassunto: p.riassunto,
            corpo: p.corpo,
            cover: p.cover,
            registi: p.registi,
            cast: p.cast,
            voto: p.voto,
            categorie: p.categorie
          });
        } catch (errore) {
          setErrore("Impossibile caricare i dati del post da modificare.");
        }
      };
      recuperaPost();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(({...form, [name]: value}));
  };

  const handleCheckbox = (scelta) => {
    setForm(prev => {
      const esiste = prev.categorie.includes(scelta);
      return {
        ...prev,
        categorie: esiste ? prev.categorie.filter(c => c !== scelta) : [...prev.categorie, scelta]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (id) {
        await axios.patch(`http://localhost:3000/api/post/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate(`/post/${id}`);
      } else {
        
        const creato = await axios.post("http://localhost:3000/api/post", form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        navigate(`/post/${creato.data.post._id}`);
      }
    } catch (errore) {
      console.error(errore);
      setErrore("Errore durante il salvataggio.");
    }
  };

  return (
    <div className="form-page-container">
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-titolo">{id ? "modifica post" : "nuovo post"}</h2>
          <Link to={id ? `/post/${id}` : "/"} className="form-bottone">annulla</Link>
        </div>

        {errore && <div className="form-errore">{errore}</div>}

        <form onSubmit={handleSubmit} className="modifica-form">
          <div className="form-input">
            <label>titolo del film</label>
            <input 
                className="input-item"
                type="text" 
                name="titolo"
                value={form.titolo}
                onChange={handleChange}
                required
                placeholder="es. Kill Bill volume 1"
            />
          </div>

          <div className="form-input">
            <label>URL Immagine di Copertina</label>
            <input 
                className="input-item"
                type="url" 
                name="cover"
                value={form.cover}
                onChange={handleChange}
              
                placeholder="https://..."
            />
          </div>

          <div className="form-riga-doppia">
            <div className="form-input">
              <label>Regia</label>
              <input 
                type="text" 
                className="input-item"
                name="registi"
                value={form.registi}
                onChange={handleChange}
                placeholder="es. Christopher Nolan, Quentin Tarantino"
              />
            </div>

            <div className="form-input">
              <label>Voto (1-10)</label>
              <input 
                type="number"
                className="input-item"
                name="voto"
                min="1"
                max="10"
                value={form.voto}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-input">
            <label>Cast Principale</label>
            <input 
              type="text" 
              name="cast"
              value={form.cast}
              onChange={handleChange}
              className="input-item"
              placeholder="es. Ryan Gosling, The Rock, Ana de Armas"
            />
          </div>

          <div className="form-input">
            <label>Categorie</label>
            <div className="categorie-griglia">
              {categorie_presenti.map(categoria => (
                <label key={categoria} className="categoria-checkbox">
                  <input 
                    type="checkbox"
                    checked={form.categorie.includes(categoria)}
                    onChange={() => handleCheckbox(categoria)}
                  />
                  <span>{categoria}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-input">
            <label>Descrizione</label>
            <input 
              type="text" 
              name="riassunto"
              value={form.riassunto}
              onChange={handleChange}
              className="input-item"
              placeholder="Una frase per la homepage..."
            />
          </div>

          <div className="form-input">
            <label>Corpo del Post</label>
            <textarea 
              name="corpo"
              rows="8"
              value={form.corpo}
              onChange={handleChange}
              required
              className="input-item input-textarea"
              placeholder="Scrivi qui la recensione completa..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="form-bottone form-bottone-invio"
          >
            {id ? "aggiorna articolo" : "pubblica articolo"}
          </button>
        </form>
      </div>
    </div>
  );
}