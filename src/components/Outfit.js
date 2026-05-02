import React from 'react';
import './OutfitStyles.scss';
import { useTranslation } from 'react-i18next';

const OutfitRecommendation = ({ result }) => {
  const { t } = useTranslation();
  
  if (!result?.success) return null;

  const { data } = result;

  return (
    <div className="outfit-container">
      {/* Sarlavha qismi */}
      <div className="header-box">
        <h2>{t('outfit.title')}</h2>
        <div className="summary-box">
          {data.summary}
        </div>
      </div>

      {/* Teglar */}
      <div className="tags-wrapper">
        {data.suggestions.map((item, idx) => (
          <span key={idx} className="tag-item">#{item}</span>
        ))}
      </div>

      {/* Mahsulotlar */}
      <div className="products-grid">
        {data.recommendedProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="image-area">
              <img src={product.imageUrl} alt={product.name} />
            </div>

            <div className="content-area">
              <div className="main-info">
                <h3>{product.name}</h3>
                <span className="price">
                  {parseInt(product.price).toLocaleString()} {product.currency}
                </span>
              </div>

              <div className="store-info">
                <div className="store-header">
                  🏪 {product.store.name}
                </div>
                {/* Telefon raqami qatori */}
                <a href={`tel:${product.store.phone}`} className="info-row phone-link">
                  📞 {product.store.phone}
                </a>
                {product.store.address && (
                  <div className="address">
                    📍 {product.store.address}
                  </div>
                )}
              </div>

              <div className="button-row">
                <a href={product.productUrl} target="_blank" rel="noreferrer" className="btn-main">
                  {t('outfit.buy_now')}
                </a>
                <a href={`tel:${product.store.phone}`} className="btn-outline">
                  {t('outfit.contact')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitRecommendation;