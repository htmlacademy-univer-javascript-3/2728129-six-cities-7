import {memo, useEffect, useRef} from 'react';
import {Icon, Map as LeafletMap, Marker, layerGroup, tileLayer} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {City, Offer} from '../../types/offer';

type Props = {city: City; offers: Offer[]; activeId?: string | null; className?: string};
const defaultIcon = new Icon({iconUrl: '/img/pin.svg', iconSize: [27, 39], iconAnchor: [13.5, 39]});
const activeIcon = new Icon({iconUrl: '/img/pin-active.svg', iconSize: [27, 39], iconAnchor: [13.5, 39]});

const Map = memo(({city, offers, activeId, className = 'cities__map'}: Props): JSX.Element => {
  const containerRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<{id: string; marker: Marker}[]>([]);
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
    const group = layerGroup().addTo(map);
    markersRef.current = offers.map((offer) => ({id: offer.id, marker: new Marker([offer.location.latitude, offer.location.longitude], {icon: defaultIcon}).addTo(group)}));
    return () => {
      markersRef.current = []; group.clearLayers(); map.removeLayer(group);
    };
  }, [offers]);
  useEffect(() => {
    markersRef.current.forEach(({id, marker}) => marker.setIcon(id === activeId ? activeIcon : defaultIcon));
  }, [activeId, offers]);
  return <section ref={containerRef} className={`${className} map`} aria-label={`Offers in ${city.name}`} style={{minHeight: '500px'}} />;
});
Map.displayName = 'Map';
export default Map;
