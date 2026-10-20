import {useEffect, useRef} from 'react';
import {Icon, Map as LeafletMap, Marker, layerGroup, tileLayer} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {City, Offer} from '../../types/offer';

type Props = {city: City; offers: Offer[]; activeId?: string | null; className?: string};

const defaultIcon = new Icon({iconUrl: '/img/pin.svg', iconSize: [27, 39], iconAnchor: [13.5, 39]});
const activeIcon = new Icon({iconUrl: '/img/pin-active.svg', iconSize: [27, 39], iconAnchor: [13.5, 39]});

export default function Map({city, offers, activeId, className = 'cities__map'}: Props): JSX.Element {
  const containerRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const map = new LeafletMap(containerRef.current);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap contributors'}).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove(); mapRef.current = null;
    };
  }, []);
  useEffect(() => {
    mapRef.current?.setView([city.location.latitude, city.location.longitude], city.location.zoom);
  }, [city]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    const markers = layerGroup().addTo(map);
    offers.forEach((offer) => new Marker([offer.location.latitude, offer.location.longitude], {icon: offer.id === activeId ? activeIcon : defaultIcon}).addTo(markers));
    return () => {
      markers.clearLayers(); map.removeLayer(markers);
    };
  }, [offers, activeId]);
  return <section ref={containerRef} className={`${className} map`} aria-label={`Offers in ${city.name}`} style={{minHeight: '500px'}} />;
}
