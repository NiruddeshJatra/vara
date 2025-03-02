
import { useState } from 'react';
import { Star, MapPin } from 'lucide-react';
import '../styles/main.css';

// Sample data for featured listings
const featuredItems = [
  {
    id: 1,
    name: 'Sony A7 III Camera Kit',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    dailyRate: 45,
    location: 'San Francisco, CA',
    rating: 4.9,
    reviews: 124
  },
  {
    id: 2,
    name: 'Power Drill Set (Cordless)',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    dailyRate: 18,
    location: 'Los Angeles, CA',
    rating: 4.7,
    reviews: 89
  },
  {
    id: 3,
    name: 'Mountain Bike (Trek)',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    dailyRate: 30,
    location: 'Portland, OR',
    rating: 4.8,
    reviews: 56
  },
  {
    id: 4,
    name: 'MacBook Pro (2023)',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    dailyRate: 55,
    location: 'Seattle, WA',
    rating: 5.0,
    reviews: 42
  }
];

const FeaturedListings = () => {
  // This would come from a real API in a production app
  const [items] = useState(featuredItems);

  return (
    <section className="section bg-gradient-to-b from-green-100 to-white">
      <div className="container">
        <div className="section-title">
          <span className="badge">Featured</span>
          <h2>Popular Items Near You</h2>
          <p>Discover top-rated items available for rent in your area</p>
        </div>

        <div className="items-grid">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="item-card animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="item-image-container">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="item-image"
                />
                <div className="item-price-tag">
                  ${item.dailyRate}/day
                </div>
              </div>
              <div className="item-content">
                <h3 className="item-title">{item.name}</h3>
                <div className="item-location">
                  <MapPin className="item-location-icon" />
                  <span>{item.location}</span>
                </div>
                <div className="item-footer">
                  <div className="item-rating">
                    <Star className="item-star-icon" />
                    <span className="item-rating-value">{item.rating}</span>
                    <span className="item-reviews">({item.reviews} reviews)</span>
                  </div>
                  <a href="#" className="item-details-link">
                    Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign: 'center', marginTop: '3rem'}}>
          <button className="btn btn-outline btn-lg animate-fade-up" style={{ animationDelay: '0.5s' }}>
            See All Available Items
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;