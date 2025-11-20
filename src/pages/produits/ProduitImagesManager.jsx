import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { toast } from 'react-toastify';
import { imageMetadataService } from '@/services/apiService';

/**
 * Gestion des images d'un produit
 * Props:
 *  - produitId: number (obligatoire)
 */
const ProduitImagesManager = ({ produitId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const load = async () => {
    if (!produitId) return;
    try {
      setLoading(true);
      const data = await imageMetadataService.getByProduitId(produitId);
      setImages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors du chargement des images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [produitId]);

  const onFileChange = (f) => {
    setFile(f || null);
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const toBase64 = (f) => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(f);
  });

  const handleUpload = async () => {
    if (!file || !produitId) return;
    try {
      setUploading(true);
      const b64 = await toBase64(file);
      const dataUrl = `data:${file.type};base64,${b64}`;
      await imageMetadataService.create({
        produitId: Number(produitId),
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        url: dataUrl,
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString(),
      });
      toast.success('Image ajoutée');
      setFile(null);
      setPreview(null);
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Échec de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette image ?')) return;
    try {
      await imageMetadataService.delete(id);
      toast.success('Image supprimée');
      await load();
    } catch (e) {
      console.error(e);
      toast.error('Suppression échouée');
    }
  };

  return (
    <Card title="Images du produit" noborder>
      <div className="space-y-4">
        <div>
          <label className="form-label">Ajouter une image</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0])}
              className="form-control"
            />
            <Button className="btn-primary" text={uploading ? 'Envoi...' : 'Envoyer'} disabled={!file || uploading} onClick={handleUpload} />
          </div>
          {preview && (
            <div className="mt-3">
              <img src={preview} alt="Aperçu" className="w-32 h-32 object-cover rounded border" />
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold mb-2">Liste des images</h4>
          {loading ? (
            <div className="text-gray-500">Chargement...</div>
          ) : images.length === 0 ? (
            <div className="text-gray-500">Aucune image.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="border rounded p-2 flex flex-col items-center gap-2">
                  <img src={img.url} alt={img.fileName} className="w-32 h-32 object-cover rounded" />
                  <div className="text-xs text-center break-words max-w-[8rem]">{img.fileName}</div>
                  <Button className="btn-danger btn-sm" text="Supprimer" onClick={() => handleDelete(img.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProduitImagesManager;
