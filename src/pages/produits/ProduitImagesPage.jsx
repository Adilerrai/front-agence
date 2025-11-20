import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProduitImagesManager from './ProduitImagesManager';

const ProduitImagesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button icon="ph:arrow-left" className="btn-outline-secondary" onClick={() => navigate(`/produits/${id}`)} />
          <h1 className="text-2xl font-bold">Images du produit #{id}</h1>
        </div>
        <Button className="btn-primary" text="Voir le produit" onClick={() => navigate(`/produits/${id}`)} />
      </div>

      <Card noborder>
        <ProduitImagesManager produitId={id} />
      </Card>
    </div>
  );
};

export default ProduitImagesPage;
